"use strict";

/**
 * @class
 * @type {function}
 */
var Stats = function() {
    var that = this;

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
            json._method = "ws";
            connection.send(JSON.stringify(json));
            connection.onmessage = function(e) {
                if (call) call(JSON.parse(e.data)._id);
            };
        } else {
            connection = new XMLHttpRequest();
            connection.open('POST', link, true);
            json._method = "xhr";
            connection.send(JSON.stringify(json));
            connection.onreadystatechange = function() {
                if (connection.readyState === 4 && connection.status === 200) {
                    if (typeof connection.responseText === 'object') {
                        call(connection.responseText._id);
                    }
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
 */
Stats.prototype.ini = function(resource) {
    var that = this,
        cord = {},
        _array = [],
        _send = function(connection) {
            if (!sessionStorage.getItem("statjs_id")) {
                that.send(resource+"_statsjs", that, function(id) {
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
    if ("WebSocket" in window) {
        this.__proto__.connection = new WebSocket("ws://"+this.resource);
        this.__proto__.connection.onopen = function() {
            _send(that.__proto__.connection);
        }
    } else {
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
            if ("WebSocket" in window) {
                console.log(that.__proto__.connection);
                if (that.__proto__.connection) {
                    that.send(null, {
                        _id : _id,
                        history : JSON.parse(sessionStorage.getItem("statjs_history"))
                    }, null, that.__proto__.connection);
                }
            } else {
                that.send(Stats.prototype.resource+"_statsjs/"+_id, {
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
    }, 500);
};


/**
 * @namespace stats
 */
var stats = new Stats();
