define(function (require) {
    'use strict';
    jQuery.support.cors = true;
    var api = require('api');
    var map = require('map');
    var constVal = require('constVal');

    /*公共js*/
    var common = {
        getHash: function (defHash = 'main/index') {
            var hash = window.location.hash.replace('#', '');
            return hash ? hash : defHash;
        },
        getDistance: function (startLng, startLat, endLng, endLat) {
            // 维度
            var _startLat = (Math.PI / 180) * startLat;
            var _endLat = (Math.PI / 180) * endLat;
            // 经度
            var _startLng = (Math.PI / 180) * startLng;
            var _endLng = (Math.PI / 180) * endLng;
            // 地球半径
            var R = 6371;
            var d = Math.acos(Math.sin(_startLat) * Math.sin(_endLat) + Math.cos(_startLat) * Math.cos(_endLat) * Math.cos(_endLng - _startLng)) * R;
            return d * 1000;
        },
        getCarStatus: function (endLng, endLat) {
            var distance = this.getDistance(constVal.carBarnLng, constVal.carBarnLat, endLng, endLat);
            if (distance > 0 && distance >= constVal.distance) {
                return 1;
            } else {
                return 2;
            }
        },
        initTemplate: function (url, data, callback) {
            var me = this;
            this.loading();
            this.fetchData({
                url: url,
                data: data,
                callback: function (res) {
                    if (res && res.success) {
                        var data = res.data || {};
                        callback && callback(data);
                    } else {
                        var msg = res.msg || '获取数据异常!';
                        me.layAlert(msg);
                        return false;
                    }
                    common.closeAllLayer();
                }
            });
        },
        getParam: function (hash) {
            var arr = hash.split('/'),
                str = arr.splice(-1);

            if (hash.indexOf('=') === -1) {
                return {};
            }
            var paramArray = str[0].split('&'),
                obj = {};

            for (var i = 0, ii = paramArray.length; i < ii; ++i) {
                obj[paramArray[i].split('=')[0]] = paramArray[i].split('=')[1];
            }
            return obj;
        },
        // dialog
        layUIDialog: function (opt) {
            var layer = layui.layer;
            return layer.open($.extend(opt, {
                anim: 1,
                resize: false
            }));
        },
        renderElement: function (opt) {
            var element = layui.element;
            if (opt && opt.eventFilter) {
                element.on(opt.eventFilter, function (data) {
                    opt.callback && opt.callback(data);
                });
            }
            return element;
        },
        // table
        initTable: function (opt) {
            var me = this;
            opt = _.extend({
                page: {
                    limit: 20
                },
                isLocal: false,
                isFilter: true
            }, opt);

            var tempOpt = {};
            if (opt.isLocal) {
                tempOpt.data = opt.data || [];
                tempOpt.page = opt.page;
                tempOpt.page.limit = opt.data.length;
                if (opt.text) {
                    tempOpt.text = opt.text
                }
            }
            var table = layui.table;
            table.render(_.extend({
                elem: opt.elem,
                url: opt.url,
                where: opt.where || {},
                even: _.isBoolean(opt.even) ? opt.even : true,
                page: {
                    limit: opt.page.limit || 20,
                    layout: opt.page.layout || ['count', 'prev', 'page', 'next']
                },
                headers: {
                    Authorization: 'Bearer ' + this.getCookie('token')
                },
                toolbar: _.isBoolean(opt.toolbar) ? opt.toolbar : (opt.toolbar || false),
                defaultToolbar: opt.isFilter ? ['filter'].concat(opt.defaultToolbar || []) : [],
                height: opt.height || 'full-130',
                cols: opt.cols,
                parseData: function (res) {
                    if (opt.parseLocalData) {
                        return opt.parseLocalData(res);
                    }
                    return res;
                },
                done: function (res, curr, count) {
                    opt.done && opt.done(res, curr, count);
                }
            }, tempOpt));
            if (opt.layFilter) {
                // 行内
                table.on('tool(' + opt.layFilter + ')', function (obj) {
                    opt.layFilterEvent && opt.layFilterEvent(obj);
                });
                // 表头
                table.on('toolbar(' + opt.layFilter + ')', function (obj) {
                    opt.layFilterToolbarEvent && opt.layFilterToolbarEvent(obj);
                });
            }
            return table;
        },
        // loading
        loading: function () {
            layer.load(2, {
                shade: [0.6, '#333']
            });
        },
        loadingStart: function (target, isParent) {
            this.loadingObj = new Loading();
            this.loadingObj.init({
                target: target,
                isParent: isParent
            });
            this.loadingObj.start();
        },
        loadingStop: function () {
            this.loadingObj && this.loadingObj.stop();
        },
        // close all
        closeAllLayer: function (type) {
            type = type || 'loading'
            layer.closeAll(type); //关闭加载层
        },
        // message
        layMsg: function (content, callback, opt) {
            opt = opt || {};
            var layer = layui.layer;
            layer.msg(content, _.extend({
                offset: 'auto',
                icon: 1,
                time: 2000
            }, opt), function () {
                callback && callback();
            });
        },
        // prompt
        prompt: function (opt) {
            opt = _.extend({
                title: '',
                formType: 0
            }, opt);
            layer.prompt(opt, function (value, index) {
                opt.callBack && opt.callBack(value, index);
            });
        },
        // alert
        layAlert: function (content, opt, callBack) {
            opt = opt || {};
            var options = $.extend({
                icon: 2
            }, opt);
            return layer.alert(content, options, callBack);
        },
        // confirm
        layConfirm: function (content, callback) {
            layer.confirm(content, {
                icon: 3,
                title: '提示'
            }, function (index) {
                callback && callback();
                layer.close(index);
            });
        },
        // 开启定时器
        startTime: function (fn, time) {},
        // 清除定时器
        clearTime: function () {
            Cookies.remove('userName');
            Cookies.remove('token');
            Cookies.remove('layerIndex');
        },
        // 数组删除插入
        spliceArrayData: function (opt) {
            opt = opt || {
                sourceArray: [],
                spliceArray: [],
                filterField: ''
            }
            var soruce = _.map(opt.sourceArray, function (item) {
                return item[opt.filterField];
            });
            _.each(opt.spliceArray, function (item) {
                var index = _.indexOf(soruce, item[opt.filterField]);
                opt.sourceArray.splice(index, 1, item);
            });
            return opt.sourceArray;
        },
        // 数组对象过滤指定字段
        filterArray: function (sourceArray, fields) {
            sourceArray = sourceArray || [];
            fields = fields || [];
            var len = fields.length;
            var array = [];
            _.each(sourceArray, function (item) {
                var result = [];
                for (var i = 0; i < len; i++) {
                    // number类型判断为true
                    var value = item[fields[i]];
                    if (_.isNumber(value)) {
                        result.push(true);
                    } else {
                        result.push(!!value);
                    }
                }
                var flag = _.every(result, _.identity)
                flag && array.push(item);
            });
            return array;
        },
        // init form
        renderForm: function (callback) {
            var me = this;
            var form = layui.form;
            // 自定义验证
            form.verify({
                int: [
                    /^\+?[0-9][0-9]*$/, '只能输入大于等于0的正整数'
                ],
                pwd: [
                    /^[a-zA-Z0-9]{6,16}$/, '长度6-16的数字和字母'
                ],
                double: [
                    /^\d+(?:\.\d{1,2})?$/, '只能输入数字，保留2位小数'
                ]
            });
            form.render();
            if (callback) {
                callback(form);
            }
        },
        // 获取表格选择的行,默认返回一条数据，否则全返回
        getSelectedRow: function (tableId, returnOne = true) {
            var table = layui.table;
            var checkStatus = table.checkStatus(tableId);
            var data = checkStatus.data;
            var len = checkStatus.data.length;
            if (!len) {
                this.layAlert('请选择至少一条数据进行操作!');
                return {
                    success: false
                };
            }
            if (returnOne) {
                if (len !== 1) {
                    this.layAlert('请选择一条数据进行操作!');
                    return {
                        success: false
                    };
                }
                return {
                    success: true,
                    data: data[0]
                };
            } else {
                return {
                    success: true,
                    data: data
                };
            }
        },
        // 监听下拉树事件
        listenComboTreeEvent: function () {
            $(document).on('click', function (e) {
                //e.preventDefault();
                e.stopPropagation();
                var _con = $('div.comboTree-container'); // 设置目标区域
                var _comboTree = _con.find('div.layui-comboTree');
                var _comboText = _con.find('div.comboTree-text');

                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    _comboText.removeClass('layui-form-selected');
                    _comboTree.hide();
                } else {
                    var isMatch = _con.is(e.target) || _con.has(e.target).length > 0;

                    if (isMatch) {
                        if ($(e.target).closest('div.layui-comboTree').length > 0) {
                            return;
                        } else {
                            var isVisible = _comboTree.is(':visible');
                            if (isVisible) {
                                _comboText.removeClass('layui-form-selected');
                                _comboTree.hide()
                            } else {
                                _comboText.addClass('layui-form-selected');
                                _comboTree.show()
                            }
                        }
                    }
                }
            });
        },
        // 赋值表单数据
        setFormData: function (el, data) {
            if (data && !$.isEmptyObject(data)) {
                var inputs = $(el).find(':input');
                var name = null;
                $(inputs).each(function (index, input) {
                    name = $(input).attr('name');
                    if (name) {
                        if ($(input)[0].tagName === 'SELECT') {
                            $(input).val(data[name]);
                        } else {
                            $(input).val(data[name]);
                        }
                    }
                });
            }
        },
        // 初始化下拉框
        initSelect: function (opt) {
            opt = $.extend({
                el: '',
                data: [],
                textField: opt.textField || 'name',
                valueField: opt.valueField || 'value',
                selectValue: '',
                addEmptyItem: false,
                formatText: null,
                filterData: null,
                // 附加属性
                attribute: null,
                // 选中方式（默认value,可自定义attribute）
                selectType: 'value'
            }, opt);
            if (opt.filterData) {
                opt.data = opt.filterData(opt.data);
            }
            var html = opt.addEmptyItem ? '<option value="">请选择</option>' : '';
            $.each(opt.data, function (index, item) {
                var _value = item[opt.valueField];
                var _attributeVal = opt.attribute ? (item[opt.attribute] || '') : '';
                html += (opt.selectValue && (opt.selectType == 'attribute' ? (opt.selectValue == _attributeVal) : (opt.selectValue == _value))) ?
                    '<option data-attribute="' + _attributeVal + '" value="' + item[opt.valueField] + '" selected>' + (opt.formatText ? opt.formatText(item) : item[opt.textField]) + '</option>' :
                    '<option data-attribute="' + _attributeVal + '" value="' + item[opt.valueField] + '">' + (opt.formatText ? opt.formatText(item) : item[opt.textField]) + '</option>';
            });
            $(opt.el).empty().html(html);
        },
        // 初始化日期
        initDateTime: function (el, opt) {
            opt = opt || {};
            jeDate(el, _.extend({
                format: "YYYY/MM/DD",
            }, opt));
        },
        // 渲染右侧区域
        renderContent: function (tpl, data) {
            data = data || {};
            $('#content').empty().html(template.compile(tpl)(data));
        },
        // 页面-操作权限
        pageAuthorize: function (param, callBack) {
            this.fetchData({
                url: api.role.pageButton,
                data: param,
                callback: function (res) {
                    if (res && res.IsSuccess) {
                        var data = res.Data;
                        callBack && callBack(data);
                    }
                }
            });
        },
        getMenuCode: function () {
            var hash = window.location.hash,
                arr = hash.split('/'),
                str = arr.splice(-1);

            if (hash.indexOf('=') == -1) {
                return '';
            }

            var arr = str[0].split('&'),
                obj = {};

            for (var i = 0, ii = arr.length; i < ii; ++i) {
                obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
            }

            return obj['menucode'] || '';
        },
        // 树查询
        searchTree: function (treeId, txt) {
            var outNodeList = null;
            var nodeList = null;

            var zTree = $.fn.zTree.getZTreeObj(treeId);
            if (txt) {
                nodeList = zTree.getNodes();
                nodeList = zTree.transformToArray(nodeList);
                zTree.hideNodes(nodeList); //先隐藏所有节点
                nodeList = zTree.getNodesByParamFuzzy("ADNM", txt);
                outNodeList = zTree.getNodesByParamFuzzy("ADNM", txt);
                for (var i = 0; i < nodeList.length; i++) {
                    findParent(zTree, nodeList[i]); //递归获取父节点
                    findChild(zTree, nodeList[i]); //递归获取子节点
                }
            } else {
                outNodeList = zTree.transformToArray(zTree.getNodes());
            }
            zTree.showNodes(outNodeList); //再展示匹配到的节点

            function findParent(zTree, node) {
                var pNode = node.getParentNode();
                if (pNode) {
                    outNodeList.push(pNode);
                    findParent(zTree, pNode);
                }
            }

            function findChild(zTree, node) {
                var pNodes = node.children;
                if (pNodes) {
                    for (var i = 0; i < pNodes.length; i++) {
                        outNodeList.push(pNodes[i]);
                        findChild(zTree, pNodes[i]);
                    }
                }
            }
        },
        // 初始化树
        initTree: function (opt) {
            var me = this;
            opt = _.extend({
                url: null,
                param: {},
                treeId: null,
                idKey: null,
                pIdKey: null,
                loadingEl: null,
                dataFilter: null,
                initCallBack: null,
                callback: null,
                zTreeOnCheck: null,
                ajaxCallBack: null,
                expandAllFlag: false, //展开所有菜单
                expandChildFlag: false, //展开子级菜单
                checkEnable: false,
                disabledClick: false, //禁用区域A标签
                disabledDeviceClick: true, // 禁用设备A便签
                isFilterDevice: true, // 是否过滤掉设备
                isProcess: true //是否过滤数据
            }, opt);
            var setting = {
                check: {
                    enable: opt.checkEnable
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: opt.idKey,
                        pIdKey: opt.pIdKey,
                        rootPId: null
                    },
                    key: {
                        name: opt.name
                    }
                },
                callback: {
                    onClick: opt.callback,
                    onCheck: opt.zTreeOnCheck
                },
                view: {
                    selectedMulti: false,
                    fontCss: setFontCss
                }
            };

            function setFontCss(treeId, treeNode) {
                var obj = {
                    'pointer-events': 'none',
                    'opacity': 0.5
                }
                // 0 区域，1 适配器，2 终端
                if (!treeNode.IsDevice) {
                    return opt.disabledClick ? obj : {};
                } else {
                    // 如果是设备,默认禁用适配器文字
                    if (treeNode.IsDevice == 1) {
                        return opt.disabledDeviceClick ? obj : {};
                    }
                    return {};
                }
            }
            opt.loadingEl && this.loadingStart(opt.loadingEl);
            this.fetchData({
                url: opt.url,
                data: opt.param,
                callback: function (res) {
                    if (opt.ajaxCallBack) {
                        res = opt.ajaxCallBack(res);
                    }
                    if (res.IsSuccess) {
                        var data = res.Data || [];
                        if (opt.isProcess) {
                            // 默认过滤掉设备，返回adLevel>=0的正常区域
                            if (opt.isFilterDevice) {
                                data = _.filter(data, function (item) {
                                    return item.adLevel >= 0;
                                });
                            } else {
                                // 返回设备和adLevel>=0的正常区域
                                data = _.filter(data, function (item) {
                                    return item.IsDevice || item.adLevel >= 0;
                                });
                            }
                        }

                        if (opt.dataFilter) {
                            data = opt.dataFilter(data);
                        }

                        $.fn.zTree.init($('#' + opt.treeId), setting, data);
                        var zTree = $.fn.zTree.getZTreeObj(opt.treeId);
                        if (zTree) {
                            opt.expandAllFlag && zTree.expandAll(opt.expandAllFlag);
                            if (opt.expandChildFlag) {
                                var nodes = zTree.getNodes();
                                for (var i = 0; i < nodes.length; i++) { //设置节点展开
                                    zTree.expandNode(nodes[i], true, false, true);
                                }
                            }
                        }
                        // 绑定事件
                        $('#btnSearchTree').on('click', function () {
                            var txt = $.trim($(':text[name="treeText"]').val());
                            me.searchTree(opt.treeId, txt);
                        });
                        opt.initCallBack && opt.initCallBack();
                    }
                    me.loadingStop();
                }
            });
        },
        // 递归查找节点
        recursionNode: function (treeId) {
            function _recursionNode(node, codes, names) {
                var pNode = node.getParentNode();
                if (pNode) {
                    var half = pNode.getCheckStatus().half;
                    if (!half && pNode.HasCheck) {
                        _recursionNode(pNode, codes, names);
                    } else {
                        codes.push(node.ADCD);
                        names.push(node.FullAreaName);
                    }
                } else {
                    codes.push(node.ADCD);
                    names.push(node.FullAreaName);
                }
            }

            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var checkNodes = zTree.getCheckedNodes(true);
            var rt = {
                arrayCodes: [],
                arrayNames: []
            }
            if (checkNodes && checkNodes.length) {
                var leafNodes = _.filter(checkNodes, function (node) {
                    return !node.isParent;
                });
                if (leafNodes.length) {
                    for (var i = 0, len = leafNodes.length; i < len; i++) {
                        var node = leafNodes[i];
                        _recursionNode(node, rt.arrayCodes, rt.arrayNames);
                    }
                    var codes = _.uniq(rt.arrayCodes);
                    var names = _.uniq(rt.arrayNames);
                    return {
                        arrayCodes: codes,
                        arrayNames: names
                    };
                }
            }
            return rt;
        },
        // 地图标点弹出框
        mapDialog: function (containerEl, callBack) {
            var me = this;
            $(containerEl).on('click', 'a[data-event="selectMap"]', function () {
                var _point = null;
                var lng = $(this).prevAll(':hidden[name="Lng"]').val();
                var lat = $(this).prevAll(':hidden[name="Lat"]').val();
                var laytpl = layui.laytpl;
                laytpl(tplDialogMap.innerHTML).render({}, function (html) {
                    me.layUIDialog({
                        title: '添加标注点',
                        type: 1,
                        content: html,
                        area: ['500px', '450px'],
                        success: function () {
                            map.init('dialogMap', {}, function () {
                                if (lng && lat) {
                                    setValue(lng, lat);
                                    var point = new BMap.Point(lng, lat);
                                    var marker = new BMap.Marker(point);
                                    marker.enableDragging();
                                    map.getMap().addOverlay(marker);
                                    _point = point;
                                    dragEvent(marker);
                                }
                            });
                        },
                        btnAlign: 'r',
                        btn: ['添加标注点', '关 闭'],
                        yes: function () {
                            var _map = map.getMap();
                            map.clearOverlays();
                            var mkrTool = new BMapLib.MarkerTool(_map, {
                                autoClose: true,
                                followText: "添加标注点"
                            });
                            mkrTool.open();
                            mkrTool.addEventListener("markend", function (e) {
                                _point = e.marker.point;
                                setValue(_point.lng, _point.lat);
                                e.marker.enableDragging();
                                dragEvent(e.marker);
                                mkrTool.close();
                            });
                        },
                        btn2: function (index) {
                            getValue();
                            if (_point) {
                                callBack && callBack(_point);
                            }
                            layer.close(index)
                        }
                    });
                });
                return false;

                function setValue(lng, lat) {
                    $('.dialog-map-input').find(':text[name="lng"]').val(lng);
                    $('.dialog-map-input').find(':text[name="lat"]').val(lat);
                }

                function getValue() {
                    var lng = $('.dialog-map-input').find(':text[name="lng"]').val();
                    var lat = $('.dialog-map-input').find(':text[name="lat"]').val();
                    if (lng && lat) {
                        _point = new BMap.Point(lng, lat);
                    }
                }

                function dragEvent(marker) {
                    marker.addEventListener('dragend', function (e) {
                        _point = e.point;
                        setValue(_point.lng, _point.lat);
                    });
                }
            });
        },
        // 序列化参数
        serialParam: function (data) {
            var str = '';
            if (!_.isEmpty(data)) {
                $.each(data, function (key, value) {
                    str += key + '=' + value + '&';
                });
                return str.substring(0, str.length - 1);
            }
            return str;
        },
        // 更改hash
        changeHash: function (url, param) {
            param = param || {};
            window.location.hash = url + this.serialParam(param);
        },
        // set cookie
        setCookie: function (name, value, expireDay) {
            expireDay = expireDay || 7;
            Cookies.set(name, value, {
                expires: expireDay
            })
        },
        // get cookie
        getCookie: function (name) {
            return Cookies.get(name);
        },
        // set locationStorage
        setlocationStorage: function (key, value) {
            window.localStorage.setItem(key, value);
        },
        // get locationStorage
        getlocationStorage: function (key) {
            return window.localStorage.getItem(key);
        },
        // remove locationStorage
        removeLocationStorage: function (key) {
            window.localStorage.removeItem(key);
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        createURL: function (url, param) {
            var urlLink = '';
            $.each(param, function (item, key) {
                var link = '&' + item + "=" + key;
                urlLink += link;
            })
            urlLink = url + "?" + urlLink.substr(1);
            return urlLink.replace(' ', '');
        },
        // fetch封装
        fetchData: function (opt) {
            var me = this;
            opt = opt || {};
            var url = opt.url;
            var params = opt.data || {};
            // 处理GET请求
            if (!_.isEmpty(params) && !opt.method) {
                var paramsArray = [];
                //拼接参数
                Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
                if (url.search(/\?/) === -1) {
                    url += '?' + paramsArray.join('&')
                } else {
                    url += '&' + paramsArray.join('&')
                }
            }

            var fetchOpt = {
                method: opt.method || 'GET',
                headers: {
                    Authorization: 'Bearer ' + this.getCookie('token')
                }
            };

            // 处理POST请求
            if (opt.method) {
                fetchOpt.headers["Content-Type"] = opt.contentType || "application/json;charset=utf-8";
                if (!_.isEmpty(params)) {
                    fetchOpt.body = params;
                }
            }

            fetch(url, _.extend(fetchOpt, {
                cache: 'no-cache',
                mode: opt.mode || 'cors'
            })).then(function (response) {
                // 401 未授权，跳转页面
                if (response.status == 401) {
                    var layerIndex = me.getCookie('layerIndex');
                    if (!layerIndex) {
                        layerIndex = me.layAlert('系统未授权，请重新登录!', {
                            yes: function () {
                                me.clearTime();
                                layer.closeAll();
                                top.location.href = './login.html';
                            },
                            closeBtn: 0,
                            zIndex: 999999999
                        });
                        me.setCookie('layerIndex', layerIndex);
                    }
                }
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then(function (res) {
                if (res) {
                    if (opt.callback && typeof opt.callback === 'function') {
                        opt.callback.call(this, res);
                    }
                }
            }).catch((error) => {
                opt.errorCallBack && opt.errorCallBack();
            });
        },
        $: function (el, container) {
            container = container || '#content'
            return $(container).find(el);
        },
        getPageBtns: function (opt) {
            opt = _.extend({
                menuCode: '',
                buttons: [],
            }, opt || {});

            console.log(opt.buttons);

            var pageButton = {};
            var btnFun = constVal.pageButtons[opt.menuCode];
            if (_.isFunction(btnFun)) {
                pageButton = btnFun();
            }
            var topBtns = [],
                removeBtns = [];

            // 顶部按钮是否显示
            _.each(pageButton.TopBtn, function (item) {
                var exits = _.find(opt.buttons, function (btn) {
                    return btn.Code == item.code;
                });
                exits && topBtns.push(item);
            });
            // 表格行内按钮-要删除的按钮
            _.each(pageButton.InlineTableBtn, function (item) {
                var _removeBtns = _.filter(opt.buttons, function (button) {
                    return item.code == button.Code;
                });
                !_removeBtns.length && removeBtns.push(item);
            });
            if (topBtns.length) {
                this.renderPageBtns(topBtns);
            }
            console.log(removeBtns);
            return removeBtns;
        },
        renderPageBtns: function (btns) {
            var laytpl = layui.laytpl;
            laytpl(toolBarBtns.innerHTML).render({
                btns: btns
            }, function (html) {
                $('#topToolBar').prepend(html);
            });
        },
        removeTableBnts: function (btns) {
            var me = this;
            _.each(btns, function (btn) {
                me.$(btn.filterEl).remove();
            });
        },
        // 渲染局部控件
        renderPartial: function (type, filter) {
            var form = layui.form;
            form.render(type || null, filter);
        },
        // 生成面包屑
        generateBreadCrumb: function (operate, action) {
            var me = this;
            if (operate == 'init') {
                var mod = action.split('/')[0];
                var isMain = mod == 'main';
                var array = [];
                // 生成面包屑                    
                if (!isMain) {
                    array.push({
                        text: '首页',
                        url: '#main/index'
                    });
                } else {
                    array.push({
                        text: '首页'
                    });
                }
                var timer = setInterval(function () {
                    if ($('#navMenu').attr('data-load')) {

                        clearInterval(timer);

                        var nav = $('#navMenu a[href^="#' + mod + '"]');
                        if (nav.size() > 0) {
                            var arr = nav.attr('href').split('/');
                            array.push({
                                text: nav.text().trim(),
                                url: arr.splice(0, arr.length - 1).join('/') + '/menucode=' + mod
                            });

                            var operate = action.split('/')[1];
                            var breadCrumb = _.find(constVal.breadcrumbVals, function (item) {
                                return item.action == operate;
                            });

                            if (breadCrumb) {
                                // 判断是新增还是编辑
                                if (breadCrumb.nest) {
                                    var param = me.getParam(me.getHash());
                                    var keys = _.keys(param);
                                    // 编辑
                                    if (keys.length > 1) {
                                        array.push({
                                            text: breadCrumb.nest.text
                                        });
                                    } else {
                                        array.push({
                                            text: breadCrumb.text
                                        });
                                    }
                                } else {
                                    array.push({
                                        text: breadCrumb.text
                                    });
                                }
                            }
                        }
                        var laytpl = layui.laytpl;
                        laytpl(breadcrumb.innerHTML).render({
                            list: array
                        }, function (html) {
                            $('div[bread-crumb]').empty().html(html);
                        });
                    }
                }, 500);
            }
        },
        // excel export
        excelExport: function (opt) {
            var me = this;
            opt = opt || {};
            this.loading();
            this.fetchData({
                url: opt.url,
                data: _.extend(opt.param, {
                    page: 1,
                    limit: constVal.maxLimit
                }),
                callback: function (res) {
                    if (opt.callback) {
                        var data = opt.callback(res) || [];
                        if (data.length) {
                            var excel = layui.excel;
                            var cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                                'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                            ];
                            var lastStrCol = cols.slice(opt.headCount - 1, opt.headCount)[0];
                            // 表头
                            LAY_EXCEL.setExportCellStyle(data, 'A1:' + (lastStrCol + '1'), {
                                s: {
                                    fill: {
                                        bgColor: {
                                            indexed: 64
                                        },
                                        fgColor: {
                                            rgb: "cce210"
                                        }
                                    },
                                    alignment: {
                                        horizontal: 'left',
                                        vertical: 'center'
                                    }
                                }
                            });

                            var obj = {
                                'A': 200
                            }
                            obj[lastStrCol] = 150;
                            var colConfig = excel.makeColConfig(obj, 150);

                            // 单元格cell
                            LAY_EXCEL.setExportCellStyle(data, 'A1:' + (lastStrCol + data.length), {
                                s: {
                                    border: {
                                        top: {
                                            style: 'thin',
                                            color: {
                                                rgb: 'FF333333'
                                            }
                                        },
                                        bottom: {
                                            style: 'thin',
                                            color: {
                                                rgb: 'FF333333'
                                            }
                                        },
                                        left: {
                                            style: 'thin',
                                            color: {
                                                rgb: 'FF333333'
                                            }
                                        },
                                        right: {
                                            style: 'thin',
                                            color: {
                                                rgb: 'FF333333'
                                            }
                                        }
                                    }
                                }
                            });
                            excel.exportExcel({
                                sheet1: data
                            }, opt.excelName + '.xlsx', 'xlsx', {
                                extend: {
                                    '!cols': colConfig
                                }
                            });
                        }
                    }
                    me.closeAllLayer();
                }
            });
        }
    };
    return common;
});