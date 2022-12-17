const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds - (mins * 60)
  return `${mins ? mins + 'm ' : ''}${secs.toFixed(2).padStart(mins ? 5 : 4, '0')}s`
}

// source: https://gist.github.com/JamieMason/c1a089f6f1f147dbe9f82cb3e25cd12e#format-javascript-array-of-strings-to-oxford-comma
// with some tweaks
const toOxfordComma = (array, joiner = 'and') => {
  switch (array.length) {
    case 0:
      return ''
    case 1:
      return array[0]
    case 2: 
      return array.join(` ${joiner} `)
    default:
      return array
        .slice(0, array.length - 1)
        .concat(`${joiner} ${array.slice(-1)}`)
        .join(', ')
  }
}

const formatKeybinds = (keybindings) => {
  const uniqueKeybinds = [...new Set(keybindings)]
  return `the ${toOxfordComma(uniqueKeybinds, 'or')} key${uniqueKeybinds.length > 1 ? 's' : ''}`
}

const parseKeybindString = (keybindings) => (
  keybindings
    .split(',')
    .filter(k => !!k)
)

module.exports = {
  formatKeybinds,
  formatTime,
  parseKeybindString,
}