const readline = require('readline/promises')
const { stopwatch, formatKeybindings, formatTime } = require('../src')

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 50
const TRIGGER_KEYS = (
  (typeof process.env.TRIGGER_KEYS === 'undefined' ? 'space' : process.env.TRIGGER_KEYS) // add 'space' as a default trigger key
    .split(',')
    .filter(k => !!k)
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('SIGINT', function() {
  rl.close()
  process.emit('SIGINT')
})

let aborter = new AbortController()

async function waitForInput() {
  await rl.question('', {
    signal: aborter.signal,
  }).catch(e => {
    // when the abort signal is triggered the rl.question promise will resolve to a
    // rejection. catch this and don't allow it to propigate since in our scenario it's
    // not an error (the user is closing the readline prompt with a custom keybinding). 
    // other errors should still be thrown.
    if (e.name !== 'AbortError') {
      throw e
    }
  }).finally(() => {
    // always setup a new AbortController for each prompt to avoid any race conditions
    // where .abort() is called after checking `signal.aborted` and assigning an old
    // signal to a new prompt, causing it to automatically close
    aborter = new AbortController()
  })
}

process.stdin.on('keypress', (_, key) => {
  // ignore ctrl-c here because it will interfere with readline's SIGINT being thrown
  if (key.name === 'c' && key.ctrl) {
    return
  }
  if (TRIGGER_KEYS.indexOf(key.name) > -1) {
    aborter.abort()
  }
})

function onUpdate(secs) {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(formatTime(secs))
}

async function main() {
  const { start, stop } = stopwatch(onUpdate, UPDATE_INTERVAL)

  process.stdout.write(`Press ${formatKeybindings(['enter'].concat(TRIGGER_KEYS))} to\
 start the timer and press again to stop. Press Ctrl-c to exit.\n`)

  let shouldLoop = true
  process.on('SIGINT', function() {
    shouldLoop = false
    stop()
  })

  while (shouldLoop) {
    await waitForInput()
    start()
    await waitForInput()
    stop()
  }
}

(async function() {
  await main()
})()
