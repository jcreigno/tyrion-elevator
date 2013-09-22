/*jslint node: true, vars: true, indent: 4 */

'use strict';

var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200);
    res.write('NOTHING');
    res.end();
}).listen(process.env.PORT || 8080, function () {
    console.log("Listening ...");
});
