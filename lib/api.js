const wifi = require('./routes/wifi');
const usb = require('./routes/usb');


/**
 * @param {Express} app
 * @param {PrintUsbManager} usbManager 
 * @param {PrintWifiManager} wifiManager 
 */
const api = (usbManager, wifiManager) => {
    let _express;
    let app;

    return {
        server: (express) => {
            _express = express
            app = express()
        },
        middlewares: (cb) => {
            if (!app) {
                throw new Error("app not yet defined")
            }

            cb(app)
        },
        listen: (port, cb) => {
            if (!app) {
                throw new Error("App not yet defined")
            }

            const wifiRouter = wifi(wifiManager);
            const usbRouter = usb(usbManager);
            wifiRouter.provideRouter(_express);
            usbRouter.provideRouter(_express);

            app.use('/wifi', wifiRouter.routes());
            app.use('/usb', usbRouter.routes());

            app.listen(port, cb);

        }
    }
}


module.exports = api;

