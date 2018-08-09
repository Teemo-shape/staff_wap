<template>
  <div class="paySuccess">
    <yd-navbar title="支付成功">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="showTitle">
      <div class="s1"><i class="icon iconfont-tcl icon-chenggong_qingtishipx"></i>支付成功</div>
      <p class="price">
        <span>￥<strong>{{(temp.orderMoney-0).toFixed(2)}}</strong></span>
      </p>
      <div class="btn_control">
        <a @click="goDetail">查看订单</a>
        <span></span>
        <a @click="$router.push({'path':'/'})">继续逛逛</a>
      </div>
    </div>
    <div class="order_info">
      <p>
        <span>订单编号：</span>{{temp.payOrderUuid}}
      </p>
      <p><span>收货人：</span>
        {{temp.name}}&emsp;{{temp.mobile}}
      </p>
      <p><span>收货地址：</span>
        {{temp.address}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'T严选商城-支付成功',
    }
  },
  data() {
    return { temp: {}, Otype: '', }
  },
  mounted() {
    this.Otype = this.$route.query.ordertype // ordertype==1 表示付定金
    this.getData()
  },
  methods: {
    getData() {
      if (this.$utils.getCookie('orderPay')) {
        this.temp = JSON.parse(this.$utils.getCookie('orderPay'))
      }
    },
    goDetail() {
      this.$router.push({ 'path': '/my/orderDetail', query: { uuid: this.temp.orderId } })
			/* if(this.Otype == 1){
				window.location.href = "/usercenter/paydep.html?uuid="+this.temp.uuid+"&type=1"
			}else{
				window.location.href = "/usercenter/orderdetails.html?uuid="+this.temp.uuid
			} */
    }
  }
}
</script>

</template>
