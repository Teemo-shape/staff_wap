$(function () {
    var detail = util.parseQuery('detail'), data = JSON.parse(detail), loginType = util.getCookie('otherLogindata') ? JSON.parse(util.getCookie('otherLogindata')).loginType : '1';

    // console.log(detail);
    var domain = (document.domain == "m.tcl.com") ? "https://login.tclclouds.com" : "https://logintest.tclclouds.com";
    //source=1  get 提交方式
    //source=6  post 提交方式
    if (data && data.loginCallBack && data.loginCallBack.url == domain + '/account/injectSSOInfo') {
        Account.loginBind({ detail: detail }, function (res) {
            if (res.code == '0') {
                util.setCookie('wap_staff_token', res.data.token);
                var u = util.getCookie('otherLogindata') ? JSON.parse(util.getCookie('otherLogindata')) : '';
                var url = '';
                for (var k in u) { if (k == 'url') { url += u[k] + '?'; } else { url += k + '=' + u[k] + '&'; }; };
                window.location.href = url || '/';
            } else { if (util.iswx()) { window.location.href = '/user/initPhone.html?detail=' + detail } else { $('.login-bind').show() } }
        });
    };


    var t = loginType == '2' ? '腾讯QQ' : (loginType == '1' ? '新浪微博' : '微信');

    $('.bind-info img').attr('src', data.user.thirdUser.bigheadpic || data.user.thirdUser.headpic);
    $('.bind-info .nick').text(data.user.thirdUser.thirdPartyNickname);
    $('.bind-info .logintype').text(t);


    $('.toreg').click(function () { window.location.href = '/user/register.html?detail=' + detail; });
    $('.tobind').click(function () { window.location.href = '/user/bindUser.html?detail=' + detail; });
})
