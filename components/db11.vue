<template>
  <div class="db11">
    <!-- 马上使用优惠券 -->
    <!-- <div class="y_use" @click="doubleEleven=true;" v-show="activeImg">
      <a href="javascript:void(0)">
        <img :src="activeImg" alt="">
      </a>
    </div> -->
    <!-- 双11活动popup -->
    <yd-popup v-model="doubleEleven" position="center" width="100%" class="doubleEleven" v-show="activeImg">
      <div class="modal-content">
        <div>
          <img :src="activeImg" alt="">
        </div>
        <a class="goCoupons" href="#" @click="doubleEleven=false;goCoupons=true;getCouponData()">
          <img src="/img/db11/y_get.png" alt="">
        </a>
        <a href="javascript:void(0);" @click="doubleEleven=false;" class="closeCoupons">
          <img src="/img/db11/y_colse.png" alt="">
        </a>
      </div>
    </yd-popup>
    <!-- 领取优惠券 -->
    <yd-popup v-model="goCoupons" position="center" width="100%" class="couponDetail">
      <div class="modal-content-detail">
        <span class="close" @click="goCoupons=false">×</span>
        <div>
          <img src="/img/db11/y_beijing.png" alt="">
        </div>
        <div class="coupon-content">
          <p>优惠券可在【<a href="/my/coupons">个人中心</a>】查看</p>
          <ul>
            <li v-for="(item,index) in couponData" :key="index">
              <div class="couponMoney">
                <p class="title">
                  <span>{{item.price}}</span>
                  元
                </p>
                <p>{{item.firstNote}}</p>
                <p>{{item.secondNote}}</p>
              </div>
              <div class="couponGet">
                <p @click="downLoadCoupon(item)" class="noGet" v-show="item.state=='0'">立即领取</p>
                <p class="hadGet" v-show="item.state=='1'">已领取</p>
              </div>
            </li>
          </ul>
        </div>
        <a class="getCoupons" :href="url" @click="go">
          <img src="/img/db11/y_go.png" alt="">
        </a>
      </div>
    </yd-popup>
  </div>
</template>
<script>
export default {
  name: "db11",
  data() {
    return {
      doubleEleven: false,
      goCoupons: false,
      activeImg: "",
      couponData: [],
      url: ""
    };
  },
  created() {
    // console.log(this.$utils.getCookie('db11'))
    this.doubleEleven =this.$utils.getCookie('db11') ?false : true;
    if (this.$utils.getCookie("goCouponsState")) {
      this.goCoupons = true;
      (this.doubleEleven = false), this.getCouponData();
      this.$utils.delCookie("goCouponsState");
    }
    this.getActives();
  },
  methods: {
    go(){
        this.goCoupons=false;
        this.$utils.setCookie('db11','db11',10/(24*60));
    },
    getActives() {
      this.$http.get("/homepage/couponpromotion/getActives?terminalType=02",{},res => {
          let data = res.retData;
          if (data && data.length > 0) {
            this.activeImg = data[0].imageUrl;
           this.url = data[0].url || '/';
          }
        }
      );
    },
    getCouponData() {
      this.$http.get("/homepage/promotioncoupons/getActives?terminalType=02",{},res => {
          this.couponData = res.retData;
        }
      );
    },
    downLoadCoupon(item) {
      //领取优惠券
      if (!this.$utils.getCookie("wap_staff_token")) {
        this.$utils.setCookie("goCouponsState", "true");
        window.location.href = "/user/login.html?backurl=" + decodeURIComponent(window.location.href);
      } else {
        let params = {couponTypeUuid: item.couponUuid,terminalType: "02"};
        this.$http.get("/cart/downLoadCoupon", params, res => {
          if (res.code == "0") {
            this.$dialog.toast({ mes: "领取成功！" });
            this.getCouponData();
          } else {
            this.$dialog.toast({ mes: res.msg });
          }
          document.querySelector(".yd-dialog-white-mask").style.zIndex = 20000;
        });
      }
    }
  }
};
</script>

