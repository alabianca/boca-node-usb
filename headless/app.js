const api = require('../lib/api');
const usb = require('usb');
const usbF = require('../lib/print-usb-manager');
const wifi = require('../lib/print-wifi-manager');
const express = require('express');
const bodyParser = require('body-parser');



// listen for requests
const app = api(usbF(usb), wifi());
app.server(express);
app.middlewares((app) => {
    app.use(bodyParser.json())
});

app.listen(3000, () => {
    console.log('listening')
})