/**
 * create by chuchur
 * 2016年12月27日10:31:51
 * mail to qiuzhiwu@kuyumall.com
 */

$(function () {
	var exitsUser = true, detail = util.parseQuery('detail');
	//监听输入事件
	$('#username,#password').bind('keyup blur change load', function () {
		var uidVal = $('#username').val(), pwd = $('#password').val(), uid = util.checkUser(uidVal), _pwd = pwd.length > 0, rmEle = $('.iky-remove');
		uidVal.length > 0 ? rmEle.show() : rmEle.hide();
		(uid && _pwd) ? $('#submits').prop('disabled', false) : $('#submits').prop('disabled', true);
	});

	//点击显示密码
	$('.iky-eye').click(function () {
		var pwdEle = $('#password'), t = pwdEle.attr('type'); t = t == 'text' ? 'password' : 'text';
		pwdEle[0].type = t;
		pwdEle[0].onkeyup = function () { var reg = new RegExp(/[\u4e00-\u9fa5]/g); this.value = this.value.replace(reg, ''); }
	});
	$('.iky-remove').click(function () { $('#username').val(''); $(this).hide(); });
	//提交注册
	$('#submits').click(function () {
		var uid = $('#username').val(), pwd = $('#password').val(), params;
		//判断该账号注册过没
		$http.post('/tclcustomerregist/checkusername', { 'username': uid }, function (res) {
			if (res.code == 0) { alert('该账号不存在，请重新输入'); return; }
			else if (res.code == 1) {
				if (uid.length == 0 || pwd.length == 0) { return; };
				if (detail) {
					var data = detail && JSON.parse(detail);
					params = { platformId: data.user.thirdUser.platformId, thirdPartyId: data.user.thirdUser.thirdPartyId, thirdPartyNickname: data.user.thirdUser.thirdPartyNickname, token: data.token, phone: uid, password: pwd };
					Account.BindUserName(params, function (res) {
						if (res.code == '0') {
							util.setCookie('wap_staff_token', res.token);
							// var u = util.parseQuery('backurl');
							var u = util.getCookie('otherLogindata') ? JSON.parse(util.getCookie('otherLogindata')) : '';
							var url = '';
							for (var k in u) { if (k == 'url') { url += u[k] + '?'; } else { url += k + '=' + u[k] + '&'; }; };
							window.location.href = url || '/';
							// u ? window.location.href = u : window.location.href = '/';
						} else if (res.code == '104') { alert('用户名或密码错误！'); } else if (res.code == '302') { alert('第三方账号不存在！'); } else { alert('关联失败！'); };
					});
				} else { alert('非法的页面请求！'); };
			}
		})
	});

});
