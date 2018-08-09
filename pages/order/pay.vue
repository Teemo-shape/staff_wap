<template>
  <div class="paySuccess">
    <yd-navbar title="支付订单">
      <span @click="$router.back()" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </span>
    </yd-navbar>
    <!--<div class="showTitle">-->
      <!--<div class="wait">{{orderStatusName}}</div>-->
    <!--</div>-->
    <div class="payMoney">
      <p>应付金额:&nbsp&nbsp<span>&yen;{{orderMoney}}</span></p>
    </div>
    <div class="payChoose">
      <div class="sec">
        选择在线支付
      </div>
      <a>
        <ul class="wx_pay" @click="changeWxActive">
          <li class="fl">
            <span class="iky-weixin-pay"></span>
          </li>
          <li class="fl">
            <span>微信支付</span>
          </li>
          <li class="fr">
            <span :class="{'iky-checked':isWxActive,'iky-uncheck':!isWxActive}"></span>
          </li>
        </ul>
      </a>
      <a>
        <ul class="alipay" v-show="!$utils.iswx()" @click="changeAlipayActive">
          <li class="fl">
            <span class="iky-alipay"></span>
          </li>
          <li class="fl">
            <span>支付宝支付</span>
          </li>
          <li class="fr">
            <span :class="{'iky-checked':isAlipayActive,'iky-uncheck':!isAlipayActive}"></span>
          </li>
        </ul>
      </a>

    </div>
    <!--模拟支付-->
     <div id="testPay">
            <button @click="testPay">{{testPayText}}</button>
          </div>

    <form id="topay" name="topay" method="post" action="" accept-charset="utf-8">
    </form>

    <div class="foot">
      <div class="btndanger" @click="goPay">{{goPayText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'T严选商城-订单支付',
    }
  },
  data() {
    return {
      isWxActive: true,
      isAlipayActive: false,
      payOrderUuid: '',
      payOrderType: '',
      Otype: 0,  //订单确认页面传过来的，目前不知

      orderStatusName: '等待买家付款',
      orderId: '',
      orderMoney: '',
      payType: 'WXPAY', //ALIPAY
      allBuyNum: '',  //总件数

      orderUuid: '', // order下面的uuid

      testPayText: '模拟支付',
      goPayText: '确定'
    }
  },
  mounted() {
    this.payOrderUuid = this.$route.query.orderId
    this.payOrderType = this.$route.query.type

    this.Otype = this.$route.query.ordertype || 3

    //检测代码
    if (typeof (_smq) == 'object') { _smq.push(['custom', 'wap', 'order', this.payOrderUuid]); }
    //检测代码
    this._gsCallback()

    this.getData()
  },
  methods: {
    //检测代码
    _gsCallback() {
      if (window._gsTracker) {

        _gsTracker.addOrder(this.payOrderUuid, null);

        // 当订单包含多种商品时，请相应地多次调用addProduct函数
        // 如不需要跟踪订单内的产品购买信息，则可以不调用addProduct函数
        _gsTracker.addProduct(this.payOrderUuid, null, "产品1SKU", null, null, null);
        // 更多addProduct

        _gsTracker.trackECom();
      }
    },
    getData() {
      if (!this.payOrderUuid || !this.payOrderType) {
        this.$dialog.alert({ mes: '参数丢失，请返回重试！' });
        return false;
      }
      // this.$utils.delCookie('chooseAddress')
      // this.$utils.delCookie('chooseCoupon')
      this.$utils.delCookie('queryParams')
      this.$http.get('/orderpay/toOrderPayKuyu', { payOrderUuid: this.payOrderUuid, payOrderType: this.payOrderType }, res => {
        if (res.code === '0') {
          var o = res.retData.order;
          var m = res.retData.orderMainAddressModel
          this.orderStatusName = o.orderStatusName  //订单状态名
          this.orderId = res.retData.orderId //

          this.orderMoney = parseFloat(res.retData.orderMoney).toFixed(2)  //订单金额

          // o.detailList.map(m => { //拿数量，没有明确数量
          //   this.allBuyNum += m.buyNum
          // })
          this.allBuyNum = res.retData.orderList.length;

          //保存订单结果页面用到的数据
          var order = {}
          order.name = m.name
          order.address = m.address
          order.mobile = m.mobile
          order.payOrderUuid = this.payOrderUuid
          order.orderId = o.orderId
          order.orderMoney = res.retData.orderMoney
          order.uuid = o.uuid
          //支付失败数据加一个
          order.payOrderType = this.payOrderType

          this.$utils.setCookie('orderPay', JSON.stringify(order))

          if (window._gsq) {
            _gsq.push(["T", "GWD-002944-46616A", "addOrder", this.payOrderUuid, order.orderMoney]);
            _gsq.push(["T", "GWD-002944-46616A", "addProduct", this.payOrderUuid, null, null, null]);
            _gsq.push(["T", "GWD-002944-46616A", "trackECom"]);
          }

          //小能客服
          window.XNupdate({
            orderid: this.orderId,
            orderprice: this.orderMoney
          })

        } else {
          if (res.code == '1' && res.retData && res.retData.order) {
            this.orderUuid = res.retData.order.uuid
            this.$http.post('/usercenter/order/ajaxviewKuyu', { uuid: this.orderUuid }, res => {
              var m = res.data.m;
              var n = res.data.omam;
              this.orderMoney = (m.payMoney - 0).toFixed(2);
              this.orderStatusName = m.orderStatusName  //订单状态名

              this.testPayText = '查看详情'
              this.goPayText = '查看详情'
              res.data.detailList.map(m => { //拿数量，没有明确数量
                this.allBuyNum += m.buyNum
              })
            })
          } else {
            this.$dialog.alert({ mes: '无此订单信息，请检查再试！' })
          }
        }

      })


    },
    //模拟支付
     testPay() {
      if (this.orderUuid) {
        this.$router.push({ 'path': '/my/orderDetail', query: { uuid: this.orderUuid } })
        return;
      }

      let param = {
        orderId: this.orderId,
        payType: 'ALIPAY',
        ranNum: Math.random(),
      }

      this.$http.post('/pay/submitorderKuyuTest', param, res => {
        if (res.code === 0) {
          this.$router.push({ path: '/order/paySuccess', query: { 'ordertype': this.Otype } })
        } else {
          this.$router.push({ path: '/order/payError', query: { 'ordertype': this.Otype } })
        }

      })
    },
    //真实支付
    goPay() {
      //检测代码
      if (typeof (_smq) == 'object') { _smq.push(['custom', 'wap', 'pay']); }

      if (this.orderUuid) {
        this.$router.push({ 'path': '/my/orderDetail', query: { uuid: this.orderUuid } })
        return;
        // this.$router.push({ 'path': '/my/orderDetail?uuid='+this.orderUuid })
        /* if (this.Otype == 1) {
          window.location.href = '/my/paydep.html?uuid=' + this.orderUuid + '&type=1'
        } else { */
        // window.location.href = '/my/orderDetail?uuid=' + this.orderUuid
        // }
      }

      var local = window.location,        hostname = local.protocol + '//' + local.hostname + (local.port == '80' || local.port == '' ? '' : ':' + local.port);

      if (this.isAlipayActive) {
          this.payType = 'ALIPAY'
      }
      let param = {
        orderId: this.orderId,
        payType: this.payType,
        payChannel: this.payType,
        ranNum: Math.random(),
        successUrl: hostname + '/order/paySuccess?ordertype=' + this.Otype,
        failUrl: hostname + '/order/payError',
        isWeixin: this.$utils.iswx() ? 1 : 0//true在微信浏览器，false就不在
      }

        console.log(this.$utils.iswx()+"判断是否在微信");
        if(this.isWxActive){//选择微信
          console.log("选择微信")
        }else if(this.isAlipayActive){//选择支付宝
          console.log("选择支付宝");
        }

      if (this.isAlipayActive) {
          //支付宝调用 start
          this.$http.post('/heepay/submitOrder', param, res => {
          if (res.data) {
            var form = document.getElementById('topay')
            form.innerHTML = ''
            form.setAttribute('action', res.data.payUrl)
            for (var k in res.data) {
             if (k != 'payUrl') {
                var input = document.createElement('input')
                input.type = 'hidden'
                input.name = k
                input.value = res.data[k]
                form.appendChild(input)
             }
            }
            var input = document.createElement('input')
            input.type = 'hidden'
            input.name = "buyer_id"
            input.value = ''
            form.appendChild(input)
            form.submit()
           } else {
             this.$dialog.alert({ mes: res.msg || '该订单无法支付,请联系客服' })
            }
          })
          //支付宝调用 end
      } else {
          //微信调用 start
          this.$http.post('/tcl_pay/submitOrder', param, res => {
            if (res.data && res.data.code == '200') {//http状态 200
              document.location.href = '' + res.data.data.jump_url;
            } else {
              this.$dialog.alert({ mes: res.msg || '该订单无法支付,请联系客服' })
            }
          })
          //微信调用end
      }
    },
    changeWxActive() {
      if (this.isAlipayActive) {
        this.isAlipayActive = false
      }
      if (this.isWxActive) {
        return false;
      }
      this.isWxActive = !this.isWxActive;
    },
    changeAlipayActive() {
      if (this.isWxActive) {
        this.isWxActive = false
      }
      if (this.isAlipayActive) {
        return false;
      }
      this.isAlipayActive = !this.isAlipayActive;
    }
  }

}
</script>
