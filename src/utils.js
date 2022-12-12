function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2).padStart(mins ? 5 : 4, '0')}s`
}

// source: https://gist.github.com/JamieMason/c1a089f6f1f147dbe9f82cb3e25cd12e#format-javascript-array-of-strings-to-oxford-comma
// with some tweaks. maybe should rewrite this without ternaries for readablility
const toOxfordComma = (array, joiner = 'and') =>
  array.length === 1
    ? array[0]
    : array.length === 2
      ? array.join(` ${joiner} `)
      : array.length > 2
        ? array
            .slice(0, array.length - 1)
            .concat(`${joiner} ${array.slice(-1)}`)
            .join(', ')
        : array.join(', ')

module.exports = {
  formatTime,
  toOxfordComma,
}