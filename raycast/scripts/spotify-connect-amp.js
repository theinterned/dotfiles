#!/usr/bin/env -S /usr/bin/osascript -l JavaScript

// @raycast.schemaVersion 1
// @raycast.title Connect Spotify to Amp
// @raycast.mode compact
// @raycast.icon ./Spotify.png
// @raycast.packageName Spotify
// @raycast.description Connect Spotify to Amp (Office) using its device picker.
// @raycast.author Ned Schwartz
// @raycast.authorURL https://github.com/theinterned

ObjC.import('Cocoa')
ObjC.import('ApplicationServices')
ObjC.import('Vision')
ObjC.bindFunction('CFMakeCollectable', ['id', ['void *']])
ObjC.bindFunction('CGPreflightScreenCaptureAccess', ['bool', []])
ObjC.bindFunction('CGRequestScreenCaptureAccess', ['bool', []])

const deviceName = 'Amp (Office)'

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

function descendants(root) {
  const pending = [root]
  const found = []
  while (pending.length) {
    const node = pending.pop()
    found.push(node)
    pending.push(...children(node))
  }
  return found
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
  if (matches.length !== 1) throw new Error("Could not identify Spotify's visible window.")
  return matches[0]
}

function capture(windowInfo, path) {
  const task = $.NSTask.alloc.init
  task.launchPath = '/usr/sbin/screencapture'
  task.arguments = $([ '-l', String(windowInfo.kCGWindowNumber), '-o', '-x', path ])
  task.launch
  task.waitUntilExit
  if (task.terminationStatus !== 0) throw new Error('Could not capture the Spotify window.')
}

function recognizedDevicePoints(windowInfo, path) {
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
    if (prefix === null || prefix.length > 2) return []
    const box = observation.boundingBox
    return [{
      x: bounds.X + (box.origin.x + box.size.width / 2) * bounds.Width,
      y: bounds.Y + (1 - box.origin.y - box.size.height / 2) * bounds.Height
    }]
  })
}

function panel(window) {
  return descendants(window).find(node =>
    text(node, 'AXRole') === 'AXGroup' && text(node, 'AXDescription') === 'Connect to a device'
  )
}

function isConnected(window) {
  return descendants(window).some(node =>
    text(node, 'AXRole') === 'AXButton' && text(node, 'AXTitle') === `Playing on ${deviceName}`
  )
}

function locateDevice(window, pid, path) {
  const section = panel(window)
  if (!section) throw new Error("Spotify's device picker is not open.")
  const nodes = descendants(section)
  const current = nodes.find(node => text(node, 'AXDescription') === 'Current device')
  const list = nodes.find(node => text(node, 'AXRole') === 'AXList')
  if (!current || !list) throw new Error("Could not find Spotify's device list.")

  const buttons = children(list).flatMap(row =>
    descendants(row).filter(node => text(node, 'AXRole') === 'AXButton')
  )
  const points = recognizedDevicePoints(visibleWindow(window, pid), path)
  const matches = []
  for (const point of points) {
    if (containsPoint(current, point)) matches.push({ current: true })
    for (const button of buttons) {
      if (containsPoint(button, point)) matches.push({ button })
    }
  }
  if (matches.length > 1) throw new Error(`More than one visible device matched ${deviceName}.`)
  return matches[0] || null
}

function run() {
  if (!$.AXIsProcessTrusted()) {
    throw new Error('Allow the app running this command in System Settings > Privacy & Security > Accessibility.')
  }
  if (!$.CGPreflightScreenCaptureAccess()) {
    $.CGRequestScreenCaptureAccess()
    throw new Error('Allow the app running this command in System Settings > Privacy & Security > Screen & System Audio Recording, then quit and reopen that app.')
  }

  Application('Spotify').activate()
  $.NSThread.sleepForTimeInterval(1)
  const processes = $.NSRunningApplication.runningApplicationsWithBundleIdentifier($('com.spotify.client')).js
  if (processes.length !== 1) throw new Error('Could not identify the Spotify process.')
  const pid = processes[0].processIdentifier
  const app = $.AXUIElementCreateApplication(pid)
  Application('System Events').processes.byName('Spotify').attributes.byName('AXEnhancedUserInterface').value = true
  $.NSThread.sleepForTimeInterval(1)
  const windows = attribute(app, 'AXWindows')
  if (!windows || windows.js.length === 0) throw new Error('Open a Spotify window and try again.')
  const window = windows.js[0]
  if (isConnected(window)) return `${deviceName} is already connected.`
  const picker = descendants(window).find(node =>
    text(node, 'AXRole') === 'AXCheckBox' && text(node, 'AXDescription') === 'Connect to a device'
  )
  if (!picker) throw new Error("Could not find Spotify's device picker.")
  if (text(picker, 'AXValue') !== 1) press(picker)

  let section = null
  for (let i = 0; i < 10 && !section; i++) {
    $.NSThread.sleepForTimeInterval(0.5)
    section = panel(window)
  }
  if (!section) throw new Error("Spotify's device picker did not open.")

  const files = $.NSFileManager.defaultManager
  const directory = ObjC.unwrap($.NSTemporaryDirectory()) + 'spotify-connect-' + ObjC.unwrap($.NSUUID.UUID.UUIDString)
  const error = Ref()
  if (!files.createDirectoryAtPathWithIntermediateDirectoriesAttributesError($(directory), false, $({ NSFilePosixPermissions: 448 }), error)) {
    throw new Error(`Could not create a temporary directory: ${ObjC.unwrap(error[0].localizedDescription)}`)
  }
  const path = directory + '/spotify.png'
  try {
    const target = locateDevice(window, pid, path)
    if (!target) throw new Error(`Could not read ${deviceName} in Spotify's visible device list.`)
    if (target.current) return `${deviceName} is already connected.`
    press(target.button)
    for (let i = 0; i < 12; i++) {
      $.NSThread.sleepForTimeInterval(1)
      if (isConnected(window)) return `Connected to ${deviceName}.`
    }
    throw new Error(`Selected ${deviceName}, but Spotify did not confirm the connection.`)
  } finally {
    const cleanupError = Ref()
    if (!files.removeItemAtPathError($(directory), cleanupError)) {
      throw new Error(`Could not remove temporary Spotify screenshot: ${ObjC.unwrap(cleanupError[0].localizedDescription)}`)
    }
  }
}
