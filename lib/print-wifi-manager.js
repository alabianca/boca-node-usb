const net = require('net');
const {EventEmitter} = require('events').EventEmitter;

let instance;

class PrintWifiManager extends EventEmitter {
    constructor() {
        super()
        this._ip = '';
        this._port = 9100;
        this._socket = null;
    }

    /**
     * 
     * @param {string} host 
     * @param {number} port 
     * @param {() => void} cb
     */
    connect(host, port, cb) {
        this._socket = net.connect(port, host, () => {
            cb();
            this.emit('connected');
        });
        this._socket.on('data', (data) => this.emit('data', data));
        this._socket.on('close', () => {
            this._socket = null;
            this.emit('close');
        })
    }

    disconnect() {
        this._socket.end();
    }

    print(fgl) {
        this._socket.write(Buffer.from(fgl), (err) => {
            if (err) {
                this.emit('error', err)
            }
        })
    }
}

/**
 * @returns {PrintWifiManager}
 */
module.exports = () => {
    if (!instance) {
        instance = new PrintWifiManager();
    }

    return instance;
}