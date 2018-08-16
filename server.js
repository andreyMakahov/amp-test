var express = require('express');
var https = require('https');
var http = require('http');
var config = require('./config');

var app = express();

var imageCounter = 0;

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://127.0.0.1');
    res.append('Access-Control-Allow-Credentials', true);
    res.append('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
    next();
});

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/index2.html', function(req,res) {
    res.sendFile(__dirname + '/index2.html');
});

app.get('/index3.html', function(req,res) {
    res.sendFile(__dirname + '/index3.html');
});

app.get('/photos', function (req, res) {
    var query = [];
    if (Object.keys(req.query).length) {
        for(var i in req.query) {
            query.push(i + '=' + req.query[i]);
        }
    }

    var request = https.request(Object.assign({}, config.dataSource, {
        path: config.dataSource.path + (query.length ? '/?' + query.join('&') : ''),
    }), function(response) {
        var str = '';

        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var json = JSON.parse(str);
            res.end(JSON.stringify(json.map(function(item) {
                item.thumbnailUrl = 'https://picsum.photos/200' + '?image=' + imageCounter;
                imageCounter++;
                return item;
            })));
        });
    });

    request.end();
});

http.createServer(app).listen(config.serverConfiguration.httpPort);

https.createServer(config.serverConfiguration.ssl, app).listen(config.serverConfiguration.httpsPort);

console.log('Servers listens to http://localhost:' + config.serverConfiguration.httpPort);
console.log('Servers listens to https://localhost:' + config.serverConfiguration.httpsPort);
