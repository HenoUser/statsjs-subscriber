/**
 * @description
 * Unique id for each browser
 * @type {(number|string)}
 */
stats.clientID = (function() {
    if (localStorage) {
        if (localStorage.getItem(location.host+"_statsjs")) {
            return parseInt(localStorage.getItem(location.host+"_statsjs"));
        } else {
            var _id = (Math.round(Math.random()*100000000000)+""+Date.now());
            localStorage.setItem(location.host+"_statsjs", _id);
            return parseInt(_id);
        }
    } else {
        return "not supported";
    }
}());

/**
 * @description
 * Unique id for each session
 * @type {(number|string)}
 */
stats.sessionID = (function() {
    if (sessionStorage) {
        if (sessionStorage.getItem(location.host+"_statsjs")) {
            return parseInt(sessionStorage.getItem(location.host+"_statsjs"));
        } else {
            var _id = (Math.round(Math.random()*100000000000)+""+Date.now());
            sessionStorage.setItem(location.host+"_statsjs", _id);
            return parseInt(_id);
        }
    } else {
        return "not supported";
    }
}());

/**
 * @description
 * Client host
 * @type {string}
 */
stats.host = location.host || "not supported";

/**
 * @description
 * Referrer link that client come
 * @type {string}
 */
stats.referrer = (function() {
    var _ref = document.referrer;
    if (_ref || _ref === "") {
        if (_ref === "") {
            return "browser";
        } else {
            return _ref;
        }
    } else {
        return "not supported";
    }
}());

/**
 * @description
 * Default 'location_leave'
 */
stats.location_leave = "not recognition";
