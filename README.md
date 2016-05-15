# statsjs-subscriber

Statistics for web applications (client side part).

Statsjs is module that grab information about site and user behavior during usage. It's using pure js in client side.

### Collect data (04.04.2016)
- 'id browser',
- 'id session',
- 'id network',
- host,
- referrer,
- 'history',
- location on site when user left,
- time that user enter,
- time that user leave,
- performance.timings,
- window resolution,
- check if cookies are enable,
- browser info,
- operating system.

### How to use
1. Run grunt default task.
2. Copy /dist/stats.min.js to your SPA project main view.
3. Ini stats with "stats.ini([statsjs server address])"

### Tests
To test statistics(client side) run '/tests/test.js'
(WARNING!!! Require '--harmony' flag for support ES6)