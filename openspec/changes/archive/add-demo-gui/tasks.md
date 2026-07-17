# Tasks

- [x] 1.1 `demo/index.html`: control bar markup + iframe, dark minimal chrome, monospace labels
- [x] 1.2 `demo/main.js`: state object, `render()` sets `iframe.srcdoc` from `renderDocument(shuffle(state))`
- [x] 1.3 Wire controls → state → render; reshuffle assigns a fresh random seed
- [x] 1.4 Copy-export via `navigator.clipboard.writeText`; flash "copied" feedback
- [x] 1.5 Hash round-trip: write state to `location.hash`, restore on load
- [x] 1.6 Verify: `npm run build && npm run serve`, open `/demo/`, reshuffle 10×, toggle every control — zero console errors; exported doc pasted to a bare `.html` renders identically
