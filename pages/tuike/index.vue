<template>
  <div class="tk">
    <header class="header">
      <router-link :to="{path:'/'}" class="iky-tcl-logo"></router-link>
      <h1>推客首页</h1>
    </header>
    <main>
      <yd-slider class="hb" autoplay="3000">
        <yd-slider-item>
          <a>
            <img src="/img/tuike/tkbn.jpg" />
          </a>
        </yd-slider-item>
      </yd-slider>
      <div class="box">
        <div class="title">什么是推客？</div>
        <div class="con">
          <p>推客，是TCL官网（www.tcl.com）推出的一种按成交计费的推广模式。</p>
          <p>推客只要从推客推广专区分享商品链接，任何买家（包括您自己）经过您的推广（微信、微博、QQ等）进入TCL官网完成购买后，就可以得到TCL官网支付的佣金。</p>
          <img src="/img/tuike/tk01.png" alt="什么是推客？">
        </div>
      </div>
      <div class="box">
        <div class="title">怎么成为推客？</div>
        <div class="con">
          <ul>
            <li>
              <span>01</span>点击页面底部“戳我报名”，等待后台审核；</li>
            <li>
              <span>02</span>搜索微信号18676888807
              <br/>or
              <br/>扫描下方二维码添加好友
              <br/>
              <img src="/img/tuike/tcl_code.jpg" alt="">
            </li>
            <li>添加备注时请备注：推客报名。添加后可查询审核进度。</li>
          </ul>
        </div>
      </div>
      <div class="box">
        <div class="title">关于佣金？</div>
        <div class="con">
          <p>成为推客后，进入推客推广专区，即可看见商品的推广佣金金额。待买家确认收货后7天，我们按照推客成交订单陆续发放佣金至推客指定的账户。</p>
          <img src="/img/tuike/tk02.png" alt="">
        </div>
      </div>
    </main>
    <div class="btn-box">
      <input type="button" class="signup" v-model="text" v-show="type==1" @click="query(1)">
      <input type="button" class="myfy" value="我的分佣" v-show="type==2" @click="query(2)">
      <input type="button" class="goods" value="商品列表" v-show="type==2" @click="query(3)">
    </div>
    <tkfooter/>
    <div class="pb3"></div>
  </div>
</template>
<script>
import tkfooter from '~/components/footer'
export default {
  components: { tkfooter },
  head() {
    return {
      title: 'TCL官网-推客',
    }
  },
  data() {
    return {
      type: 0, text: '', canSale: false, //是否可以报名
      customerId: '', login: true
    }
  },
  mounted() {
    this.getData()
    if (!this.$utils.getCookie('wap_staff_token')) {
      this.text = '请登录'
      this.type = 1
      this.login = false
      // return false
    }

  },
  methods: {
    getData() {
      this.$http.get('/sysback/salesman/query', { auth: 1 }, res => {
        let code = res.code;
        if (code == 403) {
          this.text = '请登录'; this.type = 1; this.login = false
        } else if (code == 1) {
          this.canSale = true;
          this.text = '戳我报名'; this.type = 1;
        } else if (code == 0) {
          if (res.retData.state == 0) {
            this.type = 1; this.canSale = false;
            this.text = '等待审核'
          } else if (res.retData.state == 1) {
            //审核成功
            this.type = 2
            this.customerId = res.retData.customerId
          } else if (res.retData.state == 3) {
            this.type = 0
            this.$dialog.alert({ mes: '您的帐号存在疑问，暂时被冻结' })
          } else if (res.retData.state == 2) {
            this.type = 1
            this.text = '审核未通过'
          }
        }
      })
    },
    query(t) {
      if (t == 1) {
        this.canSale && this.salesman();
        var obj = this.$http.isUniFunc();
        !this.login && obj.isUni && (window.location.href = obj.host + `/proxy/login?from= `+ encodeURIComponent(window.location.href))
        !this.login && !obj.isUni && (window.location.href = `/user/login.html?backurl=${encodeURIComponent(window.location.href)}`)
      } else if (t == 2) {
        this.$router.push({ path: '/tuike/commission' })
      } else if (t == 3) {
        this.$router.push({ path: '/tuike/goods', query: { cid: this.customerId } })
      }
    },
    salesman() { // 报名
      this.$http.get('/sysback/salesman/add', {}, r => {
        if (r.code == 0) {
          this.$dialog.alert({ mes: '报名成功，等待审核' })
          this.text = '等待审核'
        } else {
          this.$dialog.alert({ mes: r.message })
        }
      })
    },
  }
}
</script>
