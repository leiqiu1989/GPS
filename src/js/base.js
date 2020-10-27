define("base", function() {
    var basicUrl = './js';

    seajs.config({
        base: basicUrl,
        charset: 'utf-8',
        alias: {            
            api: 'common/api.js',
            app: 'app.js',
            router: 'common/router.js',
            common: 'common/common.js',
            map: 'common/map.js',
            constVal: 'common/const.js',
            signal: 'common/signal.js',         
        }
    });
});
seajs.use("base");