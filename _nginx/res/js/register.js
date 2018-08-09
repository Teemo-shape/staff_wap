/**
 * by chuchur
 * qiuzhiwu@kuyumall.com
 * 2016年12月15日11:30:51
 */


$(function () {

  var mins = 60,
    sendCode = true,
    exitsUser = false,
    detail = util.parseQuery('detail');
  detail && $('#submits').val('注册并关联');


  $('#username,#code,#password').bind('click', function () {
    $(this).removeAttr('readonly');
    $(this).blur();
    $(this).focus();
  });

  //监听输入事件

  var cheBtnState = function () {
    var uidVal = $('#username').val(),
      uid = util.checkUser(uidVal),
      code = $.trim($('#code').val()).length == 6,
      pwd = $.trim($('#password').val()),
      _pwd = util.checkStrong(pwd),
      remberme = $('#remenberme').is(':checked'),
      rmEle = $('.iky-remove');
    uidVal.length > 0 ? rmEle.show() : rmEle.hide();
    $('#submits').prop('disabled', !(uid && code && _pwd && remberme));
  };

  $('#username,#code,#password,#remenberme').bind('keyup blur change', function () {
    cheBtnState();
  });
  //切换图片验证码
  var captchakey;
  var changeImageCode = function () {
    captchakey = util.uuid();
    $('.imgCode').attr('src', '/rest/getCustomerRegCode?img-key=' + captchakey)
  };
  changeImageCode();
  // 点击切换验证码
  $('.imgCode').click(function () {
    changeImageCode();
  })



  //点击显示密码
  $('.iky-eye').click(function () {
    var pwdEle = $('#password'),
      t = pwdEle.attr('type');
    t = t == 'text' ? 'password' : 'text';
    pwdEle[0].type = t;
    pwdEle[0].onkeyup = function () {
      var reg = new RegExp(/[\u4e00-\u9fa5]/g)
      this.value = this.value.replace(reg, '')
    }
  });
  $('.iky-remove').click(function () {
    $('#username').val('');
    $(this).hide();
  });
  var sendCodeEle = $('#sendCode'),
    startTimeInt,
    startTime = function () {
      if (mins == 0) {
        changeImageCode()
        sendCodeEle.val('获取验证码');
        startTimeInt && clearInterval(startTimeInt);
        sendCode = true;
      } else {
        mins--;
        sendCodeEle.val('(' + mins + 's)后重发');
      };
    };
  //发验证码
  var imgKey;
  sendCodeEle.click(function () {
    if (!sendCode) {
      return false;
    };
    var uidVal = $('#username').val(),
      uidCheck = util.checkUser(uidVal),
      captchadata = $('#captchadata').val();
    if (!uidCheck) {
      alert('请填写正确的手机号或邮箱账号！');
      return false;
    };
    if (captchadata.length == 0) {
      alert('请填写图片验证码！');
      return false;
    };

    imgKey = util.uuid()
    var params = {
      username: uidVal,
      type: util.checkUser(uidVal, 2) ? 2 : 3,
      captchakey: captchakey,
      captchadata: captchadata,
      'img-key': imgKey
    };
    // sendCode = false;
    // sendTimes++;
    // exitsUser = false;
    // return;
    Account.checkUserName(uidVal, function (res) {
      if (res && res.code == '0') {
        exitsUser = false;
        Account.sendValidate(params, function (res) {
          if (res.code == '0') {
            alert('验证码发送成功，请注意查收！');
            sendCode = false;
            mins = 60;
            startTimeInt && clearInterval(startTimeInt);
            startTimeInt = setInterval(startTime, 1000);
          } else if (res.code == '-9') {
            alert('验证码发送过于频繁啦~请稍后再试');
          } else if (res.code == '-3') {
            changeImageCode()
            alert('图片验证码输入错误，请重新输入');
          }
        });
      } else {
        alert('该账号已经存在，请换个账号再试');
        exitsUser = true;
      }
    });
  });
  //协议
  $('.y-text').click(function () {
    $('.modal-bg').fadeIn();
  });
  $('#agreeClose').click(function () {
    $('.modal-bg').fadeOut();
  });

  $('#iagree').click(function () {
    $('.modal-bg').fadeOut();
    $('#remenberme').prop('checked', 'checked');
    cheBtnState();
  });
  //提交注册
  $('#submits').click(function () {
    if (exitsUser) return;
    var uid = $('#username').val(),
      pwd = $('#password').val(),
      params,
      code = $.trim($('#code').val()),
      type = util.checkUser(uid, 2) ? 2 : 3;
    var reg = /.*[\u4e00-\u9fa5]+.*$/
    if (reg.test(pwd)) {
      alert('密码不能包含中文!')
      return false
    }
    if (detail) {
      var data = detail && JSON.parse(detail);
      params = {
        type: type,
        platformId: data.user.thirdUser.platformId,
        thirdPartyId: data.user.thirdUser.thirdPartyId,
        thirdPartyNickname: data.user.thirdUser.thirdPartyNickname,
        token: data.token,
        phone: util.enCode(uid),
        password: util.enCode(pwd),
        code: $('#code').val(),
        key: imgKey
      };
      Account.registerAndBind(params, function (res) {
        if (res == -4) {
          alert('验证码错误，请重新输入！');
          return
        }
        if (res.code != '0') {
          if (res.code == '-4') {
            alert('验证码错误！');
            return false;
          };
          alert('注册关联失败，请返回重试！')
        } else {
          alert('注册关联成功！');
          util.setCookie('wap_staff_token', res.token);
          setTimeout(function () {
            // var u = util.parseQuery('backurl');
            // window.location.href = u ? u : '/';
            var u = util.getCookie('otherLogindata') ? JSON.parse(util.getCookie('otherLogindata')) : '';
            var url = '';
            for (var k in u) {
              if (k == 'url') {
                url += u[k] + '?';
              } else {
                url += k + '=' + u[k] + '&';
              };
            };
            //             alert(url)
            window.location.href = url || '/';
          }, 1000);
        }
      })
    } else {
      params = {
        username: util.enCode(uid),
        password: util.enCode(pwd),
        type: type,
        key: imgKey,
        inputcode: code
      };
      if (!util.checkUser(uid)) {
        alert('请填写正确的手机号或邮箱账号！');
      };
      if (!util.checkStrong(pwd)) {
        alert('密码规格不符合，请重写填写');
      };

      Account.register(params, function (res) {
        if (res.code == '2') {
          alert('该用户已经存在，请更换后再试！');
        } else if (res.code == '1') {
          alert('恭喜你，注册成功！');
          if (window._gsTracker) {
            _gsTracker.track("/targetpage/regOk");
          }

          setTimeout(function () {
            var u = util.parseQuery('backurl');
            var url = "/user/login.html" + (u ? '?backurl=' + encodeURIComponent(u) : '');
            window.location.href = url;
          }, 1000);
        } else {
          if (res.code == '-4') {
            alert('验证码错误！');
            return false;
          }
          alert('注册失败，请检查！');
        };
      });
    };
  })
})
