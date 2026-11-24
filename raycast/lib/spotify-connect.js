ObjC.import('Cocoa')
ObjC.import('ApplicationServices')
ObjC.bindFunction('CFMakeCollectable', ['id', ['void *']])
ObjC.bindFunction('CGPreflightScreenCaptureAccess', ['bool', []])
ObjC.bindFunction('CGRequestScreenCaptureAccess', ['bool', []])

function attribute(element, name) {
  const result = Ref()
  const status = $.AXUIElementCopyAttributeValue(element, $(name), result)
  if (status === -25205 || status === -25212) return null
  if (status !== 0) throw new Error(`Could not read Spotify's ${name} (${status}).`)
  return $.CFMakeCollectable(result[0])
}

function text(element, name) {
  const value = attribute(element, name)
  return value === null ? null : ObjC.unwrap(value)
}

function children(element) {
  const value = attribute(element, 'AXChildren')
  return value === null ? [] : Array.from(value.js)
}

function* descendants(root) {
  const pending = [root]
  while (pending.length) {
    const node = pending.pop()
    yield node
    pending.push(...children(node))
  }
}

function findDescendant(root, predicate) {
  for (const node of descendants(root)) {
    if (predicate(node)) return node
  }
  return null
}

function waitFor(check, timeout, interval = 0.2) {
  const deadline = $.NSProcessInfo.processInfo.systemUptime + timeout
  while (true) {
    const result = check()
    if (result) return result
    const remaining = deadline - $.NSProcessInfo.processInfo.systemUptime
    if (remaining <= 0) return null
    $.NSThread.sleepForTimeInterval(Math.min(interval, remaining))
  }
}

function press(element) {
  const status = $.AXUIElementPerformAction(element, $('AXPress'))
  if (status !== 0) throw new Error(`Could not press Spotify's device control (${status}).`)
}

function geometry(element, name, type) {
  const value = attribute(element, name)
  const data = $.NSMutableData.dataWithLength(16)
  if (value === null || !$.AXValueGetValue(value, type, data.mutableBytes)) {
    throw new Error(`Could not read Spotify's ${name}.`)
  }

  // AXValue contains two native doubles; JXA cannot directly unwrap the struct.
  const encoded = ObjC.unwrap(data.base64EncodedStringWithOptions(0))
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let accumulator = 0
  let bits = 0
  const bytes = []
  for (const char of encoded) {
    if (char === '=') break
    accumulator = (accumulator << 6) | alphabet.indexOf(char)
    bits += 6
    if (bits >= 8) {
      bits -= 8
      bytes.push((accumulator >> bits) & 255)
    }
  }
  const view = new DataView(new Uint8Array(bytes).buffer)
  return [view.getFloat64(0, true), view.getFloat64(8, true)]
}

function containsPoint(element, point) {
  const [x, y] = geometry(element, 'AXPosition', $.kAXValueCGPointType)
  const [width, height] = geometry(element, 'AXSize', $.kAXValueCGSizeType)
  return point.x >= x && point.x < x + width && point.y >= y && point.y < y + height
}

function visibleWindow(window, pid) {
  const [x, y] = geometry(window, 'AXPosition', $.kAXValueCGPointType)
  const [width, height] = geometry(window, 'AXSize', $.kAXValueCGSizeType)
  const info = $.CFMakeCollectable($.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly, $.kCGNullWindowID))
  const matches = ObjC.deepUnwrap(info).filter(item => {
    const b = item.kCGWindowBounds
    return item.kCGWindowOwnerPID === pid && item.kCGWindowLayer === 0 &&
      b && Math.abs(b.X - x) < 2 && Math.abs(b.Y - y) < 2 &&
      Math.abs(b.Width - width) < 2 && Math.abs(b.Height - height) < 2
  })
  if (matches.length > 1) throw new Error("Could not identify Spotify's visible window.")
  return matches[0] || null
}

function capture(windowInfo, path) {
  const task = $.NSTask.alloc.init
  task.launchPath = '/usr/sbin/screencapture'
  task.arguments = $([ '-l', String(windowInfo.kCGWindowNumber), '-o', '-x', path ])
  task.launch
  task.waitUntilExit
  if (task.terminationStatus !== 0) throw new Error('Could not capture the Spotify window.')
}

function recognizedDevicePoints(windowInfo, path, deviceName) {
  capture(windowInfo, path)
  const handler = $.VNImageRequestHandler.alloc.initWithURLOptions($.NSURL.fileURLWithPath($(path)), $({}))
  const request = $.VNRecognizeTextRequest.alloc.init
  request.setRecognitionLevel($.VNRequestTextRecognitionLevelAccurate)
  request.setUsesLanguageCorrection(false)
  const error = Ref()
  if (!handler.performRequestsError($([request]), error)) {
    throw new Error(`Could not read Spotify's window: ${ObjC.unwrap(error[0].localizedDescription)}`)
  }
  const bounds = windowInfo.kCGWindowBounds
  return request.results.js.flatMap(observation => {
    const candidate = observation.topCandidates(1).js[0]
    if (!candidate) return []
    const label = ObjC.unwrap(candidate.string).trim()
    const prefix = label.endsWith(deviceName) ? label.slice(0, -deviceName.length).trim() : null
    if (prefix === null || prefix.length > 2 || /[\p{L}\p{N}]/u.test(prefix)) return []
    const box = observation.boundingBox
    return [{
      x: bounds.X + (box.origin.x + box.size.width / 2) * bounds.Width,
      y: bounds.Y + (1 - box.origin.y - box.size.height / 2) * bounds.Height
    }]
  })
}

function panel(window) {
  return findDescendant(window, node =>
    text(node, 'AXRole') === 'AXGroup' && text(node, 'AXDescription') === 'Connect to a device'
  )
}

function devicePicker(window) {
  return findDescendant(window, node =>
    text(node, 'AXRole') === 'AXCheckBox' && text(node, 'AXDescription') === 'Connect to a device'
  )
}

function openPicker(window, picker) {
  if (text(picker, 'AXValue') !== 1) press(picker)
  $.NSThread.sleepForTimeInterval(0.5)
  if (!panel(window)) Application('Spotify').activate()
  const section = waitFor(() => panel(window), 4.5, 0.5)
  if (!section) throw new Error("Spotify's device picker did not open.")
  return section
}

function isConnected(window, deviceName) {
  return findDescendant(window, node =>
    text(node, 'AXRole') === 'AXButton' && text(node, 'AXTitle') === `Playing on ${deviceName}`
  )
}

function playbackControls(window, deviceName) {
  let picker = null
  const connected = findDescendant(window, node => {
    const role = text(node, 'AXRole')
    if (!picker && role === 'AXCheckBox' && text(node, 'AXDescription') === 'Connect to a device') picker = node
    return role === 'AXButton' && text(node, 'AXTitle') === `Playing on ${deviceName}`
  })
  return { connected: connected !== null, picker }
}

function closePicker(window, picker, targetName) {
  const control = picker || devicePicker(window)
  if (!control) throw new Error(`Connected to ${targetName}, but could not find Spotify's device picker to close it.`)
  const value = text(control, 'AXValue')
  if (value === 1) press(control)
  else if (value !== 0) throw new Error("Could not check whether Spotify's device picker is open.")
  if (!waitFor(() => text(control, 'AXValue') === 0 && !panel(window), 3)) {
    throw new Error(`Connected to ${targetName}, but Spotify's device picker did not close.`)
  }
}

function deviceList(window) {
  const section = panel(window)
  if (!section) return null
  const current = findDescendant(section, node => text(node, 'AXDescription') === 'Current device')
  const list = findDescendant(section, node => text(node, 'AXRole') === 'AXList')
  if (!current || !list) return null
  const buttons = Array.from(descendants(list)).filter(node => text(node, 'AXRole') === 'AXButton')
  return { current, buttons }
}

function labels(element) {
  const values = [text(element, 'AXTitle'), text(element, 'AXDescription')]
  if (text(element, 'AXRole') === 'AXStaticText') values.push(text(element, 'AXValue'))
  return values.filter(value => typeof value === 'string' && value.trim().length > 0)
}

function hasLabel(root, deviceName) {
  return findDescendant(root, node => labels(node).includes(deviceName)) !== null
}

function locateAccessibleDevice(devices, deviceName) {
  const matches = devices.buttons.filter(button => hasLabel(button, deviceName)).map(button => ({ button }))
  if (children(devices.current).some(node => hasLabel(node, deviceName))) matches.push({ current: true })
  if (matches.length > 1) throw new Error(`More than one device matched ${deviceName}.`)
  return matches.length === 1 ? { ...matches[0], method: 'accessibility' } : null
}

function locateDevice(window, pid, deviceName, screenshotPath, useScreenshot = true) {
  let devices = deviceList(window)
  if (!devices) return null
  const accessible = locateAccessibleDevice(devices, deviceName)
  if (accessible || !useScreenshot) return accessible

  const path = screenshotPath()
  let windowInfo = visibleWindow(window, pid)
  if (!windowInfo) {
    Application('Spotify').activate()
    windowInfo = waitFor(() => visibleWindow(window, pid), 2)
    devices = waitFor(() => deviceList(window), 2)
    if (!devices) throw new Error("Could not find Spotify's device list.")
  }
  if (!windowInfo) throw new Error("Could not identify Spotify's visible window.")
  const points = recognizedDevicePoints(windowInfo, path, deviceName)
  const matches = []
  for (const point of points) {
    if (containsPoint(devices.current, point)) matches.push({ current: true })
    for (const button of devices.buttons) {
      if (containsPoint(button, point)) matches.push({ button })
    }
  }
  if (matches.length > 1) throw new Error(`More than one visible device matched ${deviceName}.`)
  return matches.length === 1 ? { ...matches[0], method: 'screenshot' } : null
}

function connect(deviceName) {
  const wasRunning = $.NSRunningApplication.runningApplicationsWithBundleIdentifier($('com.spotify.client')).js.length > 0
  if (!wasRunning) {
    Application('Spotify').activate()
    $.NSThread.sleepForTimeInterval(1)
  }
  const processes = $.NSRunningApplication.runningApplicationsWithBundleIdentifier($('com.spotify.client')).js
  if (processes.length !== 1) throw new Error('Could not identify the Spotify process.')
  const pid = processes[0].processIdentifier
  const app = $.AXUIElementCreateApplication(pid)
  const enhanced = Application('System Events').processes.byName('Spotify').attributes.byName('AXEnhancedUserInterface')
  const wasEnhanced = enhanced.value()
  enhanced.value = true
  if (!wasEnhanced) $.NSThread.sleepForTimeInterval(1)
  let window = null
  let controls = null
  for (let attempt = 0; attempt < 2; attempt++) {
    const windows = attribute(app, 'AXWindows')
    window = windows && windows.js.length ? windows.js[0] : null
    controls = window ? playbackControls(window, deviceName) : null
    if (controls && controls.picker) break
    if (attempt === 0) Application('Spotify').activate()
  }
  if (!window) throw new Error('Open a Spotify window and try again.')
  const { connected, picker } = controls
  if (connected) {
    closePicker(window, picker, deviceName)
    return `${deviceName} is already connected.`
  }
  if (!picker) throw new Error("Could not find Spotify's device picker.")
  openPicker(window, picker)

  const files = $.NSFileManager.defaultManager
  let directory = null
  function screenshotPath() {
    if (directory !== null) return directory + '/spotify.png'
    if (!$.CGPreflightScreenCaptureAccess()) {
      $.CGRequestScreenCaptureAccess()
      throw new Error('Allow the app running this command in System Settings > Privacy & Security > Screen & System Audio Recording, then quit and reopen that app.')
    }
    ObjC.import('Vision')
    const temporaryDirectory = ObjC.unwrap($.NSTemporaryDirectory()) + 'spotify-connect-' + ObjC.unwrap($.NSUUID.UUID.UUIDString)
    const error = Ref()
    if (!files.createDirectoryAtPathWithIntermediateDirectoriesAttributesError($(temporaryDirectory), false, $({ NSFilePosixPermissions: 448 }), error)) {
      throw new Error(`Could not create a temporary directory: ${ObjC.unwrap(error[0].localizedDescription)}`)
    }
    directory = temporaryDirectory
    return directory + '/spotify.png'
  }

  try {
    const devices = waitFor(() => deviceList(window), 5)
    if (!devices) throw new Error("Could not find Spotify's device list.")
    let target = locateAccessibleDevice(devices, deviceName)
    if (!target && devices.buttons.every(button => findDescendant(button, node => labels(node).length > 0))) {
      // Give accessible labels time to load without delaying unnamed device rows.
      target = waitFor(() => locateDevice(window, pid, deviceName, screenshotPath, false), 5)
    }
    if (!target) target = locateDevice(window, pid, deviceName, screenshotPath)
    if (!target) throw new Error(`Could not find ${deviceName} in Spotify's device list.`)
    if (!target.current) {
      press(target.button)
      const confirmed = waitFor(() => {
        if (isConnected(window, deviceName)) return true
        if (!panel(window)) {
          const control = devicePicker(window)
          if (!control) return null
          const value = text(control, 'AXValue')
          if (value === 0) press(control)
          else if (value !== 1) throw new Error("Could not check whether Spotify's device picker is open.")
          return null
        }
        const current = locateDevice(window, pid, deviceName, screenshotPath, target.method === 'screenshot')
        return current && current.current
      }, 12)
      if (!confirmed) {
        throw new Error(`Selected ${deviceName}, but Spotify did not confirm the connection.`)
      }
    }
    closePicker(window, target.current ? picker : null, deviceName)
    return target.current ? `${deviceName} is already connected.` : `Connected to ${deviceName}.`
  } finally {
    if (directory !== null) {
      const cleanupError = Ref()
      if (!files.removeItemAtPathError($(directory), cleanupError)) {
        throw new Error(`Could not remove temporary Spotify screenshot: ${ObjC.unwrap(cleanupError[0].localizedDescription)}`)
      }
    }
  }
}

function frontmostApplication() {
  // NSWorkspace's frontmostApplication can stay stale during an osascript run.
  const processes = Application('System Events').processes.whose({ frontmost: true })()
  if (!processes.length) return null
  if (processes.length !== 1) throw new Error('Could not identify the currently focused app.')
  return $.NSRunningApplication.runningApplicationWithProcessIdentifier(processes[0].unixId())
}

function previousApplication() {
  const app = frontmostApplication()
  const raycastIsFrontmost = app && ObjC.unwrap(app.bundleIdentifier) === 'com.raycast.macos'
  const raycast = raycastIsFrontmost ? app :
    $.NSRunningApplication.runningApplicationsWithBundleIdentifier($('com.raycast.macos')).js[0]
  if (raycast) {
    const process = Application('System Events').processes.byName('Raycast')
    process.visible = false
    if (!waitFor(() => !process.visible(), 2)) {
      throw new Error('Could not hide Raycast before connecting Spotify.')
    }
  }
  if (!raycastIsFrontmost) return app
  const previous = waitFor(() => {
    const current = frontmostApplication()
    return current && ObjC.unwrap(current.bundleIdentifier) !== 'com.raycast.macos' ? current : null
  }, 2)
  if (!previous) throw new Error('Raycast did not return focus to the previous app.')
  return previous
}

function restoreFocus(app) {
  if (!app || !Application('System Events').processes.whose({ unixId: app.processIdentifier })().length) return
  const current = frontmostApplication()
  if (current && current.processIdentifier === app.processIdentifier) return
  if (!app.activateWithOptions($.NSApplicationActivateIgnoringOtherApps) ||
      !waitFor(() => {
        const current = frontmostApplication()
        return current && current.processIdentifier === app.processIdentifier
      }, 2)) {
    throw new Error(`Could not restore focus to ${ObjC.unwrap(app.localizedName)}.`)
  }
}

function run(args = []) {
  if (args.length !== 1 || typeof args[0] !== 'string' || !args[0].trim()) {
    throw new Error('Provide exactly one Spotify device name.')
  }
  if (!$.AXIsProcessTrusted()) {
    throw new Error('Allow the app running this command in System Settings > Privacy & Security > Accessibility.')
  }
  const previous = previousApplication()
  try {
    return connect(args[0])
  } finally {
    restoreFocus(previous)
  }
}
