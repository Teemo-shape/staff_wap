/**
 * create by chuchur
 * 2016年12月30日12:24:46
 * mailto chuchur@qq.com
 */
$(function () {
    //绑定邮箱和手机页面为同一份脚本，以type做判断
    var bindType = window.location.href.indexOf('bindEmail') > -1 ? 2 : 1, //2为邮箱，1为手机
        exitsUser = true, mins = 0, sendTimes = 120, sendCode = true, getCodeEle = $('#getCode'), startTimeInt,
        startTime = function (obj) { if (mins == 0) { obj.text('获取验证码'); startTimeInt && clearInterval(startTimeInt); sendCode = true; } else { mins--; obj.text(mins + 's后重发'); }; };

    //获取用户信息，判断是否绑定
    var sendUser;
    User.getInfo({ auth: 1 }, function (res) {
        if (res.code == '0' && res.data) {
            var user = res.data, t = bindType == 2 ? '邮箱' : '手机号码', ele = bindType == 2 ? $('#bindMail') : $('#bindPhone'), sendUser = bindType == 2 ? user.bindMail : user.bindPhone;
            (sendUser && sendUser != null && sendUser != 'null') ? ele.html('当前已绑定' + t + '：' + sendUser) : ele.html('当前还未绑定' + t);
            (sendUser && sendUser != null && sendUser != 'null') && $('#sendInfo span').text(sendUser);
            (sendUser && sendUser != null && sendUser != 'null') && ($('#toBind').hide(), $('#bindBtn').css('display', 'block'));
            //sendUser && sendBindCode(); //换绑：加载页面时自动发送验证码
        };
    });
    //换绑：点击"我要换绑"按钮出现换绑文本框
    $('#bindBtn').on('click', function () { $('#changeBind').show(); $(this).css('display', 'none'); sendBindCode(); })
    //换绑：发送验证码
    function sendBindCode() {
        if (!sendCode) return;
        Account.sendCloudValidcode({ username: $('#sendInfo span').text(), type: bindType == 2 ? 2 : 3 }, function (res) {
            var status = parseInt(res.status)
            switch (status) {
                case 1: alert('验证码已经发送!'); sendCode = false; sendTimes++; startTimeInt && clearInterval(startTimeInt); mins = 60; startTimeInt = setInterval(function () { startTime($('#getCode1')); }, 1000); break;
                case 120: sendCode = false; mins = res.data; startTimeInt = setInterval(function () { startTime($('#getCode1')); }, 1000); break;
                case 102: alert('会话失效，请重新登录'); setTimeout(function () { window.location.href = '/user/login.html'; }, 2000); break;
                case 5: alert('24小时内发送验证码超过5次，请明日再试~'); break;
                default: alert('发送验证码失败，请稍后重试'); break;
            }
        });
    };
    //新绑：发送验证码
    getCodeEle.click(function () {
        if (!sendCode) { return false; };
        var t = bindType == 2 ? '请填写正确的邮箱！' : '请填写正确的手机号码！', uidVal = bindType == 2 ? $('#bindEm').val() : $('#bindPh').val(), uidCheck = util.checkUser(uidVal, bindType);
        if (!uidCheck) { alert(t); return false; };

        var type = util.checkUser(uidVal, 2) ? 'email' : 'mobile';
        Account.tossoBindMobileOrEmail({ mobileOrEmail: uidVal, type: bindType == 2 ? 'email' : 'mobile', ranNum: Math.random() }, function (data) {
            if (data) {
                var code = parseInt(data.code)
                switch (code) {
                    case 1:
                    if (type == 'email') { alert('验证码已成功发送至您的邮箱，请输入邮件中的验证码！'); } else { alert('验证码已成功发送至您的手机上，请输入短信中的验证码！'); }
                    sendCode = false; sendTimes++; startTimeInt && clearInterval(startTimeInt); mins = 60;
                    startTimeInt = setInterval(function () { startTime($('#getCode')) }, 1000); return true;
                    break;
                    case 2: alert('要绑定的' + (bindType == 2 ? '邮箱' : '手机号') + '已经注册或被绑定'); break;
                    case 120: alert('一分钟之内已发过送验证码'); break;
                    case 130: alert('用户已绑定过手机'); break;
                    case 320: alert('用户已绑定过邮箱'); break;
                    default: alert('发送验证码失败，请稍后重试'); break;
                }
                return;
            } else { alert('发送验证码失败，请稍后重试'); return; };
        });
    });
    //验证文本框值，激活按钮

    $('#getCodeTxt').bind('keyup blur change', function () { bindType == '1' ? _btnFunc($('#bindPh'), $('#toBindPh')) : _btnFunc($('#bindEm'), $('#toBindEm')); })


    function _btnFunc(obj1, obj2) {
        var uidVal = obj1.val(), uid = util.checkUser(uidVal), code = $.trim($('#getCodeTxt').val());
        (uid && code && sendTimes > 0) ? obj2.prop('disabled', false).removeClass('disabled') : obj2.prop('disabled', true).addClass('disabled');
    };
    //確定新绑號碼
    $('#toBindPh').on('click', function () { newBind('mobile', $('#bindPhone'), $('#bindPh'), '绑定手机号码：'); });
    //确定新绑邮箱
    $('#toBindEm').on('click', function () { newBind('email', $('#bindMail'), $('#bindEm'), '绑定邮箱：'); });
    //新绑
    function newBind(type, obj1, obj2, txt) {
        var param = { validcode: $('#getCodeTxt').val(), mobileOrEmail: obj2.val(), type: type, ranNum: Math.random() };
        $http.post('/usercenter/tclcustomer/ssobindInfo', param, function (data) {
            if (data.code == "1") { alert('绑定成功!'); obj1.text(txt + obj2.val()); setTimeout(function () { window.location.href = '/my/info'; }, 2000); } else if (data.code == "0") { alert("验证码错误，请重新输入"); return; } else { alert("绑定失败，请刷新页面重试"); return; };
        });
    };


    //换绑：点击重新发送验证码至原手机/邮箱
    $('#getCode1').on('click', function () { sendBindCode(); });
    //换绑：检查原手机/邮箱收到的验证码
    $('#getCodeTxt1').bind('keyup blur change', function () {
        var _val = $.trim($(this).val());
        if (_val.length == 6) {
            //绑定邮箱
            (bindType == '2') ? chk_chanBCd(_val, 2, $('#sendInfo span').text()) : chk_chanBCd(_val, 3, $('#sendInfo span').text());
        };
    });

    function chk_chanBCd(code, type, userName) {
        var param = { 'validcode': code, 'type': type, 'username': userName, 'ranNum': Math.random() };
        $http.post('/usercenter/tclcustomer/checkCloudValidcode', param, function (res) {
            var status = parseInt(res.status)
            if (status == 1) {
                $('#sucChk').hide(); if (bindType == '2') { $('#changeEm').show(); $('#checkOld,#sendInfo').hide(); } else { $('#changePh').show(); $('#checkOld,#sendInfo').hide(); }; return true;
            }
            if (status == 5) {
                $('#sucChk').text('输入错误次数已经超过限制~请明日再试').show(); if ($('#changeEm,#changePh').is(':visible')) { $('#sucChk').hide(); }; return;
            } else {
                $('#sucChk').text('请检查验证码').show(); if ($('#changeEm,#changePh').is(':visible')) { $('#sucChk').hide(); }; return;
            };
        });
    };
    //换绑:检查输入的新手机/邮箱，没被占用则发送验证码
    $('#getCode2').click(function () {
        if (bindType == '2') {
            var uidVal = $('#bindEmNew').val(), uidCheck = util.checkUser(uidVal, 2); if (!uidCheck) { alert('请填写正确的邮箱！'); return false; } else { checkBindStatus(); return; };
        } else {
            var uidVal = $('#bindPhNew').val(), uidCheck = util.checkUser(uidVal, 1); if (!uidCheck) { alert('请填写正确的手机号码！'); return false; } else { checkBindStatus(); return; };
        };

        function checkBindStatus() {
            $http.post('/usercenter/tclcustomer/checkBindStatus', { bindValue: uidVal }, function (res) {
                if ('0' == res.status) { sendCode(); return true; } else { alert('你要绑定的账号已被绑定，请重新输入'); return; };
            });
        };

        function sendCode() {
            var params = { bindValue: uidVal, type: util.checkUser(uidVal, 2) ? '2' : '3', ranNum: Math.random() }, type = util.checkUser(uidVal, 2) ? 'email' : 'mobile';
            $http.post('/usercenter/tclcustomer/sendVerifycode', params, function (data) {
                if (data) {
                    var status = parseInt(data.status)
                    switch (status) {
                        case 1:
                        if (type == 'email') { alert('验证码已成功发送至您的新邮箱，请输入邮件中的验证码！'); } else { alert('验证码已成功发送至您的新手机，请输入短信中的验证码！'); };
                        sendCode = false; sendTimes++; startTimeInt && clearInterval(startTimeInt); mins = 60; startTimeInt = setInterval(function () { startTime($('#getCode2')) }, 1000); return true;
                        break;
                        case 911: alert('用户名为空'); break;
                        case 5: alert('24小时内发送验证码超过5次，请明日再试~'); break;
                        case 120: alert('2分钟内已发送过验证码'); break;
                        case 0: alert('服务器异常发送激活码失败'); break;
                        case 1214: alert('应用今日短信量达到上限，请明日再试~'); break;
                        default: alert('发送验证码失败，请稍后重试'); break;
                    }
                    return;
                } else { alert('发送验证码失败，请稍后重试'); return; };
            });
        };
    });
    //验证文本框值，激活按钮
    $('#getCodeTxt2').bind('keyup blur change', function () {
        if ($.trim($(this).val()).length == 6) { if (bindType == '2') { btnFunc($('#bindEmNew'), $('#changeBindEm')); } else { btnFunc($('#bindPhNew'), $('#changeBindPh')); }; };
    });

    function btnFunc(obj1, obj2) {
        var uidVal = obj1.val(), uid = util.checkUser(uidVal), code = $.trim($('#getCodeTxt2').val());
        (uid && code && sendTimes > 0) ? obj2.prop('disabled', false).removeClass('disabled') : obj2.prop('disabled', true).addClass('disabled');
    };
    //確定换绑號碼
    $('#changeBindPh').on('click', function () { bindFunc(3, $('#bindPhone'), $('#bindPhNew')); });
    //确定换绑邮箱
    $('#changeBindEm').on('click', function () { bindFunc(2, $('#bindMail'), $('#bindEmNew')); });

    function bindFunc(type, obj1, obj2) {
        var oldVal = $('#sendInfo span').text();
        var param = { validcode: $('#getCodeTxt2').val(), bindValue: obj2.val(), type: type, username: oldVal, ranNum: Math.random() };
        $http.post('/usercenter/tclcustomer/changeBind', param, function (res) {
            if (res.code == "0") { alert('绑定成功！'); setTimeout(function () { window.location.href = '/my/info'; }, 2000); } else if (res.code == "110") { alert('验证码输入错误'); return; } else { alert('绑定失败，请刷新重试'); return; };
        });
    };
});
