"use strict";

/**
 * @class
 * @type {function}
 */
var Stats = function() {

    /**
     * @description
     * Sending json to 'link' resources on server
     * @param link
     * @param json
     * @param call
     */
    this.send = function(link, json, call) {
        var xhr = new XMLHttpRequest(),
            _response;
        xhr.open('POST', link, true);
        xhr.send(JSON.stringify(json));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof xhr.responseText === 'object') {
                    call(xhr.responseText._id);
                } else {
                    _response = JSON.parse(xhr.responseText);
                    call(_response._id);
                }
            }
        };
    };
};

/**
 * @description
 * Simple info
 * @type {function}
 */
Stats.prototype.info = function() {
    console.warn("\"Statsjs\" by Paweł Jurekiwicz 'HenoUser' 2016\n https://github.com/HenoUser/statsjs");
};

Stats.prototype.resource = null;

/**
 * @description
 * Get page leave time
 * @type {(number|string)}
 */
Stats.prototype.update_time_out = function() {
    return Date.now() || "not supported";
};

/**
 * @description
 * Initialize (send) statistics info and resource link
 * @param resource
 */
Stats.prototype.ini = function(resource) {
    var that = this,
        cord = {},
        _array = [];
    Stats.prototype.resource = resource;
    if (!sessionStorage.getItem("statjs_id")) {
        this.send(resource, this, function(id) {
            sessionStorage.setItem("statjs_id", id);
        });
    } else {
        this.id = sessionStorage.getItem("statjs_id");
    }

    /**
     * @description
     * Send time when client leave page and link
     */
    window.addEventListener('beforeunload', function() {
        var _id = that.id || sessionStorage.getItem("statjs_id");
        that.send(Stats.prototype.resource+"/"+_id.replace("statjs", ""), {
            time_out : that.update_time_out(),
            location_leave : location.pathname,
            history : sessionStorage.getItem("statjs_history")
        });
    });

    /**
     * @description
     * DANGER! TESTING FEATURE!!
     */
    setInterval(function() {
        cord = {};
        if (sessionStorage.getItem("statjs_history")) {
            console.log(sessionStorage.getItem("statjs_history"));
            var history = JSON.parse(sessionStorage.getItem("statjs_history"));
            if (history[history.length-1][location.pathname]) return;
            cord[location.pathname] = Date.now();
            history.push(cord);
            sessionStorage.setItem("statjs_history", JSON.stringify(history));
        } else {
            cord[location.pathname] = Date.now();
            _array[0] = cord;
            sessionStorage.setItem("statjs_history", JSON.stringify(_array));
        }
    }, 1000);
};


/**
 * @namespace stats
 */
var stats = new Stats();
