const readline = require('readline')

const UPDATE_INTERVAL = 50

let interval
let startTime

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('SIGINT', function() {
  rl.close()
  process.emit('SIGINT')
})

function handleStart() {
  return new Promise(resolve => rl.question('', () => {
    resolve(true)
  }))
}

function handleStop() {
  return new Promise(resolve => rl.question('', () => {
    cleanUp()
    resolve(true)
  }))
}

function cleanUp() {
  if (interval) {
    clearInterval(interval)
  }
  startTime = null
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2)}s`
}

function outputTime() {
  if (!startTime) startTime = new Date()
  const secs = ((new Date()).getTime() - startTime.getTime()) / 1000
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(formatTime(secs))
}

async function run() {
  await handleStart()
  interval = setInterval(outputTime, UPDATE_INTERVAL)
  await handleStop()
}

(async function() {
  let shouldLoop = true

  console.log('Press enter to start and again to stop. Press Ctrl-c to exit.')

  process.on('SIGINT', function() {
    shouldLoop = false
    cleanUp()
  })

  while (shouldLoop) {
    await run()
  }
})()
