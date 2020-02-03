const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');
const usbF = require('./lib/print-usb-manager');
const wifi = require('./lib/print-wifi-manager');
const api = require('./lib/api');
const usb = require('usb');
const printManager = usbF(usb);
const wifiManager = wifi();


let tray = undefined;
let window = undefined;

const GET_PRINTERS = 'GET_PRINTERS';
const ON_PRINTERS = 'ON_PRINTERS';
const TEST_PRINT = 'TEST_PRINT';
const TEST_PRINT_RESULT = 'TEST_PRINT_RESULT';
const TEST_PRINT_ERROR = 'TEST_PRINT_ERROR';
// Don't show the app in the doc
app.dock.hide();
app.on('ready', () => {
    createTray();
    createWindow();
    main()
});


const main = () => {
    api(printManager, wifiManager);
}


const createTray = () => {
    tray = new Tray(path.join('tix.png'));
    tray.on('click', function (event) {
        toggleWindow();
    })
}

const toggleWindow = () => {
    window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)
    return {x: x, y: y}
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 220,
        height: 300,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    window.loadURL(`file://${path.join(__dirname, '/client/index.html')}`);
    // Hide the window when it loses focus
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}