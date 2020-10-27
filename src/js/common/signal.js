define(function (require, exports, module) {
    'use strict';

    function signal(opt) {
        this.install = null;
        this.reconnectionTime = null;
        this.option = $.extend({
            url: null,
            qs: {},
            connectionDone: $.noop
        }, opt);
        this.init();
        // 重连次数-计数
        this.reConCount = 0;
        // 停止重连时间
        this.stopTime = null;
        // 间隔时间(分钟)
        this.interVal = 5;
        // 当前连接state
        this.state = null;
    }

    /* 状态码
    signalR.connectionState = {
        connecting: 0,
        connected: 1,
        reconnecting: 2,
        disconnected: 4
    };
    */

    $.extend(signal.prototype, {
        init: function () {
            this.install = $.connection(this.option.url, {
                useDefaultPath: false
            });
            this.install.qs = this.option.qs;
            this.install.disconnectTimeout = 10000;
            this.connection();
        },
        connection: function () {
            var me = this;
            this.install.start().done(function () {
                me.reConCount = 0;
                me.stopTime = null;
                me.option.connectionDone();
            }).fail(function (error) {
                if (error && error.message === 'Error during negotiation request.') {
                    me.reConCount += 1;
                    // 重连次数超过10次
                    if (me.reConCount >= 10) {
                        clearReConTime();
                        me.stopTime = new Date();
                        setTimeout(function () {
                            me.stopTime = null;
                            reConFunc();
                        }, me.interVal * 60 * 1000);
                    } else {
                        reConFunc();
                    }
                }
            });

            function clearReConTime() {
                me.reConCount = 0;
                if (me.reconnectionTime) {
                    clearInterval(me.reconnectionTime);
                    me.reconnectionTime = null;
                }
            }

            function reConFunc() {
                if (!me.reconnectionTime) {
                    me.reconnectionTime = setInterval(function () {
                        me.connection();
                    }, 5000);
                }
            }
            // 状态更改
            this.install.stateChanged(function (state) {
                if (state) {
                    // 连接成功
                    if (state.newState == 1) {
                        clearReConTime();
                    }
                    this.state = state.newState;
                }
            });

            this.install.reconnecting(function () {
                this.stop(false, true);
            });

            // 断开连接
            this.install.disconnected(function () {
                if (!me.reconnectionTime && !me.stopTime) {
                    me.reconnectionTime = setInterval(function () {
                        me.connection();
                    }, 5000);
                }
            });
        },
        getState: function () {
            return this.state;
        },
        getInstall: function () {
            return this.install;
        },
        destory: function () {
            this.install && this.install.stop();
            this.reconnectionTime && clearInterval(this.reconnectionTime);
            this.install = null;
        },
        received: function (callback) {
            this.install.received(function (postback) {
                callback && callback(postback);
            });
        }
    });

    exports.init = function (opt) {
        return new signal(opt);
    };
});