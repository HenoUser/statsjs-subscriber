"use strict";
const http = require("http"),
    fs = require("fs");

/**
 * Controllers namespace
 * @type {{}}
 */
const controllers = {};

http.createServer((req, res) => {

    /**
     * Sending index.html to client
     */
    function index() {
        res.writeHead(200, {"Content-type" : "text/html"});
        fs.readFile("./tests/index.html", (err, data) => {
            if (err) return res.end(err);
            res.end(data);
        });
    }
    controllers['/'] = index;
    controllers['/test'] = index;
    controllers['/witryna'] = index;

    /**
     * Sending statsjs script file
     */
    controllers['/dist/statsjs.js'] = function() {
        res.writeHead(200, {"Content-type" : "application/x-javascript"});
        fs.readFile("./dist/statsjs.js", (err, data) => {
            if (err) return res.end(err);
            res.end(data);
        });
    };

    /**
     * Receive data from client statsjs logic
     */
    controllers['/_statsjs'] = function() {
        let _body = "",
            id = Math.round(Math.random()*1000000000);
        req.on('data', function(data) {
            _body += data;
        });
        req.on('end', function() {
            _body = JSON.parse(_body);
            console.warn(`Zapisz obiekt: ${id}`);
            // console.dir(_body);
            res.writeHead(200, {"Content-type" : "application/json"});
            res.end(JSON.stringify({ _id : id }));
        });
    };
    controllers['/_statsjs/:param'] = function(param) {
        let _body = "";
        req.on('data', function(data) {
            _body += data;
        });
        req.on('end', function() {
            _body = JSON.parse(_body);
            console.warn(`Zaktualizuj dokument '${param}' obiektem:`);
            // console.dir(_body);
            res.writeHead(200, {"Content-type" : "application/json"});
            res.end(JSON.stringify(param));
        });
    };

    /**
     * Router
     */
    try {
        if (req.url.indexOf("/_statsjs/") === 0) {
            controllers[req.url.replace(/\/\w*$/, "/:param")](req.url.match(/\/\w*$/)[0].replace('/', ''));
        } else {
            controllers[req.url]();
        }
    } catch (e) {
        // console.error(req.url);
    }

}).listen(3000);

console.log("Server listening on 3000");
