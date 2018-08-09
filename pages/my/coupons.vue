<template>
  <div class="myCoupon">
    <yd-navbar title="我的优惠券">
      <a @click="goBack()" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
    </yd-navbar>
    <div class="yd-tab">
      <ul class="yd-tab-nav">
        <li :class="item.active?'yd-tab-nav-item yd-tab-active':'yd-tab-nav-item'" v-for="(item,i) in tabList" :key="i" @click="change(item)">
          <a href="javascript:;">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="detail_coupon">
      <ul>
        <li class="coupons" v-for="(item,i) in couponList" :key="i">
          <div :class="{'coupon_left':true, 'color_1':state=='1','color_2':state=='2','color_3':state=='3'}">
            {{item.money}}元
          </div>
          <div class="coupon_center">
            <p class="p1">消费{{item.minConsumeMoney}}元可以使用</p>
            <p class="p2">{{item.beginTime.split(' ')[0]}}至{{item.endTime.split(' ')[0]}}</p>
          </div>
          <div :class="{'coupon_right':true, 'color_1':state=='1','color_2':state=='2','color_3':state=='3'}">
            {{state=='1'?'可使用':(state=='2'?'已使用':'已过期')}}
          </div>
        </li>
      </ul>
      <div class="conpon-ts">此券为商业扣券，一经使用，不可找零或退换</div>
    </div>
  </div>
</template>

<script>
let load = null;
export default {
  head() {
		return {
			title: 'TCL官网-我的优惠券',
		}
	},
  data() {
    return {
      tabList: [{ name: '可使用', state: '1', active: true }, { name: '已使用', state: '2', active: false }, { name: '已过期', state: '3', active: false },],
      nowPage: 1, pageShow: 5, pageCount: 0, state: 1, loadEnd: true, couponList: [],
    }
  },
  mounted() {
    this.getData()
    load = this.load
    window.addEventListener('scroll', load, false)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', load, false)
  },
  methods: {
    goBack(){
      var obj = this.$http.isUniFunc();
      obj.isUni && (window.location.href = obj.host)
      !obj.isUni && this.$router.push({path:'/my'})
    },
    load() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 50
      if (start && this.loadEnd && this.nowPage < this.pageCount) {
        this.nowPage++
        this.getData()
      }
    },
    getData() {
      this.loadEnd = false
      this.$http.post('/usercenter/coupondetails/searchCouponDetailsKuyu', {
        nowPage: this.nowPage,
        pageShow: this.pageShow,
        state: this.state,
        couponId: ''
      }, res => {
        if (res.code == '0') {
          this.loadEnd = true
          this.couponList = this.couponList.concat(res.data.list)
          this.pageCount = Math.ceil(res.data.pagination.totalNum / this.pageShow)
        }
      })
    },
    change(item) {
      this.couponList = []
      this.state = item.state
      this.nowPage = 1
      this.getData()
      this.tabList.map(x => x.active = item.state == x.state)
    },
  },
}
</script>