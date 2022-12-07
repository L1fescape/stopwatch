const readline = require('readline/promises')
const loopFactory = require('./../src/loopFactory')

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 50
const TRIGGER_KEYS = (process.env.TRIGGER_KEYS || 'space').split(',')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('SIGINT', function() {
  rl.close()
  process.emit('SIGINT')
})

let aborter = new AbortController()

async function pauseForInput() {
  await rl.question('', {
    signal: aborter.signal,
  }).catch(e => {
    // when .abort() is called it triggers rl.question() to reject it's promise.
    // in our case this means another keybinding is trying to get the readline
    // question to resolve. catch this and prevent further rejections.
    if (e.name !== 'AbortError') {
      throw e
    }
  }).finally(() => {
    // rather than only create a new AbortController when an AbortError has been thrown,
    // always setup a new AbortController so we never accidentally provide one to a new
    // question that has or will be aborted (could happen if user binds the enter key
    // as a trigger key, which is already bound by readline and would cause the first
    // question to resolve and the next one to receive a abort signal that is about to
    // be aborted)
    aborter = new AbortController()
  })
}

process.stdin.on('keypress', (_, key) => {
  if (TRIGGER_KEYS.indexOf(key.name) > -1) {
    aborter.abort()
  }
})

async function main() {
  const { loop, cleanUp } = loopFactory(pauseForInput, UPDATE_INTERVAL)

  process.stdout.write('Press enter or space to start and press again to stop. Press Ctrl-c to exit.\n')

  let shouldLoop = true
  process.on('SIGINT', function() {
    shouldLoop = false
    cleanUp()
  })

  while (shouldLoop) {
    await loop()
  }
}

(async function() {
  await main()
})()
