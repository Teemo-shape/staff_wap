<template>
  <div class="tk">
    <yd-navbar title="商品列表">
      <router-link to="/tuike" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
      <router-link to="/tuike/commission" slot="right">
        <span class="fy">我的分佣</span>
      </router-link>
    </yd-navbar>
    <main>
      <div class="banner"></div>
      <!--<div class="swiper-container">-->
      <!--<div class="swiper-wrapper">-->
      <div class="g-list">
        <div class="good swiper-slide" v-for="(item,index) in list" :key="index">
          <img :src="item.imageUrl" :alt="item.titleName">
          <div class="info">
            <h1>{{item.titleName}}</h1>
            <p>零售价
              <span>￥{{item.price}}</span>
            </p>
            <p v-if="item.commissionType==0">固定分佣
              <span>￥{{item.commission}}</span>/件</p>
            <p v-else>分拥比例
              <span>￥{{item.commission}}%</span>/单</p>
          </div>
          <a class="share" @click="open(item)"></a>
          <div class="shareCount">
            <span>
              <i>{{item.peddleMenNum||0}}</i>人</span>
            <span>已分享</span>
          </div>
        </div>
      </div>
      <!--</div>-->
      <div class="empty">{{tipText}}</div>
    </main>
    <div class="wxtk" v-show="share">
      <a @click="share=false">朕知道了</a>
      <a @click="toshare">去分享链接</a>
    </div>
    <tkfoot />
  </div>
</template>
<script>
import tkfoot from '~/components/footer';
let load = null;
export default {
  components: { tkfoot },
  head() {
    return {
      title: 'TCL官网-推客商品列表',
    }
  },
  data() {
    return {
      share: false, pageSize: 6, currentPage: 1, pageCount: 0, total: 0, list: [], pid: '', uuid: '', loadEnd: true, tkcid: '', tipText: '上拉加载更多',
    }
  },
  mounted() {
    load = this.load
    window.addEventListener('scroll', load, false)
    this.tkcid = this.$route.query.cid
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', load, false)
  },
  methods: {
    load() {
      this.currentPage == this.pageCount && (this.tipText = '后面没有了...')
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 200
      if (start && this.loadEnd && this.currentPage < this.pageCount && (this.list.length > 0)) {
        this.currentPage++
        this.getData()
      }
    },
    open(item) {
      this.pid = item.productUuid
      this.uuid = item.uuid
      this.share = true
    },
    toshare() {
      this.$http.get('/homePage/productpeddle/updatePeddleNum', { uuid: this.uuid }, res => {
        window.location.href = `/other/${this.pid}?tkcid=${this.tkcid}`
      })
    },
    getData() {
      this.loadEnd = false
      this.$http.get('/homePage/productpeddle/getActives', { pageSize: this.pageSize, currentPage: this.currentPage }, res => {
        this.pageCount = Math.ceil(res.retData.total / this.pageSize)
        this.list = this.currentPage == 1 ? res.retData.records : this.list.concat(res.retData.records)
        this.loadEnd = true
      })
    }
  }
}
</script>
