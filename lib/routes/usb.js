
let router;
const routes = (usbManager) => {

    if (!router) {
        throw new Error("Router is not defined.")
    }

    router.get('/device', (req, res) => {
        const devices = usbManager.getDeviceList();
        res.json({
            'devices': devices,
        });
    })

    router.post('/device/:index', (req, res) => {
        const index = req.params['index'] || 0;
        usbManager.use(index);
        res.json({data: 'ok'})
    });

    router.post('/print', (req, res) => {
        const fgl = req.body.fgl;
        try {
            const result = await = usbManager.print(fgl);
            res.json({data: result});
        } catch(e) {
            res.status(400);
            res.json({error: e});
        }
    })

    router.post('/test/:index', async (req, res) => {
        const index = req.params['index'] || 0;
        console.log('index', index);
        usbManager.use(index);
        usbManager.open();
        try {
            const result = await usbManager.print("<NR><RC-10,137><F10><HW1,1>Promoter Presents<RC50,86><F6><HW1,1>Title 1<RC100,86><F6><HW1,1>Title 2<RC175,325><F2><HW1,1>Venue Name<RC190,175><F2><HW1,1>Street Address City, ST<RC210,-45><F2><HW2,2>WKDAY MONTH DAY, YEAR*DOORS/SHOW HOURAM/PM <RC240,75><F2><HW2,2>Age Policy / General Admission<RC280,375><F2><HW1,1><RC325,375><F5><HW1,1><RC345,375><F5><HW1,1><p>")
            res.json({data: result})
        } catch(e) {
            console.log(e)
            res.status(400);
            res.json({error: e})
        }

    })


    return router;
}


module.exports = (usbManager) => {
    return {
        provideRouter: (expressApp) => {
            router = expressApp.Router();
        },
        routes: () => routes(usbManager),
    }
};