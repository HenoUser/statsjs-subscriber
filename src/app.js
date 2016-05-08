"use strict";

/**
 * @class
 * @type {function}
 */
var Stats = function() {
    var that = this;

    this._ws = ("WebSocket" in window);

    /**
     * @description
     * Sending json to 'link' resources on server
     * @param link
     * @param json
     * @param call
     * @param connection
     */
    this.send = function(link, json, call, connection) {
        // Try to connect by WebSocket
        if (connection) {
            connection.send(JSON.stringify(json));
            connection.onmessage = function(e) {
                if (call) call(JSON.parse(e.data)._id);
            };
        } else {
            connection = new XMLHttpRequest();
            connection.open('POST', link, true);
            connection.setRequestHeader("Content-Type", "application/json");
            connection.setRequestHeader("X-API-Key", "dK3o0_d4%_d7G");
            connection.send(JSON.stringify(json));
            connection.onreadystatechange = function() {
                if (connection.readyState === 4 && connection.status === 200 && !!call) {
                    call(JSON.parse(connection.responseText)._id);
                }
            };
        }
    };
};

Stats.prototype.resource = null;

Stats.prototype.connection = null;

/**
 * @description
 * Initialize (send) statistics info and resource link
 * @param resource
 * @param ssl
 */
Stats.prototype.ini = function(resource, ssl) {
    var that = this,
        cord = {},
        _array = [],
        _ssl = (ssl) ? "https" : "http",
        _send = function(connection) {
            if (!sessionStorage.getItem("statjs_id")) {
                that.send(resource+"/_statsjs", that, function(id) {
                    sessionStorage.setItem("statjs_id", id);
                }, connection);
            } else {
                that.id = sessionStorage.getItem("statjs_id");
            }
        };

    Stats.prototype.resource = resource;

    /**
     * Try to connect with WebSocket
     */
    if (this._ws) {
        this.__proto__.connection = new WebSocket("ws://"+this.resource);
        this.__proto__.connection.onopen = function() {
            _send(that.__proto__.connection);
        }
    } else {
        this.__proto__.resource = _ssl+"://"+this.__proto__.resource;
        _send(false);
    }

    /**
     * @description
     * Send time when client leave page and link
     */
    // window.addEventListener('beforeunload', function() {
    //     var _id = that.id || sessionStorage.getItem("statjs_id");
    //     that.send(Stats.prototype.resource+"_statsjs/"+_id.replace("statjs", ""), {
    //         time_out : that.update_time_out(),
    //         location_leave : location.pathname,
    //         history : sessionStorage.getItem("statjs_history")
    //     });
    // });

    /**
     * @description
     * DANGER! TESTING FEATURE!!
     */
    setInterval(function() {
        cord = {};
        if (sessionStorage.getItem("statjs_history")) {
            console.log(sessionStorage.getItem("statjs_history"));
            var history = JSON.parse(sessionStorage.getItem("statjs_history"));
            if (history[history.length-1].path === location.pathname) return;
            // cord[location.pathname] = Date.now();
            cord.path = location.pathname;
            cord.time_in = Date.now();
            history.push(cord);
            sessionStorage.setItem("statjs_history", JSON.stringify(history));
            var _id = that.id || sessionStorage.getItem("statjs_id");
            if (that._ws) {
                console.log(that.__proto__.connection);
                if (that.__proto__.connection) {
                    that.send(null, {
                        _id : _id,
                        history : JSON.parse(sessionStorage.getItem("statjs_history"))
                    }, null, that.__proto__.connection);
                }
            } else {
                that.send(Stats.prototype.resource+"/_statsjs/"+_id, {
                    _id : _id,
                    history : sessionStorage.getItem("statjs_history")
                }, null);
            }
        } else {
            // cord[location.pathname] = Date.now();
            cord.path = location.pathname;
            cord.time_in = Date.now();
            _array[0] = cord;
            sessionStorage.setItem("statjs_history", JSON.stringify(_array));
        }
    // TODO(jurek) Define interval time as value and add to statsjs object
    }, 500);
};


/**
 * @namespace stats
 */
var stats = new Stats();
