const http = require('http'),
    request = require("request"),
    fs = require('fs'),
    path = require('path'),
    contentTypes = require('./utils/content-types'),
    sysInfo = require('./utils/sys-info'),
    jquery = require('jquery'),
    env = process.env;

let server = http.createServer(function (req, res) {
    let url = req.url;

    // health monitoring

    if (url == '/health') {
        res.writeHead(200);
        res.end();
    } else if (url == '/products') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Origin', '*');

        request({
            url: 'https://services.odata.org/OData/OData.svc/Products',
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(body.value);
                res.writeHead(200);
                res.end(JSON.stringify(body.value));
            }
            else {
                res.writeHead(404);
                res.end('Not found');
            }
        });
    }
});

server.listen(env.NODE_PORT || 4000, env.NODE_IP || 'localhost', function () {
    console.log(`Application worker ${process.pid} started...`);
});
