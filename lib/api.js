const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const wifi = require('./routes/wifi');
const usb = require('./routes/usb');


/**
 * 
 * @param {PrintUsbManager} usbManager 
 * @param {PrintWifiManager} wifiManager 
 */
const api = (usbManager, wifiManager) => {
    app.use(bodyParser.json());

    app.use('/wifi', wifi(wifiManager));
    app.use('/usb', usb(usbManager));


    app.listen(3000, () => {
        console.log('listening....')
    })
}


module.exports = api;

