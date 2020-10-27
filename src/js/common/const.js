define(function (require, exports, module) {
    'use strict';

    var baseButton = [{
        code: 'add',
        name: '添 加',
        icon: '&#xe654;',
        istableTool: false,
        cls: 'layui-btn layui-btn-xs',
        eventCls: 'js-add'
    }, {
        code: 'edit',
        name: '修 改',
        icon: '&#xe642;',
        istableTool: false,
        cls: 'layui-btn layui-btn-primary layui-btn-xs',
        eventCls: 'js-edit'
    }, {
        code: 'delete',
        name: '删 除',
        icon: '&#xe640;',
        istableTool: false,
        cls: 'layui-btn layui-btn-primary layui-btn-xs',
        eventCls: 'js-del'
    }];

    function generateBaseLineBtn(codes) {
        var inLineBtns = [];
        _.each(codes, function (item) {
            var _btn = {
                code: item,
                istableTool: true
            }
            if (_.isObject(item)) {
                _btn.code = item.code;
                _btn.filterEl = generateFilterEl(item.filterEls);
            } else {
                _btn.filterEl = 'a[lay-event="' + item + '"]';
            }
            inLineBtns.push(_btn);
        });

        return inLineBtns;

        function generateFilterEl(els) {
            return _.map(els, function (el) {
                return 'a[lay-event="' + el + '"]';
            }).join(',');
        }
    }

    var constValue = {
        // 两点距离间隔基础值（m）
        distance: 500,
        // 车库经纬度，用于判断车辆状态（临时）
        carBarnLng: 91.176935,
        carBarnLat: 29.629244,
        // 面包屑标识
        breadcrumbVals: [{
            text: '新增',
            action: 'add',
            nest: {
                text: '编辑'
            }
        }, {
            text: '详情',
            action: 'detail'
        }],
        // 页面功能按钮
        pageButtons: {
            // 调度演练-新增，编辑，(作废、恢复-行内)
            dispatchPeriod: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', {
                        code: 'voidAndRestore',
                        filterEls: ['invalid', 'recover']
                    }])
                }
            },
            // 适配器管理-新增，修改
            frontEndManager: function () {
                return {
                    TopBtn: baseButton.slice(0, 2),
                    InlineTableBtn: []
                }
            },
            // 终端管理-新增，修改，停用
            terminalManager: function () {
                var stopBtn = [{
                    code: 'voidAndRestore',
                    name: '停 用',
                    icon: '&#xe640;',
                    istableTool: false,
                    cls: 'layui-btn layui-btn-primary layui-btn-xs',
                    eventCls: 'js-status'
                }]
                return {
                    TopBtn: baseButton.slice(0, 2), //baseButton.slice(0, 2).concat(stopBtn),
                    InlineTableBtn: []
                }
            },
            // 用户管理
            user: function () {
                return {
                    TopBtn: baseButton,
                    InlineTableBtn: generateBaseLineBtn([{
                        code: 'authorizeadcd',
                        filterEls: ['areaAuthorization']
                    }, 'setrole'])
                }
            },
            // 部门管理
            department: function () {
                return {
                    TopBtn: baseButton,
                    InlineTableBtn: []
                }
            },
            // 用户角色
            userRole: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete', {
                        code: 'authorize',
                        filterEls: ['authorization']
                    }])
                }
            },
            // 应急消息发布
            emergencyPublish: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit'])
                }
            },
            // 音源制作
            messageVoice: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 媒资管理
            mediaAssets: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 摄像头管理
            camera: function () {
                return {
                    TopBtn: baseButton,
                    InlineTableBtn: []
                }
            },
            // 证书管理
            certificateManager: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 广播预案
            broadCastPlan: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 滚动字幕
            rollCaption: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 敏感字管理
            sensitiveWords: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit'])
                }
            },
            // 传输覆盖播出设备
            EBRBSInfo: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete']) //activeReport
                }
            },
            // 应急广播平台
            EBRPSInfo: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete']) //activeReport
                }
            },
            // 台站（前端）
            EBRSTInfo: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete']) //activeReport
                }
            },
            // 应急广播适配器
            EBRASInfo: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete']) //activeReport
                }
            }, // 平台设备及终端
            EBRDTInfo: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete']) //activeReport
                }
            },
            // 接入点管理
            AP: function () {
                return {
                    TopBtn: baseButton.slice(0, 1),
                    InlineTableBtn: generateBaseLineBtn(['edit', 'delete'])
                }
            },
            // 本地音频回传
            localRecord: function () {
                return {
                    TopBtn: [],
                    InlineTableBtn: generateBaseLineBtn(['localAudioDown', 'localAudioDel'])
                }
            }
        }
    };

    module.exports = constValue;
});