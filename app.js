const usb = require('usb');

const devices = usb.getDeviceList();

const testFgl = "<NR><RC-10,137><F10><HW1,1>Promoter Presents<RC50,86><F6><HW1,1>Title 1<RC100,86><F6><HW1,1>Title 2<RC175,325>" +
    "<F2><HW1,1>Venue Name<RC190,175><F2><HW1,1>Street Address City, ST<RC210,-45><F2><HW2,2>WKDAY MONTH DAY, YEAR*DOORS/SHOW HOURAM/PM" +
    "<RC240,75><F2><HW2,2>Age Policy / General Admission<RC280,375><F2><HW1,1><RC325,375><F5><HW1,1><RC345,375><F5><HW1,1><p>";


console.log(usb.LIBUSB_TRANSFER_TYPE_BULK)

const printer = devices[0];
printer.open();

const ifaces = printer.interfaces;
const iface = ifaces[0];
iface.detachKernelDriver();
iface.claim()
const ifaceOut = iface.endpoints.find(ep => ep.direction === 'out');
const ifaceIn = iface.endpoints.find(ep => ep.direction === 'in');

ifaceIn.timeout = 500

if (ifaceOut instanceof usb.OutEndpoint) {
    const data = Buffer.from(testFgl);
    
    ifaceOut.transfer(data, (err) => {
        console.log(ifaceOut.direction)
        if (err) {
            console.log("transer error", err);
            iface.release((err) => {
                console.log('release error', err);
                printer.close()
            });

            return

        }

        if (ifaceIn instanceof usb.InEndpoint) {
            ifaceIn.transfer(4054, (err, data) => {

                iface.release((err) => {
                    console.log('release error 2', err);
                    printer.close()
                });

                console.log(data)
            })
        }
    });
}



