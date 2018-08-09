/*
 *create by chuchur
 *date :2016年12月6日 09:36:04
 */
//此部分为自适应 部分
! function (win) {
  function w() {
    var eleWid = htmlEle.getBoundingClientRect().width;

    if (eleWid / dprValue > 640) { eleWid = 640 * dprValue; }
    win.rem = eleWid / 16;
    if (win.rem >= 40) { win.rem = 40 }; htmlEle.style.fontSize = win.rem + "px";
  }

  var dprValue, initScaleValue, t, doc = win.document, htmlEle = doc.documentElement, viewport = doc.querySelector('meta[name="viewport"]'), metaFlexible = doc.querySelector('meta[name="flexible"]');
  if (viewport) {
    // console.warn("将根据已有的meta标签来设置缩放比例");
    var o = viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
    o && (initScaleValue = parseFloat(o[2]), dprValue = parseInt(1 / initScaleValue))
  } else {
    if (metaFlexible) {
      var o = metaFlexible.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
      o && (dprValue = parseFloat(o[2]), initScaleValue = parseFloat((1 / dprValue).toFixed(2)))
    }
  }
  if (!dprValue && !initScaleValue) {
    var isAndroid = (win.navigator.appVersion.match(/android/gi), win.navigator.appVersion.match(/iphone/gi)),
      pixelRatio = win.devicePixelRatio;
    if (isAndroid) { if (pixelRatio >= 3) { dprValue = 3; } else if (pixelRatio >= 2) { dprValue = 2; } else { dprValue = 1; } } else { dprValue = pixelRatio; }
    initScaleValue = 1 / dprValue;
  }
  if (htmlEle.setAttribute("data-dpr", dprValue), !viewport) {
    if (viewport = doc.createElement("meta"), viewport.setAttribute("name", "viewport"), viewport.setAttribute("content", "initial-scale=" + initScaleValue + ", maximum-scale=" + initScaleValue + ", minimum-scale=" + initScaleValue + ", user-scalable=no"), htmlEle.firstElementChild) {
      htmlEle.firstElementChild.appendChild(viewport)
    } else {
      var newDiv = doc.createElement("div"); newDiv.appendChild(viewport), doc.write(newDiv.innerHTML)
    }
  }
  win.dpr = dprValue;
  win.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(w, 300); }, false);
  if ("complete" === doc.readyState) { doc.body.style.fontSize = 12 * dprValue + "px"; }
  doc.addEventListener("DOMContentLoaded", function () { doc.body.style.fontSize = 12 * dprValue + "px"; }, false)
  w();
}(window);
//AD 检测代码部分
!(function (a, b, c, d, e, f) {
  try {
    var g = "", h = a.sessionStorage, i = "__admaster_ta_param__", j = "tmDataLayer" !== d ? "&dl=" + d : "";
    if (a[f] = {}, a[d] = a[d] || [], a[d].push({ startTime: +new Date, event: "tm.js" }), h) {
      var k = a.location.search, l = new RegExp("[?&]" + i + "=(.*?)(&|#|$)").exec(k) || [];
      l[1] && h.setItem(i, l[1]), l = h.getItem(i), l && (g = "&p=" + l + "&t=" + +new Date)
    }
    var m = b.createElement(c), n = b.getElementsByTagName(c)[0];
    m.src = "//tag.cdnmaster.cn/tmjs/tm.js?id=" + e + j + g, m.async = !0, n.parentNode.insertBefore(m, n)
  } catch (e) { }
})(window, document, "script", "tmDataLayer", "TM-887813", "admaster_tm");


var util = {
  loadScript: function (url) { var script = document.createElement('script'); script.type = 'text/javascript'; script.src = url; document.head.appendChild(script); },
  createTimestamp: function () { //取时间撮
    //201508061018417065
    var dt = new Date();
    var y = dt.getFullYear();
    var M = dt.getMonth() + 1;
    var d = dt.getDate();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var sec = dt.getSeconds();
    var minsec = dt.getMilliseconds();
    var str = y + "";
    M = M < 10 ? '0' + M : M;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    sec = sec < 10 ? '0' + sec : sec;
    minsec = minsec < 1000 ? '0' + minsec : minsec;
    str += M + d + d + m + sec + minsec;
    return str;
  },
  //密码加密
  enCode: function(s) {
      // rsa公钥
      var publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJCOtfDgtXPNhHBwF926WFLkquAms+F50g0j04Sgh2eq8Bv09qb14KCYMtJCFF/kk0TZQ9aXwtSMIPBMElr/9TMCAwEAAQ==';
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      return encodeURIComponent(encrypt.encrypt(s));
  },
  setCookie: function (name, value, days, domain) { //两个参数，一个是cookie的名子，一个是值
    // if (window.localStorage && window.localStorage.setItem) {
    //   window.localStorage.setItem(name, value)
    // } else {
    var Days, exp = new Date()
    if (typeof (days) === 'object') { Days = days } else {
      days = (days === undefined) ? 30 : days; //  此 cookie 将被保存 30 天
      Days = exp.getTime() + days * 24 * 60 * 60 * 1000;
    };
    exp.setTime(Days); document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=' + (domain ? 'domain=' + domain : '/')

  },
  getCookie: function (name) { //取cookies函数
    /* try {
      if (localStorage && localStorage.getItem(name)) {
        return localStorage.getItem(name);
      } else {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
      }
    } catch (e) { */
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null
    /* };
    return null; */
  },
  delCookie: function (name) //删除cookie
  {
    if (window.localStorage && window.localStorage.removeItem) { window.localStorage.removeItem(name) };
    var old = this.getCookie(name); old && (document.cookie = name + '=' + old + ';expires=Fri, 31 Dec 1999 23:59:59 GMT;')
  },
  parseQuery: function (pkey) { //url 取值
    var search = window.location.search;
    var args = search.substring(1).split('&');
    var argsParsed = {};
    var i, arg, kvp, key, value;
    for (i = 0; i < args.length; i++) {
      arg = args[i];
      if (-1 === arg.indexOf('=')) { argsParsed[$.trim(decodeURIComponent(arg))] = true; } else { kvp = arg.split('='); key = $.trim(decodeURIComponent(kvp[0])); value = $.trim(decodeURIComponent(kvp[1])); argsParsed[key] = value; }
    }
    if (pkey) { return argsParsed[pkey]; }
    return argsParsed;
  },
  uuid: function () { //生成uuid 并且寸cookie
    var uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // this.setCookie("temp_id", uuid, 360);
    return uuid;
  },
  guid: function () {
    function S4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  slider: function (data) {
    var swpdata = data || { nextButton: '.swiper-button-next', prevButton: '.swiper-button-prev', pagination: '.swiper-pagination', autoplay: 3000 };
    return typeof (Swiper) != 'undefined' && Swiper('.swiper-container', swpdata);
  },
  checkStrong: function (v, l1, l2) { //检测密码强度
    var modes = 0, l1 = l1 || 8, l2 = l2 || 16;
    if (v.length < l1 || v > l2) return false;
    (/\d/.test(v)) && modes++; //数字
    (/[a-z]/.test(v)) && modes++; //字母小写
    (/[A-Z]/.test(v)) && modes++; //字母大写
    (/\W/.test(v)) && modes++; //特殊字符
    return modes > 1;
  },
  checkUser: function (v, t) {
    var emailReg = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/, mobileReg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/, telphone = /^0\d{2,3}-?\d{7,8}$/, zhNameReg = /^[\u4e00-\u9fa5]{2,20}$/, enNameReg = /^[a-zA-Z\/]{2,20}$/, ext = false;
    t == 1 && (ext = mobileReg.test(v));
    t == 11 && (ext = mobileReg.test(v) || telphone.test(v));
    t == 2 && (ext = emailReg.test(v));
    t == 3 && (ext = zhNameReg.test(v) || enNameReg.test(v));

    !t && (ext = (mobileReg.test(v) || emailReg.test(v)));
    return ext;
  },
  formatDate: function (datespan, isfull, lan) { //时间格式化
    if (!datespan) return new Date()
    if (typeof (datespan) == 'string')
      datespan = datespan.replace(/-/g, '/') //在safari 里面 无法识别 '2017-08-08' 这种时间格式
    var date = new Date(datespan);
    Y = date.getFullYear();
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    D = date.getDate();
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return lan ? Y + '年' + M + '月' + D + '日' + h + m + s : (isfull ? Y + '-' + M + '-' + D + ' ' + h + m + s : Y + '-' + M + '-' + D)
  },
  getAyName: function (str) { //截取字符串中间以*号代替
    if (!str || str.length <= 2) { return str; }
    str = str.toString();
    return str.substring(0, 2) + '***' + str.substring(str.length - 3, str.length - 1);
  },
  urlTojson: function (url) { //地址传参转数组
    if (!url || url.length == 0) return '';
    url = decodeURIComponent(url);
    var obj = {};
    obj.url = url.split('?')[0];
    var args = url.split('?')[1];
    if (args && args.length > 0) {
      var arg = args.split('&');
      if (arg && arg.length >= 1) {
        arg.map(function (m) { var ar = m.split('='); if (ar && ar.length > 1) { obj[ar[0]] = ar[1]; }; });
      };
    };
    return obj;
  },
  iswx: function () {
    return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
  },
  btoa: function (str) {
    var out, i, len, c1, c2, c3, char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    len = str.length; i = 0; out = "";
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += char.charAt(c1 >> 2);
        out += char.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += char.charAt(c1 >> 2);
        out += char.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += char.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += char.charAt(c1 >> 2);
      out += char.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += char.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += char.charAt(c3 & 0x3F);
    }
    return out;
  },
  atob: function (str) {
    var c1, c2, c3, c4, i, len, out,
      char = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      /* c1 */
      do { c1 = char[str.charCodeAt(i++) & 0xff]; }
      while (i < len && c1 == -1);
      if (c1 == -1) break;
      /* c2 */
      do { c2 = char[str.charCodeAt(i++) & 0xff]; }
      while (i < len && c2 == -1);
      if (c2 == -1) break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
      /* c3 */
      do { c3 = str.charCodeAt(i++) & 0xff; if (c3 == 61) return out; c3 = char[c3]; }
      while (i < len && c3 == -1);
      if (c3 == -1) break;
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
      /* c4 */
      do { c4 = str.charCodeAt(i++) & 0xff; if (c4 == 61) return out; c4 = char[c4]; }
      while (i < len && c4 == -1);
      if (c4 == -1) break; out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    };
    return out;
  },
  unhtml: function (str) {
    return str ? str.replace(/[<">'()]/g, function (a) { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '(': '&#40;', ')': '&#41;' }[a] }) : ''
  }
}

window.btoa = util.btoa
window.atob = util.atob

var __token = util.parseQuery('ihome-token');
var __fanliCookie = util.parseQuery('fanliCookie');
__fanliCookie && util.setCookie('fanliCookie', __fanliCookie);
__token && util.setCookie('wap_staff_token', __token);

window.alert = function (msg, callback) {
  var did = 'd-' + util.uuid();
  $('html,body').addClass('noscroll');
  $('body').append('<div class="dask ' + did + '"><div class="dialog fadeIn animated"><p>' + (msg || '&nbsp;') + '</p></div></div>');
  setTimeout(function () {
    var dlgele = $('.' + did);
    dlgele.find('.dialog').removeClass('fadeIn animated').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $('html,body').removeClass('noscroll'); dlgele.remove(); callback && setTimeout(callback(), 1000);
    });
  }, 2000);
};
window.prompts = function (msg, value, callback, expCallback, cancelText, okText) {
  var did = 'd-' + util.uuid();
  $('html,body').addClass('noscroll');
  $('body').append('<div class="dask ' + did + '">' +
    '<div class="dialog fadeIn animated">' +
    '<p>' + (msg || '我就弹个框') + '</p>' +
    '<p><input type="text" id="promptVal" value="' + (value || '') + '"/></p>' +
    '<div class="btns"><span id="btncancel">' + (cancelText || '取消') + '</span><span id="btnok">' + (okText || '确定') + '</span></div>' +
    '</div></div>');
  setTimeout(function () {
    var dlgele = $('.' + did);
    dlgele.find('#btnok').live('click', function () {
      var v = dlgele.find('#promptVal').val();
      if (expCallback && expCallback(v) === false) { return false; } else {
        dlgele.find('.dialog').removeClass('fadeIn animated').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $('html,body').removeClass('noscroll'); dlgele.remove(); callback && setTimeout(callback(v), 1000);
        });
      }
    });
    dlgele.find('#btncancel').live('click', function () {
      dlgele.find('.dialog').removeClass('fadeIn animated').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $('html,body').removeClass('noscroll'); dlgele.remove();
      });
    });
  }, 2000);
};
window.confirm = function (title, msg, okcallback, cancelText, okText, cancelcallback) {
  if (!title) title = '提示';
  cancelText = !cancelText ? "取消" : cancelText;
  okText = !okText ? "确定" : okText;
  $('html,body').addClass('noscroll');
  var did = 'd-' + util.uuid();

  $('body').append('<div class="dask ' + did + '"><div class="dialog confirm fadeIn animated">' +
    // '<span class="iky-info"></span>' +
    '<h1>' + title + '</h2><p>' + (msg || '我就弹个框') + '</p><div class="btns"><span id="btncancel">' + cancelText + '</span><span id="btnok">' + okText + '</span></div></div></div>');
  var dlgele = $('.' + did);

  dlgele.find('#btnok').live('click', function () {
    dlgele.find('.dialog').removeClass('fadeIn animated').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $('html,body').removeClass('noscroll'); dlgele.remove(); okcallback && setTimeout(okcallback(), 1000);
    });
  })
  dlgele.find('#btncancel').live('click', function () {
    dlgele.find('.dialog').removeClass('fadeIn animated').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $('html,body').removeClass('noscroll'); dlgele.remove(); cancelcallback && setTimeout(cancelcallback(), 1000);
    });
  });
};
window.log = function () { console.log(arguments); };
//小熊客服

var user = util.getCookie('user');
var Uid = user ? JSON.parse(user).customerName : ''; //获取用户ID

var NTKF_PARAM = {
  siteid: "kf_9428", //企业ID，为固定值，必填
  settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
  uid: Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
  uname: Uid, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
  isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
  userlevel: "1", //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
};
window.XNupdate = function (obj) { NTKF_PARAM && NTKF && NTKF.im_updatePageInfo(obj); }

var urlpath = location.pathname;

if (urlpath.indexOf('/goods/catgory.html') >= 0) { //频道页面
  var cid = util.parseQuery('catgoryid'); //获取categoryUuid，判断不同频道页
  /*频道页分类名称，相应的cateUuid 对应相应的频道*/
  var channelObj = { "tv": "电视", "mobile": "手机", "air": "空调", "refrigerator": "冰箱", "washer": "洗衣机", "health": "健康电器" };
  NTKF_PARAM['ntalkerparam'] = {
    category: channelObj[cid] //分类名称，多分类可以用分号(;)分隔， 长路径父子间用冒号(:)分割
  };
} else if (urlpath.indexOf('/goods/detail.html') >= 0) {
  NTKF_PARAM['itemid'] = util.parseQuery('uuid'); //(必填)商品ID
  NTKF_PARAM['itemparam'] = "wap_Product";
};

$(function () {
  //顶栏广告
  /*$http.get('/homePage/getActiveTopBars', { terminalType: '02' }, function (res) {
    if (res.retData && res.retData.imgUrl) { $('body').prepend('<div class="_7th"><a href="' + res.retData.url + '" target="_blank"><img src="' + res.retData.imgUrl + '"/></a></div>') }
  })*/
  //右下角
  $('body').append('<nav class="kf-up">' + '<a href="javascript:void(0);" class="iky-bear" onclick="NTKF.im_openInPageChat(\'kf_9428_1525949700591\')"></a><a href="javascript:;" class="iky-arrow-up"></a></nav>');
  $(window).scroll(function () {
    // 当滚动到最底部以上100像素时， 加载新内容
    $(this).scrollTop() > 100 ? $('.kf-up').addClass('in') : $('.kf-up').removeClass('in');
  });
  $('.iky-arrow-up').live('click', function () { $('html, body').animate({ 'scrollTop': 0 }); });
  //菜单伸缩
  $('.header .iky-menu').click(function () { $('html ,body').addClass('noscroll'); $('.headermenu').css('top', 0); })
  $('.headermenu .iky-delete').click(function () { $('html, body').removeClass('noscroll'); $('.headermenu').css('top', '-100%'); });
  //二级菜单
  $('.headermenu .sub').click(function () {
    var _this = $(this), sub = $(this).find('.sub-item'), h = _this.prev().height(), h2 = sub.height(), h3 = _this.hasClass('active') ? h : h + h2;
    _this.toggleClass('active');
    _this.animate({ 'height': h3 });
  });
  //购物车数量
  Cart.count(function (res) { res.code == '0' && res.data && $('.cart-count').text(res.data).show(); });
  $.fn.noTap = function () {
    $(this).live('touchstart', function preventZoom(e) {
      $(this).trigger('click').trigger('click');
      $(this).trigger('dbclick').trigger('dbclick');
      var t2 = e.timeStamp,
        t1 = $(this).data('lastTouch') || t2, dt = t2 - t1, fingers = e.originalEvent.touches.length;
      $(this).data('lastTouch', t2);
      if (!dt || dt > 500 || fingers > 1) return; // not double-tap
      e.preventDefault(); // double tap - prevent the zoom
      // also synthesize click events we just swallowed up
    });
  };
  $('.sync-loding').noTap();
  $('.sync-loding span').noTap();
  $('.dask').noTap();
  $('.cart').noTap();




  //百度统计代码
  var _hmt = _hmt || []; (function () { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?cf2d8b4a2a7c75110e11aa563a0c282a"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s); })();
});
// 百度自推
var _gsq = _gsq || []; (function () { var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = (location.protocol == 'https:' ? 'https://ssl.' : 'http://static.') + 'gridsumdissector.com/js/Clients/GWD-002944-46616A/gs.js'; var firstScript = document.getElementsByTagName('script')[0]; firstScript.parentNode.insertBefore(s, firstScript); })();
