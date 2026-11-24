const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../raycast/lib/spotify-connect.js'), 'utf8')

function setup(options = {}) {
  const deviceName = options.deviceName || 'Amp (Office)'
  const state = {
    now: 0,
    running: options.running !== false,
    enhanced: options.enhanced !== false,
    pickerOpen: options.pickerOpen === true,
    panelReadyAt: 0,
    selectedAt: null,
    pressed: [],
    sleeps: [],
    screenChecked: false,
    screenRequested: false,
    imports: [],
    captures: [],
    created: false,
    removed: false,
    focusAttempts: 0,
    spotifyActivations: 0,
    raycastHidden: false
  }
  const previousApp = {
    processIdentifier: 2,
    bundleIdentifier: 'app.editor',
    localizedName: 'Text Editor',
    terminated: false,
    activateWithOptions: () => {
      state.focusAttempts++
      if (options.focusFails) return false
      if (!options.focusStuck) state.frontmost = previousApp
      return true
    }
  }
  const spotifyApp = { processIdentifier: 1, bundleIdentifier: 'com.spotify.client', terminated: false }
  const raycastApp = { processIdentifier: 3, bundleIdentifier: 'com.raycast.macos' }
  const raycastProcess = {}
  Object.defineProperty(raycastProcess, 'visible', {
    get: () => () => !state.raycastHidden,
    set: () => {
      if (options.hideFails) throw new Error('Could not hide Raycast before connecting Spotify.')
      state.raycastHidden = true
      if (!options.raycastStuck && state.frontmost === raycastApp) state.frontmost = previousApp
    }
  })
  state.frontmost = options.raycastFrontmost ? raycastApp : options.spotifyFrontmost ? spotifyApp : previousApp
  const app = {}
  const window = {}
  const picker = { role: 'AXCheckBox', description: 'Connect to a device' }
  const panel = { role: 'AXGroup', description: 'Connect to a device' }
  const current = { role: 'AXGroup', description: 'Current device', bounds: [700, 100, 300, 100] }
  const currentLabel = { role: 'AXGroup' }
  const currentButton = { role: 'AXButton' }
  const list = { role: 'AXList' }
  const target = { role: 'AXButton', bounds: [700, 220, 300, 80] }
  const targetLabel = { role: 'AXStaticText', value: deviceName }
  const duplicate = { role: 'AXButton', bounds: [700, 320, 300, 80] }
  const other = { role: 'AXButton', title: 'Another speaker', bounds: [700, 420, 300, 80] }
  const indicator = { role: 'AXButton' }
  const enhanced = {}
  Object.defineProperty(enhanced, 'value', {
    get: () => () => state.enhanced,
    set: value => { state.enhanced = value }
  })
  const currentName = () => {
    const confirmed = state.selectedAt !== null &&
      state.now >= state.selectedAt + (options.confirmDelay || 0)
    return options.connected || options.current || confirmed ? deviceName : 'Other device'
  }
  const targetAvailable = () => !options.missing && currentName() !== deviceName &&
    state.now >= (options.targetAvailableAt || 0)
  const listAvailable = () => state.now >= (options.listAvailableAt || 0)
  const windowInfo = { kCGWindowBounds: { X: 0, Y: 0, Width: 1000, Height: 800 } }
  function observation(label, node) {
    const [x, y, width, height] = node.bounds
    return {
      topCandidates: () => ({ js: [{ string: label }] }),
      boundingBox: {
        origin: { x: (x + width / 2 - 40) / 1000, y: 1 - (y + height / 2 + 10) / 800 },
        size: { width: 80 / 1000, height: 20 / 800 }
      }
    }
  }

  const bridge = value => value
  bridge.AXIsProcessTrusted = () => true
  bridge.CGPreflightScreenCaptureAccess = () => {
    state.screenChecked = true
    return options.screenAllowed !== false
  }
  bridge.CGRequestScreenCaptureAccess = () => { state.screenRequested = true }
  bridge.NSRunningApplication = {
    runningApplicationsWithBundleIdentifier: bundle => ({
      js: bundle === 'com.raycast.macos'
        ? (options.raycastRunning || options.raycastFrontmost ? [raycastApp] : [])
        : (state.running ? [spotifyApp] : [])
    }),
    runningApplicationWithProcessIdentifier: pid =>
      [previousApp, spotifyApp, raycastApp].find(app => app.processIdentifier === pid)
  }
  bridge.NSWorkspace = { sharedWorkspace: { frontmostApplication: state.frontmost } }
  bridge.AXUIElementCreateApplication = () => app
  bridge.NSThread = {
    sleepForTimeInterval: seconds => {
      state.sleeps.push(seconds)
      state.now += seconds * 1000
    }
  }
  bridge.NSProcessInfo = { processInfo: {} }
  Object.defineProperty(bridge.NSProcessInfo.processInfo, 'systemUptime', {
    get: () => state.now / 1000
  })
  bridge.NSTemporaryDirectory = () => '/tmp/'
  bridge.NSUUID = { UUID: { UUIDString: 'test' } }
  bridge.NSFileManager = {
    defaultManager: {
      createDirectoryAtPathWithIntermediateDirectoriesAttributesError: () => {
        state.created = true
        return true
      },
      removeItemAtPathError: () => { state.removed = true; return true }
    }
  }
  bridge.NSURL = { fileURLWithPath: value => value }
  bridge.VNImageRequestHandler = {
    alloc: { initWithURLOptions: () => ({ performRequestsError: () => true }) }
  }
  const request = { setRecognitionLevel: () => {}, setUsesLanguageCorrection: () => {} }
  Object.defineProperty(request, 'results', {
    get: () => {
      const observations = [observation(currentName(), current)]
      if (listAvailable() && targetAvailable()) {
        observations.push(observation(options.ocrLabel || deviceName, target))
        if (options.duplicate) observations.push(observation(deviceName, duplicate))
      }
      return { js: observations }
    }
  })
  bridge.VNRecognizeTextRequest = { alloc: { init: request } }
  const context = {
    $: bridge,
    ObjC: { import: name => { state.imports.push(name) }, bindFunction: () => {}, unwrap: value => value },
    Application: name => name === 'Spotify'
      ? { activate: () => {
          if ((options.raycastRunning || options.raycastFrontmost) && !state.raycastHidden) {
            throw new Error('Raycast was not dismissed before Spotify automation.')
          }
          state.spotifyActivations++
          state.running = true
          state.frontmost = spotifyApp
          if (options.previousQuits) previousApp.terminated = true
        } }
      : { processes: {
          byName: name => name === 'Raycast'
            ? raycastProcess : { attributes: { byName: () => enhanced } },
          whose: filter => () => {
            const apps = filter.frontmost ? [state.frontmost] :
              [previousApp, spotifyApp, raycastApp].filter(app =>
                !app.terminated && app.processIdentifier === filter.unixId)
            return apps.map(app => ({ unixId: () => app.processIdentifier }))
          }
        } },
    Ref: () => []
  }
  vm.createContext(context)
  vm.runInContext(source, context)

  context.attribute = (node, name) => node === app && name === 'AXWindows' ? { js: [window] } : null
  context.children = node => {
    if (node === window) {
      if (options.backgroundUnavailable && state.frontmost !== spotifyApp) return []
      const nodes = options.indicatorFirst ? [picker, indicator] : [indicator, picker]
      if (state.pickerOpen && state.now >= state.panelReadyAt &&
          (!options.backgroundPickerUnavailable || state.frontmost === spotifyApp)) nodes.push(panel)
      return nodes
    }
    if (node === panel) return listAvailable() ? [current, list] : [current]
    if (node === current && options.accessible) {
      if (state.selectedAt !== null && state.now < state.selectedAt + (options.currentLabelDelay || 0)) return []
      return [currentLabel, currentButton]
    }
    if (node === list) {
      return targetAvailable() ? [other, target, ...(options.duplicate ? [duplicate] : [])] : [other]
    }
    if (node === target && options.nestedLabel) return [targetLabel]
    return []
  }
  context.text = (node, name) => {
    if (name === 'AXRole') return node.role || null
    if (name === 'AXDescription' && node === currentLabel) return currentName()
    if (name === 'AXDescription') return node.description || null
    if (name === 'AXValue' && node === picker) return state.pickerOpen ? 1 : 0
    if (name === 'AXValue') return node.value || null
    if (name === 'AXTitle' && node === indicator) {
      return options.indicator === false || options.current ? null : `Playing on ${currentName()}`
    }
    if (name === 'AXTitle' && node === currentButton) return `${currentName()} Lossless`
    if (name === 'AXTitle' && (node === target || node === duplicate)) {
      return options.accessible && !options.nestedLabel ? deviceName : null
    }
    if (name === 'AXTitle') return node.title || null
    return null
  }
  context.press = node => {
    if ((options.raycastRunning || options.raycastFrontmost) && !state.raycastHidden) {
      throw new Error('Raycast was not dismissed before Spotify automation.')
    }
    if (node === picker) {
      state.pressed.push('picker')
      if (state.pickerOpen) {
        if (!options.stuckOpen) state.pickerOpen = false
      } else {
        state.pickerOpen = true
        state.panelReadyAt = state.now + (options.panelDelay || 0)
      }
    } else if (node === target) {
      state.pressed.push('target')
      state.selectedAt = state.now
      if (options.autoClose) state.pickerOpen = false
    } else {
      throw new Error('Unexpected control')
    }
  }
  context.capture = (info, path) => { state.captures.push(path) }
  context.visibleWindow = () => options.windowHidden && state.frontmost !== spotifyApp ? null : windowInfo
  context.geometry = (node, name) => name === 'AXPosition' ? node.bounds.slice(0, 2) : node.bounds.slice(2)
  return { context, state, run: () => context.run([deviceName]) }
}

test('does not wait, open the picker, or request screen recording when already connected', () => {
  const { run, state } = setup({ connected: true, screenAllowed: false })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.deepEqual(state.sleeps, [])
  assert.deepEqual(state.pressed, [])
  assert.equal(state.screenChecked, false)
  assert.equal(state.created, false)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
  assert.equal(state.focusAttempts, 0)
  assert.equal(state.spotifyActivations, 0)
})

test('closes an open picker when already connected', () => {
  const { run, state } = setup({ connected: true, pickerOpen: true, indicatorFirst: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.pickerOpen, false)
})

test('does not activate Spotify when the playing indicator is found before the picker', () => {
  const { run, state } = setup({ connected: true, indicatorFirst: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.spotifyActivations, 0)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})

test('still enables Spotify accessibility when starting from a cold state', () => {
  const { run, state } = setup({ running: false, enhanced: false, connected: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.running, true)
  assert.equal(state.enhanced, true)
  assert.deepEqual(state.sleeps, [1, 1])
})

test('waits for the picker and confirms a delayed connection promptly', () => {
  const { run, state } = setup({ panelDelay: 900, confirmDelay: 450 })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.removed, true)
  assert.ok(state.now < 1900)
})

test('closes an already-open picker after selecting Amp', () => {
  const { run, state } = setup({ pickerOpen: true })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['target', 'picker'])
  assert.equal(state.pickerOpen, false)
})

test('reads an unnamed current device and closes the picker', () => {
  const { run, state } = setup({ current: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.deepEqual(state.pressed, ['picker', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.removed, true)
  assert.equal(state.captures.length, 1)
})

test('does not reopen the picker when the playing indicator confirms the connection', () => {
  const { run, state } = setup({ autoClose: true })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['picker', 'target'])
  assert.equal(state.pickerOpen, false)
})

test('does not select a device when the target is missing', () => {
  const { run, state } = setup({ missing: true })
  assert.throws(run, /Could not find Amp \(Office\)/)
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.pickerOpen, true)
  assert.equal(state.removed, true)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})

test('reports an unconfirmed connection and removes the screenshot', () => {
  const { run, state } = setup({ confirmDelay: Infinity })
  assert.throws(run, /Spotify did not confirm the connection/)
  assert.deepEqual(state.pressed, ['picker', 'target'])
  assert.equal(state.removed, true)
})

test('reports when a successful connection cannot close the picker', () => {
  const { run, state } = setup({ pickerOpen: true, stuckOpen: true })
  assert.throws(run, /Spotify's device picker did not close/)
  assert.deepEqual(state.pressed, ['target', 'picker'])
  assert.equal(state.removed, true)
})

test('confirms an already-selected computer without screen recording access', () => {
  const { run, state } = setup({ deviceName: 'This computer', accessible: true, current: true, screenAllowed: false })
  assert.equal(run(), '🔊 This computer is already connected.')
  assert.deepEqual(state.pressed, ['picker', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.screenChecked, false)
  assert.equal(state.created, false)
  assert.equal(state.imports.includes('Vision'), false)
})

test('selects an accessible device and reopens the picker if Spotify closes it', () => {
  const { run, state } = setup({
    deviceName: 'This computer', accessible: true, indicator: false,
    autoClose: true, confirmDelay: 300, screenAllowed: false
  })
  assert.equal(run(), '🔊 Connected to This computer.')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.screenChecked, false)
  assert.equal(state.created, false)
})

test('waits for accessible device labels before trying a screenshot', () => {
  const { run, state } = setup({
    deviceName: 'This computer', accessible: true, listAvailableAt: 900,
    targetAvailableAt: 3100, screenAllowed: false
  })
  assert.equal(run(), '🔊 Connected to This computer.')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.screenChecked, false)
  assert.ok(state.now >= 3100)
})

test('does not select another device when an accessible target is missing', () => {
  const { run, state } = setup({ deviceName: 'This computer', accessible: true, missing: true })
  assert.throws(run, /Could not find This computer/)
  assert.deepEqual(state.pressed, ['picker'])
})

test('does not select an ambiguous accessible device', () => {
  const { run, state } = setup({ deviceName: 'This computer', accessible: true, duplicate: true })
  assert.throws(run, /More than one device matched This computer/)
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.screenChecked, false)
})

test('reports when Spotify does not confirm an accessible connection', () => {
  const { run, state } = setup({
    deviceName: 'This computer', accessible: true, indicator: false, confirmDelay: Infinity
  })
  assert.throws(run, /Spotify did not confirm the connection/)
  assert.deepEqual(state.pressed, ['picker', 'target'])
  assert.equal(state.screenChecked, false)
})

test('reports when an accessible current device is connected but the picker cannot close', () => {
  const { run, state } = setup({
    deviceName: 'This computer', accessible: true, current: true, pickerOpen: true, stuckOpen: true
  })
  assert.throws(run, /Connected to This computer, but Spotify's device picker did not close/)
  assert.deepEqual(state.pressed, ['picker'])
})

test('requests screen recording access only when a screenshot is needed', () => {
  const { run, state } = setup({ screenAllowed: false })
  assert.throws(run, /Screen & System Audio Recording/)
  assert.equal(state.screenRequested, true)
  assert.equal(state.created, false)
  assert.deepEqual(state.pressed, ['picker'])
})

test('rejects missing, empty, and extra device names before touching Spotify', () => {
  const { context, state } = setup()
  for (const args of [[], [''], ['   '], ['Amp (Office)', 'This computer']]) {
    assert.throws(() => context.run(args), /Provide exactly one Spotify device name/)
  }
  assert.deepEqual(state.pressed, [])
})

test('selects an arbitrary device by a nested accessible label', () => {
  const { run, state } = setup({
    deviceName: 'Desk speakers', accessible: true, nestedLabel: true, indicator: false, screenAllowed: false
  })
  assert.equal(run(), '🔊 Connected to Desk speakers.')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.screenChecked, false)
  assert.equal(state.created, false)
  assert.equal(state.spotifyActivations, 0)
  assert.equal(state.focusAttempts, 0)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})

test('confirms an arbitrary unnamed device through text recognition when no playing indicator exists', () => {
  const { run, state } = setup({ deviceName: 'Living room "Mini"', indicator: false, autoClose: true })
  assert.equal(run(), '🔊 Connected to Living room "Mini".')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.captures.length, 2)
  assert.equal(state.imports.filter(name => name === 'Vision').length, 1)
  assert.equal(state.removed, true)
})

test('does not match a different visible device sharing the requested name as a suffix', () => {
  for (const prefix of ['Kitchen', 'My', 'A', '2', '\u4e66\u623f']) {
    const { run, state } = setup({ deviceName: 'Desk speakers', ocrLabel: `${prefix} Desk speakers` })
    assert.throws(run, /Could not find Desk speakers/)
    assert.deepEqual(state.pressed, ['picker'])
    assert.equal(state.removed, true)
  }
})

test('allows a leading icon when recognizing a visible device name', () => {
  const { run, state } = setup({ deviceName: 'Desk speakers', ocrLabel: '> Desk speakers' })
  assert.equal(run(), '🔊 Connected to Desk speakers.')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.removed, true)
})

test('does not select an ambiguous unnamed device', () => {
  const { run, state } = setup({ deviceName: 'Desk speakers', duplicate: true })
  assert.throws(run, /More than one visible device matched Desk speakers/)
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.removed, true)
})

test('waits for an accessible current label after selection without requiring a screenshot', () => {
  const { run, state } = setup({
    deviceName: 'Desk speakers', accessible: true, indicator: false, currentLabelDelay: 600, screenAllowed: false
  })
  assert.equal(run(), '🔊 Connected to Desk speakers.')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.screenChecked, false)
  assert.ok(state.now >= 1100)
})

test('hides Raycast before remembering the previously focused app', () => {
  const { run, state } = setup({ raycastFrontmost: true, connected: true, backgroundUnavailable: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.raycastHidden, true)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
  assert.equal(state.focusAttempts, 1)
})

test('reports when Raycast cannot be dismissed before touching Spotify', () => {
  for (const options of [{ hideFails: true }, { raycastStuck: true }]) {
    const { run, state } = setup({ raycastFrontmost: true, ...options })
    assert.throws(run, /Could not hide Raycast|Raycast did not return focus/)
    assert.deepEqual(state.pressed, [])
    assert.equal(state.frontmost.bundleIdentifier, 'com.raycast.macos')
  }
})

test('does not reactivate Spotify when it was already focused', () => {
  const { run, state } = setup({ spotifyFrontmost: true, connected: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.frontmost.bundleIdentifier, 'com.spotify.client')
  assert.equal(state.focusAttempts, 0)
})

test('does not try to reopen a previous app that quit during the command', () => {
  const { run, state } = setup({ previousQuits: true, connected: true, backgroundUnavailable: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.focusAttempts, 0)
})

test('reports failed focus restoration instead of reporting success', () => {
  for (const options of [{ focusFails: true }, { focusStuck: true }]) {
    const { run, state } = setup({ connected: true, backgroundUnavailable: true, ...options })
    assert.throws(run, /Could not restore focus to Text Editor/)
    assert.equal(state.frontmost.bundleIdentifier, 'com.spotify.client')
    assert.equal(state.focusAttempts, 1)
    if (options.focusStuck) assert.equal(state.now, 2000)
  }
})

test('hides Raycast even when it is not the frontmost app', () => {
  const { run, state } = setup({ raycastRunning: true, accessible: true })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.equal(state.raycastHidden, true)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
  assert.equal(state.spotifyActivations, 0)
})

test('restores focus after foreground access even when NSWorkspace keeps its initial app cached', () => {
  const { run, state } = setup({ connected: true, backgroundUnavailable: true })
  assert.equal(run(), '🔊 Amp (Office) is already connected.')
  assert.equal(state.spotifyActivations, 1)
  assert.equal(state.focusAttempts, 1)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})

test('brings Spotify forward only if its picker cannot render in the background', () => {
  const { run, state } = setup({ accessible: true, backgroundPickerUnavailable: true })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.equal(state.spotifyActivations, 1)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})

test('restores focus when an unnamed device requires a hidden Spotify window to be shown', () => {
  const { run, state } = setup({ windowHidden: true })
  assert.equal(run(), '🔊 Connected to Amp (Office).')
  assert.equal(state.spotifyActivations, 1)
  assert.equal(state.focusAttempts, 1)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
  assert.equal(state.removed, true)
})

test('restores focus after a foreground-only command fails', () => {
  const { run, state } = setup({ backgroundUnavailable: true, missing: true })
  assert.throws(run, /Could not find Amp \(Office\)/)
  assert.equal(state.spotifyActivations, 1)
  assert.equal(state.frontmost.bundleIdentifier, 'app.editor')
})
