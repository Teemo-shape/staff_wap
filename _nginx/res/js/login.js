/**
 * by chuchur
 * qiuzhiwu@kuyumall.com
 * 2016年12月15日11:30:51
 */

$(function () {
    var detail = util.parseQuery('detail'), backurl = util.parseQuery('backurl'), iswx = util.iswx();

    $('#regbtn').attr('href', '/user/register.html' + (backurl ? '?backurl=' + encodeURIComponent(backurl) : ''))
    //第三方登录
    var toLogin = function (type) {
        local = window.location, hostname = local.protocol + '//' + local.hostname + (local.port == '80' || local.port == '' ? '' : ':' + local.port); // + local.pathname,
        var data = util.urlTojson(backurl) || { url: '/my' };
        data['loginType'] = type;
        // var to = JSON.stringify(data),
        util.setCookie('otherLogindata', JSON.stringify(data));
        var url = encodeURIComponent(hostname + '/user/loginToBind.html');
        // (type == 3 && iswx) && (type = 10);
        // Account.getThirdLoginUrl(type, function (res) {

        // });
        var domain = (document.domain == "m.tcl.com") ? "https://login.tclclouds.com" : "https://logintest.tclclouds.com";
        //source=1  get 提交方式
        //source=6  post 提交方式

        window.location.href = domain + '/account/thirdParty/login?from=' + url + '&source=1&type=' + type + '&appId=14046695';
    };

    iswx && toLogin(10);

    iswx ? $('.other-login a').eq(1).css('visibility', 'visible') : $('.other-login a').not(':eq(1)').css('visibility', 'visible');
    //监听输入事件


    $('#uid,#pwd,#captchadata').bind('keyup blur change load', function () {
        var n = $.trim($('#uid').val()).length, n1 = $.trim($('#pwd').val()).length, n2 = !$('.verify').is(':visible') ? true : ($('#captchadata').val().length == 4 ? true : false), o = $('.iky-remove');
        n > 0 ? o.show() : o.hide();
        (n > 0 && $.trim($('#pwd').val()).length > 0 && n2) ? $('#loginbtn').prop('disabled', false) : $('#loginbtn').prop('disabled', true);
    });
    $('#uid').focus();
    //点击显示密码
    $('.iky-eye').click(function () {
        var o = $('#pwd'), t = o.attr('type'); t == 'text' ? t = 'password' : t = 'text'; o[0].type = t; o[0].onkeyup = function () { var reg = new RegExp(/[\u4e00-\u9fa5]/g); this.value = this.value.replace(reg, ''); }
    });
    $('.iky-remove').click(function () { $('#uid').val(''); $(this).hide(); });

    var captchakey = '', params;
    $('#loginbtn').click(function () {
        var uid = $.trim($('#uid').val()), pwd = $.trim($('#pwd').val());
        uid = btoa(btoa(util.guid()) + btoa(uid) + btoa(util.guid()));
        pwd = btoa(btoa(util.guid()) + btoa(pwd) + btoa(util.guid()));


        var captchadata = $.trim($('#captchadata').val());
        if (captchakey != '' && captchadata.length == 0) { alert('请填写验证码！'); return false }

        params = { captchadata: captchadata, captchakey: captchakey, loginName: uid, pwd: pwd, simpleDbCart: {}, backUrl: '' }
        Account.login(params, function (res) {
            if (res.code == '-5') {
                alert('验证码错误！'); $('#loginbtn').prop('disabled', true);
                Account.getCaptcha(function (res) {
                    if (res.status == 1) { captchakey = res.key; $('#imgcode').attr('src', res.url); $('.verify').show(); };
                });
            } else if (res.code == '0') {
                res && res.code == '0' && util.setCookie('wap_staff_token', res.token);

                if (window._gsTracker) { _gsTracker.track("/targetpage/loginOk"); }

                User.getInfo({ auth: 1 }, function (res) { res.code == '0' && util.setCookie('user', JSON.stringify(res.data)); window.location.href = backurl || '/'; });
            } else if (res.code == '112') { alert('该用户不存在！'); } else { //if (res.code == '-1') {
                alert('非员工账号或密码不正确！'); $('#loginbtn').prop('disabled', true);
                Account.getCaptcha(function (res) { if (res.status == 1) { captchakey = res.key; $('#imgcode').attr('src', res.url); $('.verify').show(); }; });
            }
        });
    });
    //点击刷新验证码
    $('.pass-code').live('click', function () { Account.getCaptcha(function (res) { if (res.status == 1) { captchakey = res.key; $('#imgcode').attr('src', res.url); }; }); });

    $('.other-login a').click(function () { var type = $(this).attr('data-type'); toLogin(type); });



});
