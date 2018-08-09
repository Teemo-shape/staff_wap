<template>
  <div class="tk">
    <yd-navbar title="订单列表">
      <router-link to="/tuike/commission" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <main>
      <div class="good">
        <img :src="info.imageUrl" :alt="info.productName">
        <div class="info">
          <h1>{{info.productName}}</h1>
          <p>零售价
            <span id="price">￥{{info.productPrice}}</span>
          </p>
          <p v-show="info.commissionType == 0"> 固定分佣
            <span>￥{{info.commission}} </span>/件 </p>
          <p v-show="info.commissionType != 0"> 分佣比例
            <span>{{info.commission}} %</span>/单 </p>
        </div>
      </div>
      <div class="tab">
        <span :class="{active:state==1}" @click="state=1;list=paidData">已付佣金</span>
        <span :class="{active:state==0}" @click="state=0;list=unpaidData">未付佣金</span>
      </div>
      <div class="title o-title">
        <span>订单号</span>
        <span>购买人</span>
        <span>数量</span>
        <span>成交时间</span>
      </div>
      <ul class="orderlist">
        <li v-for="(d,index) in list" :key="index">
          <span>{{d.orderId}}</span>
          <span>{{d.buyerCustomerName}}</span>
          <span>{{d.buyNum}}</span>
          <span>{{d.payTime}}</span>
        </li>
        <li v-show="list.length==0">
          <p class="empty">暂无数据...</p>
        </li>
      </ul>
    </main>
    <tkfoot/>
  </div>
</template>
<script>
import tkfoot from '~/components/footer'
export default {
  components: { tkfoot },
  head() {
    return {
      title: 'TCL官网-推客订单列表',
    }
  },
  data() {
    return {
      puuid: '', ctype: '', list: [], state: 1,
      paidData: [], unpaidData: [], info: {}
    }
  },
  mounted() {
    this.ctype = this.$route.query.ctype
    this.puuid = this.$route.query.puuid
    this.getData(1)
    this.getData(0)
  },
  methods: {
    getData(state) {
      this.$http.get('/salesmanorder/orderList', { productUuid: this.puuid, state: state, commissionType: this.ctype }, res => {
        if (res.code == 0) {
          var data = res.retData.records
          if (state == 1) {
            this.paidData = data
            this.list = data
          } else {
            this.unpaidData = data
          };
          if (data.length > 0) {
            this.info = data[0]
          }
        } else {
          this.$dialog.alert({ mes: res.message })
        }
      })
    }
  }
}
</script>