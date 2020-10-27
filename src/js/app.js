define(function (require, exports, module) {
    var router = require('router');
    var common = require('common');
    var api = require('api');

    var app = {
        init: function () {
            // 加载自定义模板
            require.async('./../tpl/main/comTpl', function (tpl) {
                $('#layTpl').empty().html(tpl);
            });
            // 选中菜单
            this.activeMenu();

            // 获取用户菜单
            /*this.getUserMenu(function () {

                me.activeMenu();

                $('#navMenu').attr('data-load', 1);

                var element = layui.element;
                element.render();
            });*/

            // 监听全部listenComboTree
            //common.listenComboTreeEvent();

            //common.lockScreen();

            this.event();

            router.init().run();

        },
        activeMenu: function () {
            var hash = window.location.hash.replace('#', '');
            if (hash) {
                var arr = hash.split('/'),
                    len = arr.length,
                    action = null;

                if (hash.indexOf('=') === -1) {
                    action = hash;
                } else {
                    action = arr.splice(0, len - 1).join('/');
                }
                var mod = action.split('/')[0];
                var currTarget = $('a[href*="#' + mod + '/index"');
                if (currTarget.size() > 0 || action.indexOf(mod) > -1) {
                    $('ul[lay-filter="sidebar"] li,ul[lay-filter="sidebar"] dd').removeClass('layui-this');
                    currTarget.parent().addClass('layui-this');
                }
            }
        },
        // 获取menu
        getUserMenu: function (callback) {
            common.fetchData({
                url: api.userMenu,
                data: {},
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data || [];
                        require.async('./../tpl/map/menu', function (tpl) {
                            $('#navMenu').empty().html(template.compile(tpl)({
                                data: data
                            }));
                            callback && callback();
                        });
                    }
                }
            });
        },
        event: function () {
            $('[data-Logout]').on('click', function () {
                common.layConfirm('确认退出系统？', function () {
                    common.loading();
                    common.fetchData({
                        url: api.user.signOut,
                        method: 'POST',
                        callback: function (res) {
                            if (res && res.success) {
                                common.clearTime();
                                top.location.href = './login.html';
                            }
                        }
                    });
                });
            });

            function fullScreen() {
                var el = document.documentElement;
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                } else if (typeof window.ActiveXObject != "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen();
                } else if (el.oRequestFullscreen) {
                    el.oRequestFullscreen();
                } else {
                    common.layAlert('浏览器不支持全屏调用！');
                }
            }

            function exitFullScreen() {
                var el = document;
                var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                } else if (typeof window.ActiveXObject != "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                } else if (el.msExitFullscreen) {
                    el.msExitFullscreen();
                } else if (el.oRequestFullscreen) {
                    el.oCancelFullScreen();
                } else {
                    common.layAlert('浏览器不支持全屏调用！');
                }
            }

            // 全屏
            $('a[data-check-screen]').on('click', function () {
                var check = $(this).attr('data-check-screen');
                if (check == 'full') {
                    fullScreen();
                    $(this).attr('data-check-screen', 'exit');
                    $(this).html('<i class="fa fa-compress"></i>');
                } else {
                    exitFullScreen();
                    $(this).attr('data-check-screen', 'full');
                    $(this).html('<i class="fa fa-arrows-alt"></i>');
                }
            });

            $('a[data-changePwd]').on('click', function () {
                var laytpl = layui.laytpl;
                laytpl(tplChangePwd.innerHTML).render({}, function (html) {
                    var dialogIndex = common.layUIDialog({
                        title: '修改密码',
                        type: 1,
                        offset: 'auto',
                        content: html,
                        area: ['450px', '300px'],
                        success: function () {
                            common.renderForm(function (form) {
                                form.on('submit(*)', function (data) {
                                    var submitData = data.field;
                                    if (submitData.NewPassword !== submitData.ConfirmPassword) {
                                        common.layAlert('两次输入的密码不一致,重新输入.');
                                        return false;
                                    }
                                    var url = api.user.ChangePassword;
                                    common.fetchData({
                                        url: url,
                                        data: {
                                            oldPwd: submitData.OldPassword,
                                            newPwd: submitData.NewPassword
                                        },
                                        callback: function (res) {
                                            if (res && res.success) {
                                                layer.close(dialogIndex);
                                                common.layMsg('密码修改成功,请重新登录系统.');
                                                setTimeout(function () {
                                                    common.fetchData({
                                                        url: api.logOut,
                                                        data: {},
                                                        callback: function (res) {
                                                            if (res && res.success) {
                                                                common.clearTime();
                                                                top.location.href = './login.html';
                                                            }
                                                        }
                                                    });
                                                }, 2000);
                                            } else {
                                                var msg = res.msg || '密码修改失败,请重新输入';
                                                common.layAlert(msg);
                                                return false;
                                            }
                                        }
                                    });
                                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                                });
                            });
                        }
                    });
                });
            });
        }
    };
    module.exports = app;
});