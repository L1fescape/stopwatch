function getElapsedTimeInSeconds(startTime) {
  const now = new Date()
  return (now.getTime() - startTime.getTime()) / 1000
}

function stopwatch(onUpdate, updateInterval = 50) {
  let interval
  let startTime

  function stop() {
    if (interval) {
      clearInterval(interval)
    }
    startTime = null
  }

  function start() {
    startTime = new Date()
    const tick = () => onUpdate(getElapsedTimeInSeconds(startTime))
    interval = setInterval(tick, updateInterval)
    tick()
  }

  return {
    start,
    stop,
  }
}

module.exports = stopwatch