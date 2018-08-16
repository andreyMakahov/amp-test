var fs = require('fs');

module.exports = {
    serverConfiguration: {
        ssl: {
            key: fs.readFileSync('client-key.pem'),
            cert: fs.readFileSync('client-cert.pem'),
        },
        httpsPort: 4001,
        httpPort: 8002
    },
    dataSource: {
        hostname: 'jsonplaceholder.typicode.com',
        path: '/photos',
        port: 443,
        method: 'GET'
    },
};