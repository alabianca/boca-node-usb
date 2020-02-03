const wifi = require('./routes/wifi');
const usb = require('./routes/usb');


/**
 * @param {Express} app
 * @param {PrintUsbManager} usbManager 
 * @param {PrintWifiManager} wifiManager 
 */
const api = (app, usbManager, wifiManager) => {

    app.use('/wifi', wifi(wifiManager));
    app.use('/usb', usb(usbManager));


    app.listen(3000, () => {
        console.log('listening....')
    })
}


module.exports = api;

