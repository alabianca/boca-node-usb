const express = require('express');
const router = express.Router();

const routes = (wifiManager) => {
    router.post('/connect', (req, res) => {
        const ip = req.body.ip;
        const port = req.body.port;
        console.log('trying to connect...', ip, port)
        wifiManager.connect(ip, port, () => {
            console.log('connected');
            res.json({data: 'connected'})
        })
    });

    router.post('/print', (req, res) => {
         const fgl = req.body.fgl;
         wifiManager.once('data', () => {
             res.json({data: 'ok'})
         });

         wifiManager.print(fgl);
    })

    return router;
}

module.exports = (wifiManager) => {
    return routes(wifiManager);
}