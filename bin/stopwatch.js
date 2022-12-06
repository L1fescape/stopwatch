const readline = require('readline/promises')
const loopFactory = require('./../src/loopFactory')

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 50

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function pauseForInput() {
  await rl.question('')
}

rl.on('SIGINT', function() {
  rl.close()
  process.emit('SIGINT')
})

async function main() {
  const { loop, cleanUp } = loopFactory(pauseForInput, UPDATE_INTERVAL)

  process.stdout.write('Press the Enter key to start and press again to stop. Press Ctrl-c to exit.\n')

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
