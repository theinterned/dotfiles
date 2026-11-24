const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../raycast/scripts/spotify-connect-amp.js'), 'utf8')

function setup(options = {}) {
  const state = {
    now: 0,
    running: options.running !== false,
    enhanced: options.enhanced !== false,
    pickerOpen: options.pickerOpen === true,
    panelReadyAt: 0,
    selectedAt: null,
    pressed: [],
    sleeps: [],
    removed: false
  }
  const app = {}
  const window = {}
  const picker = { role: 'AXCheckBox', description: 'Connect to a device' }
  const panel = { role: 'AXGroup', description: 'Connect to a device' }
  const indicator = { role: 'AXButton' }
  const target = {}
  const enhanced = {}
  Object.defineProperty(enhanced, 'value', {
    get: () => () => state.enhanced,
    set: value => { state.enhanced = value }
  })

  const bridge = value => value
  bridge.AXIsProcessTrusted = () => true
  bridge.CGPreflightScreenCaptureAccess = () => true
  bridge.NSRunningApplication = {
    runningApplicationsWithBundleIdentifier: () => ({
      js: state.running ? [{ processIdentifier: 1 }] : []
    })
  }
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
      createDirectoryAtPathWithIntermediateDirectoriesAttributesError: () => true,
      removeItemAtPathError: () => { state.removed = true; return true }
    }
  }
  const context = {
    $: bridge,
    ObjC: { import: () => {}, bindFunction: () => {}, unwrap: value => value },
    Application: name => name === 'Spotify'
      ? { activate: () => { state.running = true } }
      : { processes: { byName: () => ({ attributes: { byName: () => enhanced } }) } },
    Ref: () => []
  }
  vm.createContext(context)
  vm.runInContext(source, context)

  context.attribute = (node, name) => node === app && name === 'AXWindows' ? { js: [window] } : null
  context.children = node => {
    if (node !== window) return []
    const nodes = options.indicatorFirst ? [picker, indicator] : [indicator, picker]
    if (state.pickerOpen && state.now >= state.panelReadyAt) nodes.push(panel)
    return nodes
  }
  context.text = (node, name) => {
    if (name === 'AXRole') return node.role || null
    if (name === 'AXDescription') return node.description || null
    if (name === 'AXValue' && node === picker) return state.pickerOpen ? 1 : 0
    if (name === 'AXTitle' && node === indicator) {
      const connected = options.connected || (
        state.selectedAt !== null && state.now >= state.selectedAt + (options.confirmDelay || 0)
      )
      return connected ? 'Playing on Amp (Office)' : 'Playing on this computer'
    }
    return null
  }
  context.press = node => {
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
  context.locateDevice = () => {
    if (options.missing) return null
    return options.current ? { current: true } : { button: target }
  }
  return { context, state }
}

test('does not wait or open the picker when Amp is already connected', () => {
  const { context, state } = setup({ connected: true })
  assert.equal(context.run(), 'Amp (Office) is already connected.')
  assert.deepEqual(state.sleeps, [])
  assert.deepEqual(state.pressed, [])
})

test('closes an open picker when Amp is already connected', () => {
  const { context, state } = setup({ connected: true, pickerOpen: true, indicatorFirst: true })
  assert.equal(context.run(), 'Amp (Office) is already connected.')
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.pickerOpen, false)
})

test('still enables Spotify accessibility when starting from a cold state', () => {
  const { context, state } = setup({ running: false, enhanced: false, connected: true })
  assert.equal(context.run(), 'Amp (Office) is already connected.')
  assert.equal(state.running, true)
  assert.equal(state.enhanced, true)
})

test('waits for the picker and confirms a delayed connection promptly', () => {
  const { context, state } = setup({ panelDelay: 900, confirmDelay: 450 })
  assert.equal(context.run(), 'Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['picker', 'target', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.removed, true)
  assert.ok(state.now < 1900)
})

test('closes an already-open picker after selecting Amp', () => {
  const { context, state } = setup({ pickerOpen: true })
  assert.equal(context.run(), 'Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['target', 'picker'])
  assert.equal(state.pickerOpen, false)
})

test('closes the picker when Amp is the current device', () => {
  const { context, state } = setup({ current: true })
  assert.equal(context.run(), 'Amp (Office) is already connected.')
  assert.deepEqual(state.pressed, ['picker', 'picker'])
  assert.equal(state.pickerOpen, false)
  assert.equal(state.removed, true)
})

test('does not reopen the picker when Spotify closes it', () => {
  const { context, state } = setup({ autoClose: true })
  assert.equal(context.run(), 'Connected to Amp (Office).')
  assert.deepEqual(state.pressed, ['picker', 'target'])
  assert.equal(state.pickerOpen, false)
})

test('does not select a device when the target is missing', () => {
  const { context, state } = setup({ missing: true })
  assert.throws(() => context.run(), /Could not read Amp \(Office\)/)
  assert.deepEqual(state.pressed, ['picker'])
  assert.equal(state.pickerOpen, true)
  assert.equal(state.removed, true)
})

test('reports an unconfirmed connection and removes the screenshot', () => {
  const { context, state } = setup({ confirmDelay: Infinity })
  assert.throws(() => context.run(), /Spotify did not confirm the connection/)
  assert.deepEqual(state.pressed, ['picker', 'target'])
  assert.equal(state.removed, true)
})

test('reports when a successful connection cannot close the picker', () => {
  const { context, state } = setup({ pickerOpen: true, stuckOpen: true })
  assert.throws(() => context.run(), /Spotify's device picker did not close/)
  assert.deepEqual(state.pressed, ['target', 'picker'])
  assert.equal(state.removed, true)
})
