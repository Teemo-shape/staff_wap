/***
 * create by chuchur
 * 2017年1月16日 16:39:45
 */
$(function () {
    //切换密码可视状态
    $('.iky-eye').on('click', function () {
        var o = $(this).prev('input'), t = o.attr('type'); t = (t == 'password') ? 'text' : 'password'; o[0].type = t;
        o[0].onkeyup = function () { var reg = new RegExp(/[\u4e00-\u9fa5]/g); this.value = this.value.replace(reg, '') }
    })
    //监听输入事件
    $('#username,#codeTxt,#password,#repwd').bind('keyup blur change', function () {
        var uidVal = $('#username').val(), uid = util.checkUser(uidVal), code = $('#codeTxt').val().length > 0, pwd = $.trim($('#password').val()), repwd = $.trim($('#repwd').val()), flag = (uid && code && pwd.length > 0 && repwd.length > 0);
        $('#submitBtn').prop('disabled', !flag);
    })
    //检查密码以及再次输入密码


    var mins = 60, sendTimes = 0, sendCode = true, exitsUser = true;
    //发送验证码
    var sendCodeEle = $('#sendCode'), startTimeInt,
        startTime = function () {
            if (mins == 0) { sendCodeEle.text('获取验证码'); startTimeInt && clearInterval(startTimeInt); sendCode = true; mins = 60; } else { mins--; sendCodeEle.text(mins + 's后重发'); };
        };
    sendCodeEle.click(function () {
        var uidVal = $('#username').val(), uidCheck = util.checkUser(uidVal)
        type = util.checkUser(uidVal, 2) ? 2 : 3;
        if (!uidCheck) { alert('请填写正确的手机号或邮箱账号！'); return false; };
        if (!sendCode) { return false; };
        var param = { username: uidVal };
        Account.checkUserName(uidVal, function (res) {
            if (res && res.code == '0') { exitsUser = false; alert('该账号不存在，请检查'); } else {
                exitsUser = true;
                $http.post('/tclcustomerresetpassword/sendSafetyCode', param, function (res) {
                    if (res && res.status == '1') {
                        if (type == '2') { alert('验证码已成功发送至您的邮箱，请输入邮件中的验证码！'); } else { alert('验证码已成功发送至您的手机上，请输入短信中的验证码！'); }
                        sendCode = false; sendTimes++; startTimeInt && clearInterval(startTimeInt); startTimeInt = setInterval(startTime, 1000);
                    } else { alert('发送验证码失败，请稍后重试'); }
                }, 'application/x-www-form-urlencoded');
            };
        });
    });
    //提交
    $('#submitBtn').click(function () {
        if (!exitsUser) return;

        var username = $('#username').val(), codeTxt = $('#codeTxt').val(), password = $('#password').val(), repwd = $.trim($('#repwd').val());

        if (!util.checkStrong(password)) { alert('密码规格不符合，请重新填写'); return; };

        if (password !== '' && repwd !== '' && password !== repwd) { alert('两次输入的密码不一致，请重新输入'); return; };

        var param = { username: util.enCode(username), safecode: codeTxt, newPassword: util.enCode(password) };
        $http.post('/tclcustomerresetpassword/resetPassword', param, function (json) {
            if (json.status == '1') {
                alert('恭喜您重置密码成功！'); setTimeout(function () { window.location.href = "/user/login.html"; }, 1000)
            } else if (json.status == '-1') { alert('验证码错误！'); } else { alert('重置失败，请稍后重试！') }
        })
    })
});