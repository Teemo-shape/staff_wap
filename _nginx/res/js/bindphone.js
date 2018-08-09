//微信端的绑定手机流程

$(function () {

    var mobile = $('#mobile'), bindbtn = $('#bind'), pwd = $('#pwd'), pwd1 = $('#pwd1'), detail = util.parseQuery('detail'), captchakey;
    function changeImageCode() { captchakey = util.uuid(); $('.imgCode').attr('src', '/rest/getCustomerRegCode?img-key=' + captchakey) };
    // 点击切换验证码
    $('.imgCode').click(function () { changeImageCode(); })
    changeImageCode();
    //已存在绑定
    var bind = function (uid, pwd, code, key) {
        if (code && !util.checkStrong(pwd)) {
            $('.bind .error_tip').text('*密码长度8-16位，数字、字母、字符至少包含两种'); return false;
        } else { $('.bind .error_tip').text('') }
        if (!/^1[3|4|5|6|7|8|9][0-9]{9}/.test(uid)) { alert('请填写正确的手机号码'); return false; }

        if (pwd.length == 0) { $('.login .error_tip').text('*请输入密码'); return false; } else { $('.login .error_tip').text('') }
        var data = detail ? JSON.parse(detail) : {};
        if (!data.token) { alert('数据加载失败，请返回重试'); return false; }
        var params = {
            platformId: data.user.thirdUser.platformId,
            thirdPartyId: data.user.thirdUser.thirdPartyId,
            thirdPartyNickname: data.user.thirdUser.thirdPartyNickname,
            token: data.token, phone: uid, password: pwd,
            code: $('#code').val(), type: 3, key: captchakey
        };
        var fun = function (res) {
            if (res == -4) { alert('验证码错误，请重新输入！'); return false; }
            if (res.code == '0') {
                util.setCookie('wap_staff_token', res.token);
                // var u = util.parseQuery('backurl');
                var u = util.getCookie('otherLogindata') ? JSON.parse(util.getCookie('otherLogindata')) : '';
                var url = '';
                for (var k in u) { if (k == 'url') { url += u[k] + '?'; } else { url += k + '=' + u[k] + '&'; }; };
                window.location.href = url || '/';
                // u ? window.location.href = u : window.location.href = '/';
            } else if (res.code == '104') { $('.login .error_tip').text('*密码错误！'); } else { alert('绑定失败！'); };
        }

        if (code) {
            params['code'] = code; params['key'] = key || util.uuid();
            params['phone'] = util.enCode(params.phone)
            params['password'] = util.enCode(params.password)
            Account.registerAndBind(params, function (res) { fun(res) });
            return;
        }

        Account.BindUserName(params, function (res) { fun(res) });

    }

    //发验证码
    var sendkey;
    var sendCode = true
    var mins = 60

    var sendCodeEle = $('#sendcode'),
        startTimeInt,
        startTime = function () {
            if (mins == 0) {
                sendCodeEle.val('获取验证码'); startTimeInt && clearInterval(startTimeInt); sendCode = true; sendCodeEle.prop('disabled', false); changeImageCode();
            } else { mins--; sendCodeEle.val('(' + mins + 's)后重发'); sendCodeEle.prop('disabled', true); };
        };
    sendCodeEle.click(function () {
        var uid = mobile.val()

        if (!/^1[3|4|5|6|7|8|9][0-9]{9}/.test(uid)) { alert('请填写正确的手机号！'); return false; };
        if (!sendCode) { return false; };
        sendkey = util.uuid();
        var captchadata = $('#captchadata').val();
        var params = { username: uid, type: 3, captchakey: captchakey, captchadata: captchadata, 'img-key': sendkey };

        Account.sendValidate(params, function (res) {
            if (res && res.code == '0') {
                alert('验证码发送成功，请注意查收！'); sendCode = false; mins = 60; startTimeInt && clearInterval(startTimeInt); startTimeInt = setInterval(startTime, 1000);
            } else if (res && res.code == '-9') { alert('验证码发送过于频繁啦~请稍后再试'); } else if (res && res.code == '-3') { alert('验证码输入错误，请重新输入'); }
        });
    });


    $('#check').click(function () {
        var uid = mobile.val()
        if (/^1[3|4|5|6|7|8|9][0-9]{9}/.test(uid)) {
            mobile.prop('readonly', 'readonly')
            $(this).prop('disabled', 'disabled')
            $http.post('/tclcustomerregist/checkusername', { 'username': uid }, function (res) {
                if (res.code == 1) { //存在
                    alert('您已注册TCL官方商城帐号，请直接输入密码'); $('.step2,.login').show()
                    bindbtn.click(function () { bind(mobile.val(), pwd.val()) })
                } else {
                    $('.step2,.bind').show()
                    bindbtn.click(function () {
                        var code = $('#code').val(); if (code.length == 0) { alert('请填写验证码'); return; }; bind(mobile.val(), pwd1.val(), code, sendkey)
                    })
                }
            })
        } else { alert('请填写正确的手机号码') }
    })

    $('#pwd1,#pwd').keydown(function () { $('.error_tip').text('') })

})
