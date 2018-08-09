<template>
  <div class="collection reservation">
    <yd-navbar title="我的预约">
      <a @click="goBack()" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
    </yd-navbar>
    <div class="empty" v-if="empty">
      <img src="/img/emptyCart.png">
      <p>哎呀！暂无预约商品~</p>
      <router-link :to="{path:'/'}">去逛逛</router-link>
    </div>
    
    <div class="detail">
      <div class="item" v-for="(item,i) in data" :key="i">
        <div class="state">
          <div class="left">抢购开始时间：
            <span class="cr">{{item.rushTime}}</span>
          </div>
        </div>
        <div class="goods">
          <div class="img">
            <a :href="'/other/'+item.productUuid"><img :src="item.imageUrl" alt=""></a>
          </div>
          <div class="info">
            <p>
              <a :href="'/other/'+item.productUuid">{{item.productName}}</a>
            </p>
            <p>购买数量：1</p>
            <p>单价：{{item.price}}元</p>
          </div>
        </div>
        <div class="btn-box">
          <a :href="item.path" :class="item.btnState?'buy':''">{{item.btnTxt}}</a>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
let loadMore = null;
export default {
  head() {
    return {
      title: 'TCL官网-我的预约',
    }
  },
  data() {
    return {
      pageShow: 8, nowPage: 1, totalNum: 100, pageCount: 0, data: [], cartData: [], loadTxt: '', empty: false
    }
  },
  watch: {
    nowPage(val) { this.getData() }
  },
  mounted() {
    loadMore = this.loadMore
    window.addEventListener('scroll', loadMore, false)
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', loadMore, false)
  },
  methods: {
    goBack(){
      var obj = this.$http.isUniFunc();
      obj.isUni && (window.location.href = obj.host)
      !obj.isUni && this.$router.push({path:'/my'})
    },
    getData() {
      var params = {
        nowPage: this.nowPage,
        pageShow: this.pageShow,
        productName: '',
      };
      this.$http.post('/usercenter/reserveorder/listKuyu', params, res => {
        this.empty = res.rows.length == 0
        this.loadEnd = true;
        if (res.rows && res.rows.length > 0) {
          if (res.pagination.totalNum) {
            this.pageCount = Math.ceil(res.pagination.totalNum / this.pageShow);
          }
          res.rows.map((m, index) => {
            var canBuy = res.canBuyList[index];
            var orderUuidId = res.orderUuidList[index];

            var date = m.promotionSubscribe.rushBuyBeginTime
            date = date && date.replace(/-/g, '/')
            var state = new Date(date).getTime() > new Date().getTime();
            // m.cls = (m.start == '2' || canBuy == 1) ? 'bookbtn fr' : 'bookbtn gray fr';
            var obj = {}

            obj.rushTime = m.promotionSubscribe.rushBuyBeginTime || '活动已结束'
            obj.btnTxt = m.state == '2' ? '查看订单' : ((canBuy == '0' && state) ? '等待抢购' : ((canBuy == 1 && !state) ? '立即抢购' : '活动结束'));
            obj.btnState = (m.start == '2' || canBuy == 1) ? true : false
            obj.imageUrl = m.skuNo
            obj.productName = m.product.productMain.productName
            obj.productUuid = m.productUuid
            obj.price = m.productMoney

            var path = '#'
            var query = ''
            if (m.state == 2) {
              path = `/my/orderDetail?uuid=${orderUuidId}`
            } else {
              if (canBuy == 1) {
                path = `/other/${m.productUuid}?reserveOrderId=${m.uuid}`
              }
            }
            obj.path = path
            this.data.push(obj)
          })
        }

      })
    },
    loadMore() {
      if (this.nowPage == this.pageCount) {
        this.loadTxt = '后面没有了...'
      } else {
        this.loadTxt = '上拉加载更多...'
      }
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.nowPage < this.pageCount) {
        this.nowPage++
      }
    },
  },
}
</script>

