<template>
  <div class="paySuccess">
    <yd-navbar title="订单支付">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="showTitle">
      <div class="s1">支付失败</div>
      <div class="s2">请尽快完成支付</div>
    </div>
    <div class="sec"> 订单详情 </div>
    <div class="order_info">
      <p>收货人：
        <span>{{temp.name}} {{temp.mobile}}</span>
      </p>
      <p class="add">收货地址：
        <span>{{temp.address}}</span>
      </p>
    </div>
    <div class="order_info">
      <p class="num">订单编号：
        <span>{{temp.payOrderUuid}}</span>
      </p>
      <p class="price">支付金额：
        <span>￥{{temp.orderMoney}}</span>
      </p>
    </div>
    <div class="btnF">
      <span @click="payAgain">重新支付</span>
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
      isTestPay: false,  //是否模拟支付
      temp: {},
    }
  },
  mounted() {
    this.isTestPay = this.$route.query.from == 'testPay' ? true : false
    this.Otype = this.$route.query.ordertype
    this.getData()
  },
  methods: {
    getData() {
      if (this.$utils.getCookie('orderPay')) {
        this.temp = JSON.parse(this.$utils.getCookie('orderPay'))
      } else {
        this.$dialog.alert({ mes: '数据丢失' })
      }
    },
    payAgain() {
      this.$router.push({ path: '/order/pay', query: { 'orderId': this.temp.payOrderUuid, 'type': this.temp.payOrderType } })
    },
  }
}
</script>

