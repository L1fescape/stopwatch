# Stopwatch
> simple terminal stopwatch

## Dependencies

- Node.js v17 and above

## Usage

Start the program with:

```
$ npm start
```

Press the "Enter" key to start the timer and press it again to stop. Repeat to record multiple segments. Press Ctrl-c to exit.

## Demo

![stopwatch demo](demo.gif)

## Notes

This was made for fun just because I wanted to figure out how it could be done. It introduced me to node's [readline](https://nodejs.org/api/readline.html) api and overriding/clearing text on stdout.

[rl.question](https://nodejs.org/api/readline.html#rlquestionquery-options) is what is being used to wait for user input. This method will only resolve its promise/callback when the "enter" key is pressed (I *think* [this is the line](https://github.com/nodejs/node/blob/0f3e5310965d7d57f208a9b675a700c998a60d54/lib/internal/readline/interface.js#L1272) that triggers it). I found myself wanting to hit the spacebar to also trigger the stopwatch start/stop. I doesn't seem possible to have the spacebar resolve the `readline.question` promise, however you can add an event listener to stdin (first call `process.stdin.setRawMode(true)` then use either `.on('data', (key) => {})` or `.on('keypress', (chunk, key) => {})`) and handle the spacebar event that way and then trigger an `abort` in readline. I played around with this a little but the control flow between readline and this new key listener got ugly fast. I know there is a clean way to do it and will likely revisit this later.
