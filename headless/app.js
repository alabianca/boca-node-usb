const api = require('../lib/api');
const usb = require('usb');
const usbF = require('../lib/print-usb-manager');
const wifi = require('../lib/print-wifi-manager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// listen for requests
api(app, usbF(usb), wifi());