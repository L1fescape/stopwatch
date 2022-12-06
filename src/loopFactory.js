function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2)}s`
}

function outputTime(startTime) {
  const now = new Date()
  const secs = (now.getTime() - startTime.getTime()) / 1000
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(formatTime(secs))
}

function loopFactory(pauseForInput, updateInterval = 50) {
  let interval
  let startTime

  function cleanUp() {
    if (interval) {
      clearInterval(interval)
    }
    startTime = null
  }

  async function loop() {
    await pauseForInput()
    startTime = new Date()
    interval = setInterval(() => outputTime(startTime), updateInterval)
    await pauseForInput()
    cleanUp()
  }

  return {
    loop,
    cleanUp,
  }
}

module.exports = loopFactory