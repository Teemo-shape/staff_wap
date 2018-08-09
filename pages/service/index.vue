<template>
  <div class="service">
    <yd-navbar title="我的服务">
      <a slot="left" @click="goBack()">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
    </yd-navbar>
    <div class="hei">
      <yd-slider autoplay="3000" class="hb">
        <yd-slider-item v-for="(n,i) in swiperSlides" :key="i">
          <a>
            <img :src="n.imageUrl">
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>
    <div class="ru">
      <ul>
        <li v-for="(item,index) in listTop" :key="index">
          <a :href="item.path">
            <img :src="item.src" />
            <div>
              {{item.name}}
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div class="service-top">
      <div class="don">常见问题</div>
      <div class="select">
        <ul>
          <a v-for="(item,index) in list" :key="index" :href="'/service/commonProblem?uuid='+item.uuid">
            <li>
              <div><img :src="item.iconPath" /></div>
              <p>{{item.categoryName}}</p>
            </li>
          </a>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <div class="donn">联系客服</div>
      <div class="left">
        <img src="/img/kf.png" />
        <p>24小时在线客服</p>
        <p>为您提供专业的客户服务</p>
        <div class="go" @click="go">立即咨询>></div>
      </div>
      <div class="right">
        <img src="/img/dh.png" />
        <p>7*24小时热线客服</p>
        <p>为您提供专业的客户服务</p>
        <div class="f">
          <a href="tel:4008-123456">4008-123456</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  head() {
    return {
      title: 'TCL官方服务',
    }
  },
  data() {
    return {
      listTop: [
        { src: '/img/wx.png', name: '我要维修', path: '/service/repair-install?type=repair' },
        { src: '/img/az.png', name: '我要安装', path: '/service/repair-install?type=install' },
        { src: '/img/jd.png', name: '服务进度', path: '/service/searchResult' },
        { src: '/img/zc.png', name: '服务政策', path: '/service/policy' },
        { src: '/img/lq.png', name: '领取积分', path: 'http://hy.tcl.com/wap/product/myproduct.html' },
        { src: '/img/jc.png', name: '产品教程', path: '/service/tutorial' },
        { src: '/img/zzjc.png', name: '自助检测', path: '/service/self-help' },
        { src: '/img/fp.png', name: '电子发票', path: 'http://chaxunfapiao.com' },
      ],
      list: [], swiperSlides: []
    }
  },
  created() {
    this.getData()
    this.getAd()
  },
  methods: {
    goBack(){
      var obj = this.$http.isUniFunc();
      obj.isUni && (window.location.href = obj.host)
      !obj.isUni && this.$router.push({path:'/my'})
    },
    getData() {
      this.$http.post('/servicecenter/getCommonProblems', {}, res => {
        this.list = res.retData.subCotentCategorys
      })
    },
    getAd() {
      this.$http.post('/platbanner/getActives', { terminalType: '02' }, res => {
        this.swiperSlides = res.retData
      })
    },
    go() {
     /*  if (!this.$utils.getCookie('wap_staff_token')) {
        window.location.href = '/user/login.html?backurl=' + decodeURIComponent(window.location.href)
      } else { */
        window.open('http://wap.service.tcl.com/web/')
        // window.open('http://wechat.dev.tventry.com/wechatwebservice/info/service/wap')
      // }
    }
  }
}
</script>
