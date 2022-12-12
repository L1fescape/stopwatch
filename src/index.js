const getElapsedTimeInSeconds = (startTime) => (
  ((new Date()).getTime() - startTime) / 1000
)

function stopwatch(onUpdate, updateInterval = 50) {
  let timeout
  let startTime

  function stop() {
    if (timeout) {
      clearTimeout(timeout)
    }
    startTime = null
  }

  function start() {
    startTime = (new Date()).getTime()
    const tick = () => {
      // setup the next tick timeout first in case onUpdate is slow
      timeout = setTimeout(tick, updateInterval)
      onUpdate(getElapsedTimeInSeconds(startTime))
    }
    tick()
  }

  return {
    start,
    stop,
  }
}

module.exports = stopwatch