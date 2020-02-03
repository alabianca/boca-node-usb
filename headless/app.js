const api = require('../lib/api');
const usb = require('usb');
const usbF = require('../lib/print-usb-manager');
const wifi = require('../lib/print-wifi-manager');


api(usbF(usb), wifi());