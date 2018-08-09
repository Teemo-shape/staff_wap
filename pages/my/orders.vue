<template>
  <div class="orders">
    <header class="yd-navbar navbar-bottom-line-color" style="background-color: rgb(255, 255, 255); height: 1rem;">
      <div class="yd-navbar-item">
        <a @click="goBack()" class="nuxt-link-active">
          <span>
            <i class="yd-back-icon" style="color: rgb(92, 92, 92);"></i>
          </span>
        </a>
      </div>
       <div class="yd-navbar-center-box order-title" style="height: 1rem;" @click="showtitle">
        <div class="yd-navbar-center">
          <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.4rem;">我的订单
            <span :class="isShowtitle?'active arrow':'arrow'" v-show="isUni"></span>
          </span>
        </div>
      </div>
    </header>
    <div class="yd-tab">
      <ul class="yd-tab-nav">
        <li :class="item.active?'yd-tab-nav-item yd-tab-active':'yd-tab-nav-item'" v-for="(item,i) in tab" :key="i" @click="change(item)">
          <a href="javascript:;">{{item.title}}</a>
        </li>
      </ul>
    </div>
    <div class="detail">
      <div class="item" v-for="(item,i) in data" :key="i">
        <div class="orderNo">订单编号：
          <span>{{item.orderNo}}</span>
          <!--<span class="fr" v-if="item.buttonState.afterSaleButton">-->
            <!--<a :href="'/my/refundDetail?orderId='+item.orderNo" class="see_refund" v-if="item.goods[0].state">查看售后</a>-->
            <!--<a :href="'/my/applyRefund?orderId='+item.uuid+'&uuid='+item.goods[0].uuid+'&type=2'" class="go_refund" v-else>退款/退货</a>-->
          <!--</span>-->
        </div>
        <div class="secKill" v-if="item.isSecKill&&item.state!='8'&&item.state=='1'">
          剩余付款时间：{{item.orderTime}}
          <span>秒杀</span>
        </div>
        <div class="state">
          <div class="left" style="color:#999">{{item.date}}</div>
          <div class="right cr">{{item.stateTxt}}</div>
        </div>
        <a :href="'/my/orderDetail?uuid='+item.uuid">
          <div class="goods" v-for="(g,i) in item.goods" :key="i">
            <div class="img">
              <img :src="g.imageUrl" alt="">
            </div>
            <div class="info">
              <p>{{g.productName}}
                <span class="yd-badge" v-if="g.badge">{{g.badge}}</span>
                <br>
                <i v-for="(m,n) in g.spec" :key="n">{{m.value}} </i><i> ×{{g.buyNum}}</i>
              </p>
              <!-- <p class="pri">¥{{g.price.toFixed(2)}} ×{{g.buyNum}}</p> -->
            </div>
          </div>
        </a>
        <div class="total">
          共计<i>{{count(item.goods)}}</i>件商品
          <span>合计：<i>¥{{item.price.toFixed(2)}}</i></span>
        </div>
        <div class="operation">
          <yd-button type="hollow" v-if="item.buttonState.cancelButton" @click.native="orderColseV=true;uuid=item.uuid">取消订单</yd-button>
          <yd-button type="danger" v-if="item.state=='1'&&((item.overdueDay=='1'&&item.orderType=='3'&& item.now < item.firstPayTime)||item.resfirstPayState=='noo')" @click.native="$router.push({path:'/order/pay',query:{orderId:item.orderNo,type:2}})">
            付定金
          </yd-button>
          <yd-button type="danger" v-if="item.state=='1'&&item.overdueDay!='1'&&item.orderType=='3'&&item.now < item.firstPayTime&&item.resfirstPayState=='yoo'" @click.native="$router.push({path:'/order/pay',query:{orderId:item.orderNo,type:2}})">
            付定金
          </yd-button>
          <yd-button type="danger" v-if="(!item.isSecKill&&item.state=='1'&&item.orderType=='1')||(item.isSecKill&&item.remainMinute>0)" @click.native="$router.push({path:'/order/pay',query:{orderId:item.orderNo,type:2}})">
            付款
          </yd-button>
          <yd-button type="danger" v-if="item.state=='2'&&item.buttonState.payLastButton" @click.native="$router.push({path:'/order/pay',query:{orderId:item.orderNo,type:2}})">
            付尾款
          </yd-button>
          <yd-button type="hollow" v-if="item.state=='6' || item.state == '7'" @click.native="$router.push({path:'/my/logistics',query:{uuid:item.uuid}})">查看物流</yd-button>
          <yd-button type="hollow" v-if="item.buttonState.confirmReceiveButton" @click.native="recevier(item.uuid)">确认收货</yd-button>
          <yd-button type="hollow" v-if="item.commentState == '2'&&item.state == '7'" @click.native="$router.push({path:'/my/comment',query:{uuid:item.uuid}})">查看评价</yd-button>
          <yd-button type="hollow" v-if="item.commentState == '1'&&item.state == '7'" @click.native="$router.push({path:'/my/goodComment',query:{uuid:item.uuid}})">写评价</yd-button>
        </div>
      </div>
    </div>
    <div class="empty" v-show="emptyV">
      <img src="/img/emptyCart.png">
      <p>哎呀！暂无相关数据~</p>
    </div>
    <yd-actionsheet :items="orderCloseItem" v-model="orderColseV" cancel="取消"></yd-actionsheet>
  </div>
</template>
<script>
let loadMore = null;
export default {
  head() {
    return {
      title: 'T严选商城-我的订单',
    }
  },
  data() {
    return {
      isShowtitle: false,
      isUni:false,
      jflink:'http://hy.tcl.com/wap/usercenter/orderlist.html',
      emptyV: false, orderColseV: false, orderCloseItem: [],
      tab: [{ title: '全部', value: 0, active: true }, { title: '待付款', value: 1, active: false }, { title: '待发货', value: 4, active: false }, { title: '待收货', value: 6, active: false }, { title: '待评价', value: 11, active: false },],
      page: 1, pageCount: 0, pageSize: 5, data: [], empty: false, level: 0, integral: 0, orderState: '', uuid: '',
    }
  },
  watch: {
    page(val) {
      this.getData()
    },
    isShowtitle(v) {
      document.body.className = this.isShowtitle ? 'noscroll' : ''
    }
  },
  mounted() {
    this.jflink =  document.domain == 'm.tcl.com' ? 'http://hy.tcl.com/wap/usercenter/orderlist.html' : 'http://jf.10get.com/wap/usercenter/orderlist.html',
    this.isUni = this.$http.isUniFunc().isUni;
    loadMore = this.loadMore
    window.addEventListener('scroll', loadMore, false)
    this.orderState = this.$route.query.state || 0
    if (this.orderState || this.orderState != 0) {
      this.tab.map(x => x.active = x.value == this.orderState);
    }
    this.orderCloseItem = [
      { label: '现在不想购买', method: () => this.closeOrder('现在不想购买') },
      { label: '重复下单', method: () => this.closeOrder('重复下单') },
      { label: '商品价格较贵', method: () => this.closeOrder('商品价格较贵') },
      { label: '收货人信息有误', method: () => this.closeOrder('收货人信息有误') },
      { label: '送货时间过长', method: () => this.closeOrder('送货时间过长') },
      { label: '其他原因', method: () => this.closeOrder('其他原因') },
    ]
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', loadMore, false)
  },
  methods: {
    count(o){
      let sum = 0;
      o.forEach(m => {
        sum += m.buyNum
      })
      return sum
    },
    goBack(){
      var obj = this.$http.isUniFunc();
      obj.isUni && (window.location.href = obj.host)
      !obj.isUni && this.$router.push({path:'/my'})
    },
    showtitle() {
      this.$http.isUniFunc().isUni &&
      (this.isShowtitle = !this.isShowtitle )//统一用户中心
    },
    closeOrder(msg) {
      this.$http.post('/usercenter/order/cancel', {
        orderId: this.uuid,
        cancelReason: msg,
      }, res => {
        if (res.code == 0) {
          this.$dialog.alert({ mes: '取消订单成功！' })
          this.data = []
          this.getData()
        } else {
          this.$dialog.alert({ mes: '取消订单失败！' })
        }
      })
    },
    change(item) {
      // this.$router.push({ path: '/my/orders', query: { state: item.value } })
      if (this.orderState != item.value) {
        this.data = []
        this.orderState = item.value
        this.emptyV = false;
        this.page != 1 ? (this.page = 1) : this.getData();
      }
      this.tab.map(x => x.active = x.value == this.orderState);
    },
    getData() {
      this.loadEnd = false
      let pramas = {
        nowPage: this.page,
        pageShow: this.pageSize,
        type: 'formdata'
      }
      if (this.orderState != 0 && this.orderState) {
        pramas.orderState = this.orderState
      }
      this.$http.post('/usercenter/order/listKuyu', pramas, res => {
        if (res.code == '0') {

          this.loadEnd = true
          if (res.data.pagination.totalNum == 0) this.emptyV = true
          if (res.data.pagination.totalNum) {
            this.pageCount = Math.ceil(res.data.pagination.totalNum / this.pageSize);
          };
          let detail = res.data.dataList
          console.log(detail)
          var data = []
          detail.map((x) => {
            let g = x.detailList
            var goods = []
            g.map((y) => {
              goods.push({
                uuid: y.uuid,
                productName: y.productName,
                buyNum: y.buyNum,
                price: y.basePrice,
                imageUrl: y.specUuid,
                state: y.state,
                spec:eval(y.spec),
                badge: x.limitPromotion ? '秒杀' : (y.suit ? '套装' : (y.discountModel ? (y.discountModel.giftNames && y.discountModel.giftNames[0] ? '赠品' : (y.discountModel.description ? '促销' : '')) : (x.discountModel && x.discountModel.length > 0 ? (x.discountModel[0].description ? '促销' : '') : '')))
              })
            })
            // let lastpayTimeOut = new Date().getTime() > (x.lastPayTime ? new Date(x.lastPayTime.replace(/-/g, '/')).getTime() : -1)
            // let firstpayTimeOut = new Date().getTime() > (x.firstPayTime ? new Date(x.firstPayTime.replace(/-/g, '/')).getTime() : -1)
            // let stateTxt = (x.state == '1' && x.orderType == '3' && firstpayTimeOut) ? '支付定金超时' : (x.state == '2' && x.orderType == '3' && lastpayTimeOut ? '支付尾款超时' : x.orderStatusName)
            let firstPayTime = x.firstPayTime ? new Date(x.firstPayTime.replace(/\-/g, '/')).getTime() : ''
            let lastStar = x.lastStartPayTime ? new Date(x.lastStartPayTime.replace(/\-/g, '/')).getTime() : ''
            let lastPayTime = x.lastPayTime ? new Date(x.lastPayTime.replace(/\-/g, '/')).getTime() : ''
            let now = new Date().getTime()
            let stateTxt = ''
            if (x.orderType == '3' && x.state == '1' && now < firstPayTime) {
              stateTxt = '等待支付定金';
            } else if (x.orderType == '3' && x.state == '1' && now > firstPayTime) {
              stateTxt = '等待支付定金超时';
            } else if (x.orderType == '3' && x.state == '2' && x.ucenterButton.payLastButton != true && now < lastStar) {
              stateTxt = '等待支付尾款未开始';
            } else if (x.orderType == '3' && x.state == '2' && x.ucenterButton.payLastButton == true) {
              stateTxt = '等待支付尾款';
            } else if (x.orderType == '3' && x.state == '2' && x.ucenterButton.payLastButton != true && now > lastPayTime) {
              stateTxt = '等待支付尾款超时';
            } else if (x.state == '1' && x.limitPromotion == true) {
              stateTxt = '';
            } else {
              stateTxt = x.orderStatusName;
            }
            if (x.limitPromotion) {
              // stateTxt = '秒杀'
              var isSecKill = true;
              if (x.state == '1') {
                var remainMinute = Math.ceil(x.limitRemainPayTime / 60000);
                if (remainMinute > 0) {
                  var orderTime = remainMinute > 60 ? (remainMinute / 60).toFixed(0) : '0' + ' 小时 ' + remainMinute % 60 + ' 分钟'
                } else {
                  var orderTime = '已过期'
                }
              }

            }

            data.push({
              uuid: x.uuid,
              orderNo: x.orderId,
              orderUuid: x.uuid,
              date: x.orderTime,
              stateTxt: stateTxt,
              price: x.payMoney,
              goods: goods,
              detailRowspan:x.detailRowspan,
              state: x.state,
              commentState: x.commentState,
              overdueDay: x.overdueDay,
              resfirstPayState: x.resfirstPayState,
              orderType: x.orderType,
              buttonState: x.ucenterButton,
              firstPayTime: firstPayTime,
              now: now,
              orderTime: orderTime,
              isSecKill: isSecKill ? isSecKill : false,
              remainMinute: remainMinute,
            })
          })
          this.data = this.data.concat(data)
        }
      })
    },
    loadMore() {
      this.isShowtitle = false;
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.page < this.pageCount) {
        this.page++
      }
    },
    recevier(uuid) {
      this.$dialog.confirm({
        title: '温馨提示',
        mes: '确认收货后不能修改，确认收货吗？',
        opts: () => {
          this.$http.post('/usercenter/order/reveiveKuyu', { orderUuid: uuid }, res => {
            if (res && res.code == 0) {
              this.$dialog.alert({
                mes: '确认成功！', callback: () => {
                  this.data = []
                  this.getData()
                }
              })
            } else {
              this.$dialog.alert({ mes: '确认失败！' })
            }
          })
        }
      });
    }
  },
}
</script>
