<template>
  <div class="tk">
    <yd-navbar title="我的分佣">
      <router-link to="/tuike" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <main>
      <div class="board">
        <ul>
          <li>
            <span>{{oCount}}</span>
            <span>分享商品</span>
          </li>
          <li>
            <span>{{pCount}}</span>
            <span>成交单数</span>
          </li>
          <li>
            <span>{{psCount}}</span>
            <span>成交商品</span>
          </li>
        </ul>
      </div>
      <div class="title">
        <span>商品信息</span>
        <span>类型</span>
        <span>分佣比例</span>
        <span>成交单数</span>
      </div>
      <!--<div class="swiper-container">-->
      <!--<div class="swiper-wrapper">-->
      <ul class="comlist">
        <li v-for="(item,index) in list" :key="index">
          <a :href="item.salesOrderNum>0?'/tuike/orders?puuid=' + item.productUuid + '&ctype=' + item.commissionType:'javascript:;' ">
            <span>{{item.titleName}}</span>
            <span>{{item.commissionType==0?'固定':'比例'}}</span>
            <span>{{item.commissionType == 0 ? '￥' + item.commission + '/件' : item.commission + '%/单'}}</span>
            <span>{{item.salesOrderNum}}</span>
            <i class="iky-arrow-right"></i>
          </a>
        </li>
        <li v-show="list.length==0">
          <p class="empty">暂无数据...</p>
        </li>
      </ul>
      <!--</div>-->
      <!--</div>-->
      <div class="empty">{{tipText}}</div>
      <tkfoot />
    </main>
  </div>
</template>
<script>
import tkfoot from '~/components/footer';
let load = null;
export default {
  components: { tkfoot },
  head() {
    return {
      title: 'TCL官网-推客分佣',
    }
  },
  data() {
    return {
      tipText: '', pageSize: 6, currentPage: 1, pageCount: 0, total: 0, list: [], oCount: 0, pCount: 0, psCount: 0
    }
  },
  mounted() {
    load = this.load
    window.addEventListener('scroll', load, false)
    this.getCount()
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', load, false)
  },
  methods: {
    getCount() {
      this.$http.get('/salesmanorder/salesCount', {}, res => {
        this.oCount = res.retData.productPeddleCount
        this.pCount = res.retData.orderCount
        this.psCount = res.retData.productSalesCount
      })
    },
    load() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      this.currentPage == this.pageCount && (this.tipText = '后面没有了...')
      if (start && this.loadEnd && this.currentPage < this.pageCount && (this.list.length > 0)) {
        this.currentPage++
        this.getData()
      }
    },
    getData() {
      this.loadEnd = false;
      this.$http.get('/salesmanorder/salesProductList', { currentPage: this.currentPage, pageSize: this.pageSize }, res => {
        this.pageCount = Math.ceil(res.retData.total / this.pageSize)
        this.list = this.currentPage == 1 ? res.retData.records : this.list.concat(res.retData.records)
        this.loadEnd = true
        this.pageCount > 1 && this.pageCount != this.currentPage && (this.tipText = '上拉加载更多...')
      })
    }
  }
}
</script>
