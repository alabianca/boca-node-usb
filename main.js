const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');
const usb = require('./lib/print-usb-manager');
const wifi = require('./lib/print-wifi-manager');
const api = require('./lib/api');
const printManager = usb();
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
    // ipcMain.on(GET_PRINTERS, () => {
    //     const devices = printManager.getDeviceList();
    //     window.send(ON_PRINTERS, devices)
    // });

    // ipcMain.on(TEST_PRINT, async (ipc, index) => {
    //     printManager.open(index);
    //     try {
    //         const res = await printManager.print("<NR><RC-10,137><F10><HW1,1>Promoter Presents<RC50,86><F6><HW1,1>Title 1<RC100,86><F6><HW1,1>Title 2<RC175,325><F2><HW1,1>Venue Name<RC190,175><F2><HW1,1>Street Address City, ST<RC210,-45><F2><HW2,2>WKDAY MONTH DAY, YEAR*DOORS/SHOW HOURAM/PM <RC240,75><F2><HW2,2>Age Policy / General Admission<RC280,375><F2><HW1,1><RC325,375><F5><HW1,1><RC345,375><F5><HW1,1><p>")
    //         window.send(TEST_PRINT_RESULT, res);
    //     } catch(e) {
    //         window.send(TEST_PRINT_ERROR, e);
    //     }
        
    // })
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