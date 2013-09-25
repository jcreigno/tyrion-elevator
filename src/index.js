/*jslint node: true, vars: true, indent: 4 */
'use strict';

var http = require('http'), url = require('url');

var elevator = require('./SmartOmnibus');


function commands(el) {
    return {
        'call' : function (query) {
            return el.call(query.atFloor, query.to);
        },
        'go' : function (query) {
            return el.go(query.floorToGo);
        },
        'nextCommand': el.nextCommand.bind(el),
        'userHasEntered': el.userHasEntered.bind(el),
        'userHasExited': el.userHasExited.bind(el),
        'reset': function (query) {
            return el.reset(query.cause);
        }
    };
}

var users = {};

var server = http.createServer(function (req, res) {
    var forwarded = req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',')[0];
    var client = forwarded || req.connection.remoteAddress;
    if (!users[client]) {
        console.log('new elevator for "%s".', client);
        users[client] = commands(elevator(6));
    }
    var ctrl = users[client];
    var u = url.parse(req.url, true);
    var cmd = u.pathname.substring(1);
    res.writeHead(200);
    if (ctrl[cmd]) {
        res.write(ctrl[cmd](u.query) || '');
    } else {
        res.write('NOTHING');
    }
    res.end();
}).listen(process.env.PORT || 8080, function () {
    console.log("Listening ...");
});

module.exports = server;