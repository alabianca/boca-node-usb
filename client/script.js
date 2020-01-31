
const useWifi = document.getElementById('wifi-btn');
const useUsb = document.getElementById('usb-btn');
const wifiContent = document.getElementById('wifi-content');
const usbConent = document.getElementById('usb-content');
const testConnBtn = document.getElementById('test-conn-btn');
const testPrintBtn = document.getElementById('test-print-btn');
const printers = document.getElementById('printers');
const ip0 = document.getElementById('ip-0');
const ip1 = document.getElementById('ip-1');
const ip2 = document.getElementById('ip-2');
const ip3 = document.getElementById('ip-3');
const port = document.getElementById('port');
const status = document.getElementById('conn-status');
const wifiTestBtn = document.getElementById('wifi-test-print');

let selectedPrinterIndex;

useUsb.addEventListener('click', () => {
    showUsbContent();
    initUsbView();
});

useWifi.addEventListener('click', () => {
    showWifiContent();
});

testPrintBtn.addEventListener('click', () => {
    testPrint(selectedPrinterIndex);
});

testConnBtn.addEventListener('click', async () => {
    const ip = ip0.value + '.' + ip1.value + '.' + ip2.value + '.' + ip3.value;
    const portNum = parseInt(port.value);
    const res = await testConnection(ip, portNum);
    status.textContent = res.data;
});

wifiTestBtn.addEventListener('click', () => {
    printWifi()
})

const showWifiContent = () => {
    useWifi.classList.add('active');
    useUsb.classList.remove('active');
    wifiContent.classList.remove('hidden');
    usbConent.classList.add('hidden');
    testPrintBtn.classList.add('hidden');
    testConnBtn.classList.remove('hidden');
    wifiTestBtn.classList.remove('hidden');
    destroyUsbView();
}

const showUsbContent = () => {
    useUsb.classList.add('active');
    useWifi.classList.remove('active');
    usbConent.classList.remove('hidden');
    wifiContent.classList.add('hidden');
    testConnBtn.classList.add('hidden');
    testPrintBtn.classList.remove('hidden');
    wifiTestBtn.classList.add('hidden');
}

const initUsbView =  async () => {

    try {
        const res = await fetch('http://localhost:3000/usb/device', {
            method: 'GET',
        });
        const data = await res.json();
        console.log(data);
        renderAvailablePrinters(data.devices);
    } catch(e) {

    }
    

    printers.addEventListener('click', selectPrinter);
}

const destroyUsbView = () => {
    // ipcRenderer.removeListener('ON_PRINTERS', renderAvailablePrinters);
    // ipcRenderer.removeListener('TEST_PRINT_RESULT', renderTestPrintResult);
    // printers.removeEventListener('click', selectPrinter);
}

const renderAvailablePrinters = (devices) => {
    devices.forEach((device, index) => {
        const li = document.createElement('li');
        li.id = `printer-${index}`
        li.classList.add('list-group-item');
        li.textContent = `Printer: ${index}`;
        printers.appendChild(li);
    })
}

const renderTestPrintResult = (ipc, result) => {
    console.log(result);
}


const selectPrinter = (e) => {
    const element = e.target;
    const list = e.target.parentElement;

    for (let i = 0; i < list.children.length; i++) {
        list.children[i].classList.remove('active')
    }

    e.target.classList.add('active');
    selectedPrinterIndex = parseInt(element.id.split('-')[1])

}

const testPrint = (index) => {
    return fetch(`http://localhost:3000/usb/test/${index}`, {
        method: 'POST',
    });
}

const testConnection = async (ip, port) => {
    const res = await fetch(`http://localhost:3000/wifi/connect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ip, port})
    });

    const data =  await res.json();
    return data;
}

const printWifi = async () => {
    const res = await fetch('http://localhost:3000/wifi/print', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({fgl: "<NR><RC-10,137><F10><HW1,1>Promoter Presents<RC50,86><F6><HW1,1>Title 1<RC100,86><F6><HW1,1>Title 2<RC175,325><F2><HW1,1>Venue Name<RC190,175><F2><HW1,1>Street Address City, ST<RC210,-45><F2><HW2,2>WKDAY MONTH DAY, YEAR*DOORS/SHOW HOURAM/PM <RC240,75><F2><HW2,2>Age Policy / General Admission<RC280,375><F2><HW1,1><RC325,375><F5><HW1,1><RC345,375><F5><HW1,1><p>"})
    })

    return res;
}