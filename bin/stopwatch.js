const readline = require('readline')
const { stopwatch, formatKeybinds, formatTime, parseKeybinds } = require('../src')

const DEFAULT_KEY_BINDS = ['return', 'space']

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 50
const KEY_BINDS = parseKeybinds(
  typeof process.env.KEY_BINDS !== 'undefined'
    ? process.env.KEY_BINDS
    : DEFAULT_KEY_BINDS
)

readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

let aborter = new AbortController()

async function waitForInput() {
  await new Promise(resolve => {
    aborter.signal.addEventListener('abort', resolve)
  })
    .then(() => aborter = new AbortController())
}

process.stdin.on('keypress', (_, key) => {
  if (key.name === 'c' && key.ctrl) {
    process.emit('SIGINT')
    return
  }
  if (KEY_BINDS.indexOf(key.name) > -1) {
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

  process.stdout.write(`Press ${formatKeybinds(KEY_BINDS)} to start the timer and\
 press again to stop. Press ctrl-c to exit.\n`)

  process.on('SIGINT', function() {
    stop()
    process.exit(0)
  })

  while (true) {
    process.stdout.write('\n')
    await waitForInput()
    start()
    await waitForInput()
    stop()
  }
}

(async function() {
  await main()
})()
