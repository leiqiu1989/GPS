define(function (require, exports, module) {
    'use strict';

    var remoteUrl = 'http://localhost:44558/';

    var signalUrl = 'http://192.168.2.203:10088';

    /*接口API*/
    var api = {
        user: {
            logOut: remoteUrl + 'connect/LogOut',
            signOut: remoteUrl + 'api/User/SignOut',
            changePwd: remoteUrl + 'connect/ChangePassword'
        },
        car: {
            list: remoteUrl + 'api/Car/List',
            detail: remoteUrl + 'api/Car/GetCarById',
            update: remoteUrl + 'api/Car/UpdateCar'
        },
        oilDepot: {
            list: remoteUrl + 'api/OilDepotTank/OilDepotList',
            detail: remoteUrl + 'api/OilDepotTank/GetOilDepotInfoById',
            update: remoteUrl + 'api/OilDepotTank/UpdateOilDepot',
            sendParam:remoteUrl+'api/OilDepotTank/OilDepotSendParam'
        },
        oilTank: {
            list: remoteUrl + 'api/OilDepotTank/OilTankList',
            detail: remoteUrl + 'api/OilDepotTank/GetOilTankInfoById',
            update: remoteUrl + 'api/OilDepotTank/UpdateOilTank'
        },
        driver: {
            list: remoteUrl + 'api/Car/DriverList'
        }
    };

    return api;
});