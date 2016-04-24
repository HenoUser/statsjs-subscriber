/**
 * @description
 * Browser agent info
 * @type {string}
 */
stats.browser = navigator.userAgent || "not supported";

/**
 * @description
 * Browser vendor info
 * @type {string}
 */
stats.vendor = navigator.vendor || "not supported";

/**
 * @description
 * System info
 * @type {string}
 */
stats.system = navigator.platform || "not supported";

/**
 * @description
 * Browser language info
 * @type {string}
 */
stats.language = navigator.language || "not supported";

/**
 * @description
 * Browser resolution info
 * @type {string}
 */
stats.resolution = {
    height : screen.height || "not supported",
    width : screen.width || "not supported"
};