<template>
  <div class="logistics">
    <yd-navbar title="物流跟踪">
      <a @click="$router.go(-1)" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
    </yd-navbar>

    <div class="delivery"">
      <p v-for="(item,index) in data.goods" :key="index">商品名称：
        <a :href="'/other/'+item.productUuid">{{item.productName}}</a>
      </p>
      <p>物流公司：{{delivery.logisCompany}}</p>
      <p>运单编号：{{delivery.logicNo}}</p>
      <!--<div class="right cr">{{data.orderStatusName}}</div>-->
    </div>
    <!--<div class="delivery">-->
      <!--<p>物流公司：{{delivery.logisCompany}}</p>-->
      <!--<p>物流单号：{{delivery.logicNo }}</p>-->
      <!--<p>收货地址：{{delivery.address }}</p>-->
      <!--<p>收货人名：{{delivery.name }}</p>-->
    <!--</div>-->
    <div class="delivery-list">
      <ul>
        <li v-for="(item,index) in logistics" :key="index">
          <img src="/img/wlDot.png" alt="" class="icon" v-if="index==0">
          <span class="icon" v-else></span>
          <div>
            <span class="text">{{item.text}} {{item.trackingNo?'('+item.trackingNo+')':''}}</span>
            <span class="time">{{item.time}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: 'T严选商城-物流信息',
    }
  },
  data() {
    return {
      data: {},
      uuid: '',
      delivery: {},
      logistics: []
    }
  },
  mounted() {
    this.uuid = this.$route.query.uuid
    this.getData()
  },
  methods: {
    getData() {
      this.$http.post('/usercenter/order/ajaxviewKuyu', { uuid: this.uuid }, res => {
        let data = {}
        let m = res.data.m
        data.uuid = m.uuid
        data.orderId = m.orderId
        data.orderStatusName = m.orderStatusName
        data.state = m.state
        //goods
        var goods = []
        m.detailList.map((y) => {
          goods.push({
            productName: y.productName,
            buyNum: y.buyNum,
            price: y.basePrice,
            imageUrl: y.specUuid,
            productUuid: y.productUuid,
          })
        })
        data.goods = goods
        // invoice & address
        if (res.data.omam) {
          let address = res.data.omam
          data.address = address.address || {}
          data.name = address.name
          data.mobile = address.mobile
        }


        this.data = data
        this.logistics.unshift({ time: m.orderTime, text: '下单成功' })
        if ((m.state >= 4) && m.payTime != null) {
          this.logistics.unshift({ time: m.payTime, text: '支付成功' })
        }
        if ((m.state == '6' || m.state == '7') && m.outWareTime) {
          this.logistics.unshift({ time: m.outWareTime, text: '商家正通知快递公司揽件' })
        }

        if (res.data.deliveryOrder) {
          this.delivery.logisCompany = res.data.deliveryOrder.logisCompany
          this.delivery.logicNo = res.data.deliveryOrder.logicNo
          this.delivery.address = res.data.deliveryOrder.receiveAddress
          this.delivery.name = res.data.deliveryOrder.receiveMan
          this.delivery.deliveryUuid = res.data.deliveryOrder.deliveryUuid

          this.getLogistics(res.data.deliveryOrder.orderUuid)
        }
      })
    },
    getLogistics(uuid) {
      this.$http.post('/usercenter/order/getExpressTrace', { orderuuid: uuid }, res => {
        res.map((x) => {
          this.logistics.unshift({ time: x.acceptTime, text: x.statusDes, trackingNo:x.trackingNo})
        })
      })
    },
  }
}
</script>
