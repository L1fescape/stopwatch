const readline = require('readline/promises')
const { stopwatch, formatKeybinds, formatTime, parseKeybindString } = require('../src')

const DEFAULT_KEY_BINDS = 'space'

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 50
const KEY_BINDS = parseKeybindString(
  typeof process.env.KEY_BINDS !== 'undefined'
    ? process.env.KEY_BINDS
    : DEFAULT_KEY_BINDS
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

  process.stdout.write(`Press ${formatKeybinds(['enter'].concat(KEY_BINDS))} to\
 start the timer and press again to stop. Press ctrl-c to exit.\n`)

  let shouldLoop = true
  process.on('SIGINT', function() {
    shouldLoop = false
    stop()
  })

  while (shouldLoop) {
    await waitForInput()
    start()
    // todo(fix): this second call to `waitForInput()` clobbers the output of the initial
    // `tick()` of the stopwatch because it calls `readline.question('')` which will
    // clear the line via this (I think):
    // https://github.com/nodejs/node/blob/b3f5a41ad661307d9365a53b79aae122343e38c3/lib/internal/readline/interface.js#L393-L394
    // need to see if moving the cursor to the right before the call to `question` will
    // fix this. this bug is only noticable when the UPDATE_INTERVAL is ~500ms or larger
    await waitForInput()
    stop()
  }
}

(async function() {
  await main()
})()
