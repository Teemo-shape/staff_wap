<template>
  <div class="coupon">
    <div style="padding-bottom:5rem;">
      <yd-navbar title="优惠券">
        <span @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </span>
      </yd-navbar>
      <div class="yd-tab">
        <ul class="yd-tab-nav">
          <li @click="chooseUse" :class="{'yd-tab-nav-item':true, 'yd-tab-active':isUse}">
            <a href="javascript:;">可用优惠券({{canUseNum}})</a>
          </li>
          <li @click="chooseNoUse" :class="{'yd-tab-nav-item':true, 'yd-tab-active':!isUse}">
            <a href="javascript:;">不可用优惠券({{noUseNum}})</a>
          </li>
        </ul>
        <div class="tab-panel">
          <div :class="{'tab-panel-item':true, 'yd-tab-active':isUse}" v-show="isUse===true">
            <ul class="couponList valid">
              <li v-for="(item,index) in canUse" :key="index">
                <div class="num">￥
                  <strong>{{item.money}}</strong>
                  <br>满{{item.minConsumeMoney}}元可用
                </div>
                <div class="info">
                  <i>优惠券</i>{{item.couponTypeName}}
                  <span class="useNow" @click="setLocCoupon(index)">立即使用&gt;&gt;</span>
                  <span>{{item.endTime}}</span>
                </div>
              </li>
            </ul>
            <div class="empty" v-if="canUse.length=='0'">
              <img src="/img/emptyCart.png">
              <p>哎呀！无优惠券可用哦~</p>
            </div>
          </div>
          <!--不可用优惠券-->
          <div :class="{'tab-panel-item':true, 'yd-tab-active':!isUse}" v-show="isUse===false">
            <ul class="couponList">
              <li v-for="(item,index) in noUse" :key="index">
                <div class="num">￥
                  <strong>{{item.money}}</strong>
                  <br>满{{item.minConsumeMoney}}元可用
                </div>
                <div class="info">
                  <i>优惠券</i>{{item.couponTypeName}}
                  <span>{{item.endTime}}</span>
                </div>
              </li>
            </ul>
            <!--<div class="empty" v-if="noUse.length=='0'">
                    <img :src="img">
                    <p>哎呀！无优惠券可用哦~</p>
                  </div>-->
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>
<script>
export default {
  head() {
		return {
			title: 'TCL官网-优惠券',
		}
	},
  data() {
    return {
      // img: require('@/static/img/emptyCart.png'),
      terminalType: '02',
      canUse: [],
      noUse: [],
      canUseNum: 0,
      noUseNum: 0,
      coupon: [],
      isUse: true,

      from: '',
    }
  },
  mounted() {
    this.from = this.$route.query.from
    this.getData()
  },
  methods: {
    getData() {
      this.$http.get('/order/toBalanceKuyu', {
        terminalType: this.terminalType
      }, res => {
        var couponList = res.cartManager && res.cartManager.couponList || ''
        var unCouponList = res.cartManager && res.cartManager.unCouponList || ''
        // couponList && couponList.map(o => {
        //   if (o.state === '1') {
        //     this.canUse.push(o)
        //   } else {
        //     this.noUse.push(o)
        //   }
        // })
        this.canUse = couponList
        this.noUse = unCouponList
        this.canUseNum = this.canUse.length
        this.noUseNum = this.noUse.length
      })
    },
    chooseUse() {
      if (!this.isUse) {
        this.isUse = !this.isUse
      }
    },
    chooseNoUse() {
      if (this.isUse) {
        this.isUse = !this.isUse
      }
    },
    setLocCoupon(i) {
      this.$utils.setCookie('chooseCoupon', JSON.stringify(this.canUse[i]))
      this.$router.go(-1)
    },
  }
}
</script>
