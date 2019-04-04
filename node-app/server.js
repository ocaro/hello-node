const express = require('express');
var Redis = require('ioredis');
const app = express();
app.set('view engine', 'pug');

const os = require('os');

var redis = new Redis({
    sentinels: [
        { host: process.env.SENT, port: process.env.SENTPORT }
    ],
    name: 'mymaster'
});

var localHitcount = 0

app.get('/', function (req, res, next) {
    localHitcount++;
    redis.incr('counter', function (err, counter) {
        res.render('index', {
            globalHitCount: counter,
            siteVersion: process.env.SITE_VERSION,
            siteName: process.env.SITE_NAME,
            localHitcount: localHitcount,
            thisServerName: os.hostname(),
            title: 'Homepage'
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
