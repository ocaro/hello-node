const express = require('express');
const app = express();
app.set('view engine', 'pug');

const os = require('os');

const redis = require('redis');

var redisIsConnected = false;

const client = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT
})
client.on('error', (error) => {
    redisIsConnected = false
})
client.on('connect', () => {
    redisIsConnected = true
})

var localHitcount = 0

app.get('/', function (req, res, next) {
    localHitcount++;
    if (redisIsConnected){
        client.incr('counter', function (err, counter) {
            res.render('index', {
                globalHitCount: counter,
                siteVersion: process.env.SITE_VERSION,
                siteName: process.env.SITE_NAME,
                localHitcount: localHitcount,
                thisServerName: os.hostname(),
                title: 'Homepage'
            });

        });
    } else{
        res.render('index', {
            globalHitCount: "",
            siteVersion: process.env.SITE_VERSION,
            siteName: process.env.SITE_NAME,
            localHitcount: localHitcount,
            thisServerName: os.hostname(),
            title: 'Homepage'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
