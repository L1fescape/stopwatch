function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2).padStart(mins ? 5 : 4, '0')}s`
}

module.exports = {
  formatTime,
}