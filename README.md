# Stopwatch
> simple terminal stopwatch

## Dependencies

- Node.js v17 and above

## Usage

Start the program with:

```
$ npm start
```

Press enter or spacebar to start the timer and press again to stop. Repeat to record multiple segments. Press ctrl-c to exit.

The keyboard bindings which trigger starting and stopping the stopwatch can be changed by setting the `KEY_BINDS` environment variable with the desired keys as a comma separated list:

```
$ KEY_BINDS=escape,w,a,s,d npm start
```

Behind the scenes this script is using `process.stdin.on('keypress', (chunk, key) => {})` to listen for keypress events. If there's a key you're defining in `KEY_BINDS` that's not working either check out how [readline defines the key names](https://github.com/nodejs/node/blob/5fad0b93667ffc6e4def52996b9529ac99b26319/lib/internal/readline/utils.js#L213-L312) or raise an issue and I can take a look.

## Demo

![stopwatch demo](demo.gif)

## Notes

This was made for fun and to learn something new. This project introduced me to the [Readline](https://nodejs.org/api/readline.html) and [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) APIs, which I had no prior experience with before this project. Pull requests are welcome!