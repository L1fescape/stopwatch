function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2)}s`
}

module.exports = {
  formatTime,
}