const {mapByte} = require('./util');

let instance = null;
let usb = null;

class PrintUsbManager {
    constructor() {
        this._devices = [];
        this._selectedDevice;
    }

    getDeviceList() {
        this._devices = usb.getDeviceList();
        return this._devices;
    }

    use(index) {
        this._selectedDevice = this._devices[index];
    }

    open() {
        this._selectedDevice.open();
    }

    async print(fgl) {
        try {
            const res = await this._print(fgl);
            this._selectedDevice.close();
            console.log(res[0])
            return mapByte(res[0])
        }catch(e) {
            this._selectedDevice.close();
        }
    }

    async _print(fgl) {
        if (!this._selectedDevice) {
            throw new Error('No Open Device');
        }

        const iface = this._selectedDevice.interfaces[0];
        if (!iface) {
            throw new Error('No Interface Found');
        }

        iface.claim()
        const ifaceOut = iface.endpoints.find(ep => ep.direction === 'out');
        const ifaceIn = iface.endpoints.find(ep => ep.direction === 'in');

        if (ifaceOut instanceof usb.OutEndpoint) {
            const data = Buffer.from(fgl);
            return new Promise((resolve, reject) => {
                ifaceOut.transfer(data, (err) => {
                    if (err) {
                        iface.release((err) => {
                            throw new Error(err)
                        })
                    }

                    if (ifaceIn instanceof usb.InEndpoint) {
                        ifaceIn.transfer(4054, (err, data) => {
                            if (err) {
                                iface.release((err) => {
                                    throw new Error(err);
                                })
                            }

                            iface.release(() => {
                                resolve(data);
                            })
                        })
                    }
                });
            });
        }

    }
}


/**
 * @returns {PrintUsbManager}
 */
module.exports = (usbDep) => {
    usb = usbDep;
    if (instance === null) {
        return new PrintUsbManager()
    }

    return instance;
}