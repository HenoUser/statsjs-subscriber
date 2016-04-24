/**
 * @description
 * Get page enter time
 * @type {(number|string)}
 */
stats.time_in = Date.now() || "not supported";

/**
 * @description
 * Default value for 'time_out'
 */
stats.time_out = "not recognition";

/**
 * @description
 * Get page timings from performance object
 * @type {(object|string)}
 */
stats.timings = performance.timing || "not supported";