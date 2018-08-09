/**
 * create by chuchur
 * email:qiuzhiwu@kuyumall.com
 * date:2016年12月7日 10:11:51
 */
// var ossdomain = (document.domain == "m.tcl.com") ? "//m.user.tcl.com" : "//m.testuser.tclo2o.cn";
// util.loadScript(ossdomain + '/sso/account/verifyUsernameToken?client_id=14046695&funcName=ossLogin');
var server = '/rest',
  // var server = 'http://10.120.54.47/rest',
  callbacks = [],
  // ossResponsed = false, // oss
  ossResponsed = true,
  /*   ossCheckLogin = function (code, callback) {
      ajax('/ssologin/check', 'get', {
        code: code
      }, callback, 'json', true)
    }, */
  ossLogin = function (m) {
    if (m) {
      m.status == 1 && $.post('/rest/ssologin/check', {
        code: m.code
      }, function (res) {
        ossResponsed = true
        res.code == 0 && res.token && util.setCookie('wap_staff_token', res.token)
        var call = callbacks[0]
        call && (call(), callbacks.shift())
        callbacks.length > 0 && ossLogin()
      })
      m.status != 1 && util.delCookie('wap_staff_token')
      parseInt(m.status) === -1 && (ossResponsed = true, ossLogin())
      return false
    }
    var call = callbacks[0]
    call && (call(), callbacks.shift())
    callbacks.length > 0 && ossLogin()
  },
  syncTime = 0,
  syncfun,

  toType = function (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  },
  ajax = function (url, type, params, callback, contentType, async) {
    // if (!checkOssLogin) {
    //   util.loadScript(ossdomain + '/sso/account/verifyUsernameToken?client_id=14046695&funcName=ossLogin')
    //   checkOssLogin = true;
    // }

    var call = function () {
      syncTime == 0 && $('body').append('<div class="sync-loding"><span></span></div>');
      syncTime++;
      syncfun && clearInterval(syncfun);
      // $('.sync-loding').noTap();
      var conType = toType(params) === 'formdata' ? false : (contentType || (type == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8'));
      url = server + url;
      var auth = 0
      if (params && params.auth != '') auth = params.auth //0=>未登录不进行跳转
      auth && delete params.auth
      var dataType = params && params.dataType || 'json'
      params && params.dataType && delete params.dataType

      $.ajax({
        url: url,
        type: type,
        dataType: dataType,
        // timeout: 5000,
        async: async || true,
        data: params,
        cache: false,
        contentType: conType,
        processData: toType(params) === 'formdata' ? false : true,
        beforeSend: function (request) {
          request.setRequestHeader('ihome-timestamp', util.createTimestamp())
            .setRequestHeader('ihome-token', util.getCookie('wap_staff_token'))
            .setRequestHeader('uid', util.createTimestamp() + '-' + util.uuid())
            .setRequestHeader('ihome-version', '0.0.1')
            .setRequestHeader('appversion', '0.0.1');
        },
        success: function (res) {
          if (res && res.code == '9999') {
            alert('系统出错，请稍后再试');
            return;
          }
          if (res && res.code == '403' && auth == 1) {
            Account.toLogin()
            return false;
          }

          callback && callback(res);
        },
        error: function (xhr, errTxt) {
          // alert(xhr, errTxt)
          // errTxt == "error" && alert('服务器出错了...',xhr, errTxt);
          errTxt == "timeout" && alert('服务器超时...');
        },
        complete: function () {
          syncTime--;
          syncTime <= 0 && (syncTime = 0);
          syncTime == 0 && (syncfun = setInterval(function () {
            $('.sync-loding').remove();
          }, 300));
        }
      });

    };
    ossResponsed ? call() : callbacks.push(call)
    // ossLogin()
  },
  $http = {
    get: function (url, params, callback) {
      ajax(url, 'GET', params, function (res) {
        callback && callback(res)
      });
    },
    post: function (url, params, callback) {
      ajax(url, 'POST', params, function (res) {
        callback && callback(res)
      });
    },
    postSync: function (url, params, callback) {
      ajax(url, 'POST', params, function (res) {
        callback && callback(res)
      }, null, true);
    },
    postString: function (url, params, callback) {
      ajax(url, 'POST', JSON.stringify(params), function (res) {
        callback && callback(res)
      }, 'application/json; charset=utf-8');
    },
    upload: function (url, params, callback) {
      if (!params.id) {
        alert('请传入ID值')
        return false
      }
      var data = new window.FormData();
      var obj = document.getElementById(params.id).files[0]
      if (obj.type != 'image/png' && obj.type != 'image/jpeg' && obj.type != '') {
        alert('目前只支持上传png，jpg格式图片')
        return false
      }
      var maxsize = params.maxsize || 3 * 1204 * 1204
      var minsize = params.minsize || 1204
      if (obj.size > maxsize) {
        alert('上传文件不能大于' + parseInt(maxsize / 1024) + 'KB')
        return false
      }
      // if (obj.size < minsize) {
      //     alert('上传文件不能小于' + parseInt(minsize / 1024) + 'KB')
      //     return false
      // }
      data.append(params.id, obj)
      ajax(url, 'POST', data, function (res) {
        callback && callback(res)
      });
    }
  },
  Cart = { //购物车
    count: function (callback) { //取购物车数量
      if (util.getCookie('wap_staff_token'))
        $http.get('/cart/count', null, function (res) {
          callback && callback(res);
        });
    },
    list: function (params, callback) { //取购物车列表
      $http.get('/cart/show', {
        terminalType: '02'
      }, function (res) {
        callback && callback(res);
      });
    },
    add: function (params, callback) { //新增购物车
      //  productUuid: uuid,
      // buyNum: buyCount,
      // attrId: skuNo
      $http.post('/front/product/addProductToCart', params, function (res) {
        callback && callback(res);
      });
    },
    remove: function (params, callback) { //购车单个删除
      $http.get('/cart/removeKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    addSuite: function (params, callback) { //套装的购买
      // suitUuid=9120ff0d5c2c47ffa05f1f6e9441f6a3&buyNum=1&distributorUuid=&mainProductUuid=28ca18b4b8a545cc8dbafe02905ef228&mainSkuNo=TP001030102030200168&areaUuid=15793
      $http.post('/front/product/addSuitProductToCartKuyu', params, function (res) {
        callback && callback(res);
      });

    },
    update: function (params, callback) { //更新购物车数量
      $http.get('/cart/changeNumsKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    check: function (params, callback) { //购物车单选
      $http.get('/cart/changeChooseKuyu', params, function (res) {
        callback && callback(res);
      });
    }
  },
  Goods = {
    getPrice: function (params, callback) { //根据商品ID 取商品价格
      $http.post('/front/product/getProductPriceByProductUuid', params, function (res) {
        callback && callback(res);
      });
    },
    getCatgory: function (channel, params, callback) { //商品频道信息
      // var channels = {
      //     tv: 'toTVKuyu',
      //     mobile: 'toMobileKuyu',
      //     refrigerator: 'toIceboxKuyu',
      //     air: 'toAirKuyu',
      //     washer: 'toWashKuyu',
      //     homeappliance: 'toHealthEleKuyu',
      // }
      $http.get('/newchannel/' + channel, params, function (res) {
        callback && callback(res);
      })
    },
    getTypes: function (productUuid, callback) { //获取商品 颜色，尺寸 类别信息
      $http.get('/front/product/babyset', {
        productUuid: productUuid
      }, function (res) {
        callback && callback(res);
      })
    },
    search: function (params, callback) { //商品搜索
      $http.post('/itemsearch/toProductList', params, function (res) {
        callback && callback(res);
      }, 'application/x-www-form-urlencoded')
    },
    detail: function (uuid, callback) { //商品详情
      $http.get('/front/product/toProductKuyu', {
        uuid: uuid,
        terminalType: '02'
      }, function (res) {
        callback && callback(res);
      });
    },
    getServicePolicies: function (params, callback) { //服务政策
      $http.get('/front/product/getServicePolicies', params, function (res) {
        callback && callback(res);
      });
    },
    getCommonProblems: function (params, callback) { //常见问题
      params['terminalType'] = '02'
      $http.get('/front/product/getCommonProblems', params, function (res) {
        callback && callback(res);
      });
    },
    getProductComments: function (params, callback) { //用户评论
      $http.post('/front/product/showProductComments', params, function (res) {
        callback && callback(res);
      });
    },
    getProductCommentCounts: function (uuid, callback) { //用户评论的星星情况
      $http.get('/front/product/getProductCommentCounts', {
        productUuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    addFavorite: function (params, callback) { //加入收藏  productUuid
      $http.get('/front/product/collectProduct', params, function (res) {
        callback && callback(res);
      });
    },
    cancelFavorite: function (params, callback) { //取消收藏  productUuid
      $http.get('/front/product/cancelFavorite', params, function (res) {
        callback && callback(res);
      });
    },
    getCatgorySlider: function (channel, callback) { //加载分类的轮播图
      $http.get('/getChannelAds/wap', {
        channel: channel
      }, function (res) {
        callback && callback(res);
      });
    },
    getCouponList: function (params, callback) { //取优惠券信息
      // String storeUuid, String productUuid, String regionId,  String terminalType
      $http.get('/front/product/getProductDetailExtraInfo/getCouponList', params, function (res) {
        callback && callback(res);
      });
    },
    getCoupon: function (uuid, callback) { //领取优惠券
      $http.get('/cart/downLoadCoupon', {
        couponTypeUuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getSuite: function (params, callback) { //获取套装信息，判断是否有套装
      // productUuid:4f875fbea2184a2aa1f1928ca64477d0
      // regionId:1000
      $http.post('/front/product/getSuitMainByRegion', params, function (res) {
        callback && callback(res);
      });
    },
    getSecKillDetai: function (params, callback) { //获取秒杀商品信息
      // promotionUuid:9540308680b34bd2abc7fde19c2e5d9a
      // skuNo:TP001030102030200168
      params['terminalType'] = '02'
      $http.post('/front/product/toLimitProductKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    getStorePromotion: function (params, callback) { //取促销信息
      // productUuid:7a28a0ea9c844561957f734c959f7f97
      // storeUuid:03d03b6b05604c5cb065aef65b72972e
      $http.get('/front/product/getStorePromotion', params, function (res) {
        callback && callback(res);
      });
    },
    getpresaleProduct: function (params, callback) { //预付定金确认信息
      //    dealerBcustomerUuid:''
      //     pIds	9500ccd7bce7483585c53f3db92bf8ab
      //     buyNum	1
      //     attrIds	TP001050103020100003
      //     chooseCod
      //     willType	2
      params['terminalType'] = '02';
      $http.post('/front/product/presaleProductToOrder', params, function (res) {
        callback && callback(res);
      });
    },
    getReservationProduct: function (params, callback) { //预定商品
      // productUuid	e07d222b1ab941aab7c7a37f5da7254f
      // buyNum	1
      // skuNo	P001010101010100121
      $http.post('/front/product/addProductToOrder', params, function (res) {
        callback && callback(res);
      });
    },
    hasProduct: function (params, callback) { //判断区域有没有货
      $http.post('/front/product/hasProduct', params, function (res) {
        callback && callback(res);
      });
    },
    hasSecKillProduct: function (params, callback) { //判断区域有没有货-秒杀
      // region:1318
      // areaUuid:14950
      // skuNo:TP001050104020100003
      // buyNum:1
      // bType:
      // provinceId:05
      // promotionUuid:d2e04c60097847e99a65fad331715812
      // cityId:144
      // parentSkuNo:
      // time:0.43164997491295765
      $http.post('/front/product/hasLimitProduct', params, function (res) {
        callback && callback(res);
      });
    },
    checkSecKillBuy: function (params, callback) { //检测是否可以秒杀
      // promotionUuid	d2e04c60097847e99a65fad331715812
      // skuNo	TP001050104020100003
      // areaUuid	14950
      // region	1318
      // provinceId	05
      // cityId	144
      $http.post('/cart/checkLimitBuy', params, function (res) {
        callback && callback(res);
      });
    },
    getSecKillProduct: function (params, callback) { //取秒杀确认订单信息
      // skuNo	TP001050104020100003
      // promotionUuid	d2e04c60097847e99a65fad331715812
      $http.get('/front/product/fastBuyLimitProduct', params, function (res) {
        callback && callback(res);
      });
    },
    checkAddressBuy: function (params, callback) { //检测新地址是否有货
      params['terminalType'] = '02';
      $http.post('/splitorder/chooseaddressNewKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    findStockNum: function (params, callback) { //判断库存-秒杀
      //productSku:TP001010101010100134
      // promotionUuid:5c4f27d290b4416195ce72472b90da62
      // addressUuid:486a3fb193734442832d5551fe548d88
      $http.post('/splitorder/findStockNum', params, function (res) {
        callback && callback(res);
      });
    },
    getMyProductFavoriteList: function (callback) { //取个人全部收藏列表
      $http.get('/front/product/getMyProductFavoriteList', null, function (res) {
        callback && callback(res);
      });
    }
  },
  Address = {
    getAllProvince: function (callback) { //取省份
      $http.get('/usercenter/region/getAllProvince', null, function (res) {
        callback && callback(res);
      });
    },
    getCities: function (provinceUuid, callback) { //取城市
      $http.get('/usercenter/region/getCitysByProvinceUuid', {
        provinceUuid: provinceUuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getRegions: function (cityUuid, callback) { //取乡镇区域
      $http.get('/usercenter/region/getRegionsByCityUuid', {
        cityUuid: cityUuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getStreets: function (regionUuid, callback) { //取街道区域
      $http.get('/usercenter/region/getStreetsByRegionUuid', {
        regionUuid: regionUuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getUserAddress: function (callback) { //取用户地址
      $http.post('/usercenter/customeraddress/toCustomerAddressKuyu', null, function (res) {
        callback && callback(res);
      });
    },
    addAddress: function (params, callback) { //用户新增地址
      // {"consignee":"%E5%8A%9F%E5%A4%AB%E5%A4%A7%E5%B8%88",
      // "province":"03","city":"120","region":"1153",
      // "street":"12499","address":"%E7%89%B9%E8%AE%A4%E4%B8%BA",
      // "zipcode":"%E4%BB%96%E6%83%B9%E6%88%91","mobile":"13512002563",
      // "telephone":"","addresstitle":"","area":"福建省宁德市古田县县城内"}
      $http.post('/usercenter/customeraddress/addAddress', params, function (res) {
        callback && callback(res);
      });
    },
    editAddress: function (uuid, callback) { //用户编辑地址
      $http.post('/usercenter/customeraddress/getAddressByuuid', {
        uuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    updateAddress: function (params, callback) { //用户更新地址
      // {"consignee":"%E5%8A%9F%E5%A4%AB%E5%A4%A7%E5%B8%88",
      // "province":"03","city":"120","region":"1153",
      // "street":"12499","address":"%E7%89%B9%E8%AE%A4%E4%B8%BA",
      // "zipcode":"%E4%BB%96%E6%83%B9%E6%88%91","mobile":"13512002563",
      // "telephone":"","addresstitle":"","area":"福建省宁德市古田县县城内"}
      $http.post('/usercenter/customeraddress/doEdit', params, function (res) {
        callback && callback(res);
      });
    },
    deleteAddress: function (uuid, callback) { //用户删除地址
      $http.post('/usercenter/customeraddress/delDeliveryAddress', {
        uuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    }

  },
  Account = {
    login: function (params, callback) { //登陆
      $http.postString('/login/login', params, function (res) {
        callback && callback(res);
      });
    },
    register: function (params, callback) { //注册
      $http.get('/tclcustomerregist/cloudRegisterByWap', params, function (res) {
        callback && callback(res);
      });
    },
    logout: function () { //退出
      $http.get('/tclcustomer/logout', null, function (res) {
        if (res.code == '0') {
          util.delCookie('wap_staff_token');
          util.delCookie('user');
          util.delCookie('orderPay');
          alert('您已经安全退出！');
          setTimeout(function () {
            window.location.href = '/'; //'/user/login.html';
          }, 1500);
        } else {
          util.delCookie('wap_staff_token');
          util.delCookie('user');
          util.delCookie('orderPay');
          window.location.href = '/'; ///user/login.html';

        };
      });

    },
    checkLogin: function () { //检测登陆
      if (util.getCookie('wap_staff_token') == null) {
        Account.toLogin()
        // window.location.href = '/user/login.html?backurl=' + encodeURIComponent(window.location.href);
      }
    },
    toLogin: function () { //跳转登陆
      util.delCookie('wap_staff_token');
      /* deprecated [
      if (util.iswx()) {
          var type = 10;
          var backurl = util.parseQuery('backurl') || window.location.href
          var local = window.location,
              hostname = local.protocol + '//' + local.hostname + (local.port == '80' || local.port == '' ? '' : ':' + local.port);
          var data = util.urlTojson(backurl)
          data['loginType'] = type;
          // var to = JSON.stringify(data),
          util.setCookie('otherLogindata', JSON.stringify(data));
          var url = encodeURIComponent(hostname + '/user/loginToBind.html');
          var domain = (document.domain == "m.tcl.com") ? "https://login.tclclouds.com" : "https://logintest.tclclouds.com";
          window.location.href = domain + '/user/thirdParty/login?from=' + url + '&source=1&type=' + type + '&appId=14046695';
      } else {
          window.location.href = '/user/login.html?backurl=' + encodeURIComponent(window.location.href);
      }
      ] */
      // 跳转老版本登录
      window.location.href = '/user/login.html?backurl=' + encodeURIComponent(window.location.href);
      // 跳转新版统一用户中心
      // var domain = (document.domain == "m.tcl.com") ? "//m.user.tcl.com" : "//m.testuser.tclo2o.cn";
      // window.location.href = domain + '/proxy/login?from=' + encodeURIComponent(window.location.href);
    },
    getCaptcha: function (callback) { //获取图片验证码
      $http.get('/tclcustomerregist/getcaptcha', null, function (res) {
        callback && callback(res);
      });
    },
    sendValidate: function (params, callback) { //获取短信验证码
      // username:chuchur@qq.com
      // type:2
      // img-key:da0ac861-18b2-191b-c305-f913a6a02424
      // username:13421366165
      // type:3
      // img-key:da0ac861-18b2-191b-c305-f913a6a02424
      $http.post('/tclcustomerregist/sendMessagetoPhoneOrEmail', params, function (res) {
        callback && callback(res);
      });
    },
    registerAndBind: function (params, callback) { //注册并绑定账号
      //        type	2
      // platformId	2
      // thirdPartyId	44E7D1610E10331858514FC0B4A8D88C
      // thirdPartyNickname	武
      // token	1e7a77c7a7d827b77e3343752847e5a8
      // phone	chuchur@qq.com
      // password	qiuzhiwu55
      $http.post('/tclcustomer/toBindRegist', params, function (res) {
        callback && callback(res);
      });
    },
    BindUserName: function (params, callback) { //直接绑定账号，账号已经存在
      // platformId	2
      // thirdPartyId	44E7D1610E10331858514FC0B4A8D88C
      // token	1e7a77c7a7d827b77e3343752847e5a8
      // phone	chuchur@qq.com
      // password	123456
      $http.post('/tclcustomer/toBind', params, function (res) {
        callback && callback(res);
      });
    },
    checkUserName: function (uid, callback) { //检测用户是否可用
      // username:13421366165
      $http.post('/tclcustomerregist/checkusername', {
        'username': uid
      }, function (res) {
        callback && callback(res);
      });
    },
    loginBind: function (params, callback) { //尝试使用第三方账号直接登陆
      $http.post('/login/loginBind', params, function (res) {
        callback && callback(res);
      });
    },
    sendCloudValidcode: function (params, callback) { //绑定邮箱手机发送验证码
      $http.post('/usercenter/tclcustomer/sendCloudValidcode', params, function (res) {
        callback && callback(res);
      });
    },
    tossoBindMobileOrEmail: function (params, callback) { //绑定新邮箱手机发送验证码
      $http.post('/usercenter/tclcustomer/tossoBindMobileOrEmail', params, function (res) {
        callback && callback(res);
      });
    },
    getThirdLoginUrl: function (type, callback) {
      $http.get('/tclcustomer/toThirdLogin', {
        type: type
      }, function (res) {
        callback && callback(res);
      });
    }
  },
  Home = {
    getIndexAds: function (callback) { //取首页广告
      $http.get('/getIndexAds/wap', null, function (res) {
        callback && callback(res);
      });
    },
    getCollection: function (params, callback) { //我的收藏
      $http.post('/usercenter/productfavorite/toProductFavoriteKuyu?', params, function (res) {
        callback && callback(res);
      });
    },
    getCouponList: function (params, callback) { //我的优惠券
      $http.post('/usercenter/coupondetails/searchCouponDetailsKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    getReservation: function (params, callback) { //我的预约
      $http.post('/usercenter/reserveorder/listKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    getReview: function (params, callback) { //用户评论
      $http.post('/usercenter/productappraise/list?', params, function (res) {
        callback && callback(res);
      });
    },
    getIntegralNum: function (params, callback) { //我的积分等级和总积分
      $http.post('/usercenter/tclcustomer/getIntegralFromMassMember', params, function (res) {
        callback && callback(res);
      });
    },
    getIntegralList: function (params, callback) { //积分来源列表
      $http.post("/usercenter/tclcustomer/queryIntegralDetailListKuyu/" + params.nowPage + "/" + params.pageShow, params, function (res) {
        callback && callback(res);
      });
    },
    addReview: function (params, callback) { //提交追平
      $http.post('/usercenter/productappraise/saveAfterAppraiseKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    seeOrderComment: function (params, callback) { //追加评论详情
      $http.get('/usercenter/productappraise/seeOrderComment', params, function (res) {

        callback && callback(res);
      });
    }

  },
  News = {
    list: function (params, callback) {
      $http.get('/group/news/newsList', params, function (res) {
        callback && callback(res);
      })
    }
  },
  bulkPurchase = {
    save: function (params, callback) {
      $http.post('/bulkpurchase/savemsg', params, function (res) {
        callback && callback(res);
      });
    }
  },
  Order = {
    getBalance: function (callback) { // 确认订单 信息
      $http.post('/order/toBalanceKuyu', {
        terminalType: '02'
      }, function (res) {

        callback && callback(res);
      });
    },
    save: function (params, callback) { //保存订单信息
      //eg:电子发票
      // totalMoneyShow	1299
      // storeReduce_03d03b6b05604c5cb065aef65b72972e	0.00
      // productPrice_TP001020102020100022	1299.00
      // productNowPrice_TP001020102020100022	1299
      // productBasePrice_TP001020102020100022	1299
      // jifenPromotionUUID	egralToNow0000000041
      // invoiceCate	2
      // integralReduceNum
      // electron_titleContent	热武器1
      // electron_invoiceContent	商品明细
      // checkArea	1937b99455dd471195f1e09b33b3afea
      // cartTotal_03d03b6b05604c5cb065aef65b72972e	1299.00
      // area	1937b99455dd471195f1e09b33b3afea
      // affix_03d03b6b05604c5cb065aef65b72972e	0
      //增值税发票
      // totalMoneyShow	3198
      // storeReduce_03d03b6b05604c5cb065aef65b72972e	0.00
      // productPrice_TZ110105000153	3198.00
      // productNowPrice_TZ110105000153	1599
      // productBasePrice_TZ110105000153	1599
      // jifenPromotionUUID	egralToNow0000000041
      // invoiceCate	3
      // integralReduceNum
      // checkArea	1937b99455dd471195f1e09b33b3afea
      // cartTotal_03d03b6b05604c5cb065aef65b72972e	3198.00
      // area	1937b99455dd471195f1e09b33b3afea
      // affix_03d03b6b05604c5cb065aef65b72972e	0
      // add_uuid	01b178ecd13a4984bc56bda744d48a50
      // add_registerMobile	ewq
      // add_companyName	123
      // add_code	ewq
      // add_bankNo	wqe
      // add_address	ewq
      // params['terminalType'] = '02';
      $http.get('/cart/saveOrderKuyu', params, function (res) {

        callback && callback(res);
      });
    },
    getPay: function (params, callback) {
      // payOrderUuid: payOrderId,
      // payOrderType: isGroup
      $http.get('/orderpay/toOrderPayKuyu', params, function (res) {

        callback && callback(res);
      });
    },
    // toPayOld: function (params, callback) { //跳转支付
    //     // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
    //     $http.post('/pay/submitOrderByWap', params, function (res) {

    //         callback && callback(res);
    //     });
    // },
    toPayOld: function (params, callback) { //跳转支付  2016.12.20
      // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
      $http.post('/wapPay/submitOrder', params, function (res) {

        callback && callback(res);
      });
    },
    toPayNew: function (params, callback) { //跳转支付  2017.3.10
      // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
      $http.post('/heepay/submitOrder', params, function (res) {

        callback && callback(res);
      });
    },
    // toPay: function (params, callback) { //模拟支付
    //     // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
    //     $http.post('/pay/submitorderKuyu', params, function (res) {

    //         callback && callback(res);
    //     });
    // },
    toPayTest: function (params, callback) { //模拟支付
      // orderId=GROUP0000000000162&payType=ALIPAY&ranNum=0.5598896070770238
      $http.post('/pay/submitorderKuyuTest', params, function (res) {

        callback && callback(res);
      });
    },
    saveSecKill: function (params, callback) { //保存秒杀订单
      // productBuyNum:1
      // promotionUuid:9540308680b34bd2abc7fde19c2e5d9a
      // productSku:TP001030102030200168
      // totalMoneyShow:4000.00
      // productNowPrice_TP001030102030200168:4000.00
      // affix_03d03b6b05604c5cb065aef65b72972e:0
      // hipType_03d03b6b05604c5cb065aef65b72972e:1
      // cartTotal_03d03b6b05604c5cb065aef65b72972e:4000.00
      // storeReduce_03d03b6b05604c5cb065aef65b72972e:0
      // productPrice_TP001030102030200168:4000
      // productBasePrice_TP001030102030200168:4099
      // electron_titleContent:热武器1
      // electron_invoiceContent:商品明细
      // invoiceCate:2
      // checkArea:1937b99455dd471195f1e09b33b3afea
      $http.post('/cart/saveLimitOrder', params, function (res) {

        callback && callback(res);
      });
    },
    savePresale: function (params, callback) { //保存预付定金订单
      // productUuid	9500ccd7bce7483585c53f3db92bf8ab
      // checkArea	dacce5ef66d84d2a9127331a4dadb2e3
      // area	dacce5ef66d84d2a9127331a4dadb2e3
      // buyNum	1
      // productBuyNum	1
      // invoiceCate	2
      // jifenPromotionUUID
      // integralReduceNum	0
      // totalMoneyShow	1499
      // attrIds	TP001050103020100003
      // willType	2
      // pIds	9500ccd7bce7483585c53f3db92bf8ab
      // affix_03d03b6b05604c5cb065aef65b72972e	0
      // storeReduce_03d03b6b05604c5cb065aef65b72972e	0
      // storePromotion_03d03b6b05604c5cb065aef65b72972e	8158f274c12a44018b420b2fa8633ad0
      // electron_titleContent	你好哈哈
      // electron_invoiceContent	商品明细
      $http.get('/front/product/presaleSaveOrder', params, function (res) {
        callback && callback(res);
      });
    },
    detail: function (uuid, callback) { //订单详情
      $http.post('/usercenter/order/ajaxviewKuyu', {
        uuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getCountByState: function (orderState, callback) { //获取订单数量
      //1:待付款 4：代发货 6待收货 7 已完成 11待评价
      $http.post('/usercenter/order/query/orderCountKuyu', {
        orderState: orderState
      }, function (res) {
        callback && callback(res);
      });
    },
    getCount: function (callback) { //获取订单数量
      $http.post('/usercenter/order/query/queryAllStatusOrderCountKuyu', null, function (res) {
        callback && callback(res);
      });
    },
    saveReserve: function (params, callback) { //提交商品预约信息
      // skuNo	P001010101010100121
      // productId	e07d222b1ab941aab7c7a37f5da7254f
      // buyNum	1
      // area	dacce5ef66d84d2a9127331a4dadb2e3
      // storeNote	nSubscribe0000000302
      // submodelUuid	nSubscribe0000000302
      // rushBuyBeginTime	2016-12-23 17:22:21
      // checkArea	dacce5ef66d84d2a9127331a4dadb2e3
      $http.post('/reserve/createReserveOrderKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    saveReservation: function (params, callback) { //提交预约后抢购订单信息
      params['terminalType'] = '02';
      $http.post('/usercenter/reserveorder/saveReserOrderKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    list: function (params, callback) { //订单列表
      $http.post('/usercenter/order/listKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    reveiveGoods: function (uuid, callback) { //确认收货
      $http.post('/usercenter/order/reveiveKuyu', {
        orderUuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getExpressTrace: function (uuid, callback) { ///物流信息
      $http.post('/usercenter/order/getExpressTrace', {
        orderuuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getComment: function (uuid, callback) { ///物流信息
      $http.post('/usercenter/productappraise/seeOrderComment', {
        orderUuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getPerOrder: function (params, callback) { //取预约信息，准备提交预约
      // productUuid:514b023d7a6d4782bb28b7186d0b622b
      // reserveOrderId:673c52a8b5eb454191aebbad96b2741e
      // skuNo:P001010101010100079
      params['terminalType'] = '02'
      $http.post('/usercenter/reserveorder/perserveBuyKuyu', params, function (res) {
        callback && callback(res);
      });
    },
    saveComment: function (params, callback) { //提交评论
      $http.post('/usercenter/productappraise/saveAppraiseKuyu', params, function (res) {
        callback && callback(res);
      });
    }
  },
  Invoice = {
    getEleInvoice: function (callback) { //取用户的增值税发票
      $http.post('/usercenter/ElectronInvoice/getByCustomerUuid', null, function (res) {
        callback && callback(res);
      });
    },
    updateEleInvoice: function (callback) { //更新
      $http.post('/usercenter/ElectronInvoice/update', null, function (res) {
        callback && callback(res);
      });
    },
    createEleInvoice: function (callback) { //新增
      $http.post('/usercenter/ElectronInvoice/createAddInvoiceSetting', null, function (res) {
        callback && callback(res);
      });
    },
    deleteEleInvoice: function (uuid, callback) { //删
      $http.post('/usercenter/ElectronInvoice/deleteByUuid', {
        uuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },
    getVATInvoice: function (callback) { //取用户的增值税发票
      $http.post('/usercenter/addInvoice/getByCustomerUuid', null, function (res) {
        callback && callback(res);
      });
    },
    updateVATInvoice: function (params, callback) { //更新
      $http.post('/usercenter/addInvoice/update', params, function (res) {
        callback && callback(res);
      });
    },
    createVATInvoice: function (params, callback) { //新增
      $http.post('/usercenter/addInvoice/createAddInvoiceSetting', params, function (res) {
        callback && callback(res);
      });
    },
    deleteVATInvoice: function (uuid, callback) { //删
      $http.post('/usercenter/addInvoice/deleteByUuid', {
        uuid: uuid
      }, function (res) {
        callback && callback(res);
      });
    },

  },
  User = {
    getInfo: function (params, callback) { //取用户信息
      $http.get('/tclcustomer/userInfo', params, function (res) {
        callback && callback(res);
      });
    }
  },
  Coupons = {
    check: function (params, callback) { //检测是否可用
      // {"couponNo":"234313214",
      // "orderMoney":"8250.00",
      // "products":[{"storeUuid":"03d03b6b05604c5cb065aef65b72972e",
      // "productUuid":"e70bc3a70eb64986aa6c0ba3fbd78ff9",
      // "productCost":1599}]}
      $http.postString('/cart/exchangeCoupons', params, function (res) {
        callback && callback(res);
      });
    },
    count: function (params, callback) {
      $http.get('/front/product/getAppraiseCount', params, function (res) {
        callback && callback(res);
      });

    }
  };

//Account.login();
// Goods.getPrice();
