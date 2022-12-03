const readline = require('readline/promises')

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

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2)}s`
}

function outputTime() {
  const now = new Date()
  const secs = (now.getTime() - startTime.getTime()) / 1000
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(formatTime(secs))
}

function cleanUp() {
  if (interval) {
    clearInterval(interval)
  }
  startTime = null
}

async function pauseForInput() {
  await rl.question('')
}

async function loop() {
  // pause execution until user wants to start the timer
  await pauseForInput()

  // init stopwatch loop
  startTime = new Date()
  interval = setInterval(outputTime, UPDATE_INTERVAL)

  // pause execution again until user wants to stop
  await pauseForInput()

  // kill stopwatch loop
  cleanUp()
}

(async function() {
  process.stdout.write('Press the Enter key to start and again to stop. Press Ctrl-c to exit.\n')

  let shouldLoop = true
  process.on('SIGINT', function() {
    shouldLoop = false
    cleanUp()
  })

  while (shouldLoop) {
    await loop()
  }
})()
