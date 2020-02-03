const usb = require('usb');

const devices = usb.getDeviceList();

const testFgl = "<NR><RC-10,137><F10><HW1,1>Promoter Presents<RC50,86><F6><HW1,1>Title 1<RC100,86><F6><HW1,1>Title 2<RC175,325>" +
    "<F2><HW1,1>Venue Name<RC190,175><F2><HW1,1>Street Address City, ST<RC210,-45><F2><HW2,2>WKDAY MONTH DAY, YEAR*DOORS/SHOW HOURAM/PM" +
    "<RC240,75><F2><HW2,2>Age Policy / General Admission<RC280,375><F2><HW1,1><RC325,375><F5><HW1,1><RC345,375><F5><HW1,1><p>";



const printer = devices[0];



printer.open(false);

printer.setConfiguration(1, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(printer.interfaces.length)
    const iface = printer.interfaces[0];
    iface.claim()
    const out = iface.endpoints.find((e) => e.direction === 'out');
    const ein = iface.endpoints.find((e) => e.direction === 'in');
    
    if (out instanceof usb.OutEndpoint) {
        console.log('transfer out')
        out.transfer(Buffer.from(testFgl), (err) => {
            if (err) {
                console.log("OUT", err);
                return
            }
            console.log('out without error')
            if (ein instanceof usb.InEndpoint) {
                console.log('transfer int')
                ein.transfer(4054, (err) => {
                    if (err) {
                        console.log("IN", err);
                        return;
                    }


                })
            }
        })
    }
    
})





// printer.controlTransfer(usb.libusb_r)
// console.log(usb.LIBUSB_RECIPIENT_DEVICE.toString(2))
// console.log(usb.LIBUSB_REQUEST_TYPE_VENDOR.toString(2));
// console.log(usb.LIBUSB_ENDPOINT_OUT.toString(2));




