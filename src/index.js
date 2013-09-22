/*jslint node: true, vars: true, indent: 4 */

'use strict';

var http = require('http'), url = require('url');

var elevator = require('./Omnibus')(5);

var server = http.createServer(function (req, res) {
    var u = url.parse(req.url);
    var cmd = u.path.substring(1);
    res.writeHead(200);
    if (elevator[cmd]) {
        res.write(elevator[cmd].apply(elevator,[]));
    } else {
        res.write('NOTHING');
    }
    res.end();
}).listen(process.env.PORT || 8080, function () {
    console.log("Listening ...");
});


module.exports = server;