<template>
  <div class="order-detail">
    <yd-navbar title="订单详情">
      <span @click="$router.back()" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </span>
    </yd-navbar>

    <div class="status">
      <div>{{data.orderStatusName}}</div>
    </div>

    <div class="maxTime" v-if="data.firstPayTimeStr">定金支付截止时间为: {{data.firstPayTimeStr}}</div>
    <div class="maxTime" v-if="data.lastPayTimeStr">尾款支付截止时间为: {{data.lastPayTimeStr}}</div>

    <div class="order">
      <div>订单编号：{{data.orderId}}</div>
      <p style="color:#999;">{{data.orderTime}}</p>
    </div>
    <div class="secKill" v-if="data.isSecKill&&data.state!='8'&&data.state=='1'">
      剩余付款时间：{{data.orderTime}}
      <span>秒杀</span>
    </div>
    <!-- 流程图start -->
    <!--div v-if="data.orderStatusName!='交易关闭'">
      预售订单
      <div class="step" v-if="isPre">
        <ul class="statusName">
          <li v-for="(item,index) in stateName" :key="index">
            <div :class="{'status_pre':true,'div_active':item.del}">{{item.name}}</div>
            <i :class="{'arrow':true,'i_active':item.del}"></i>
          </li>
        </ul>
        <ul class="dot_pre">
          <li v-for="(item,index) in stateName" :key="index">
            <i :class="{'doti_pre':true,'dot_active':item.del}"></i>
          </li>
          <p class="bar-top-pre"></p>
        </ul>
        <ul class="statusTime_pre">
          <li v-for="(item,index) in timeList" :key="index">
            <div>{{item}}</div>
          </li>
        </ul>
      </div>
      普通订单
      <div class="step" v-else>
        <ul class="statusName">
          <li v-for="(item,index) in stateName" :key="index">
            <div :class="{'status':true,'div_active':item.del}">{{item.name}}</div>
            <i :class="{'arrow':true,'i_active':item.del}"></i>
          </li>
        </ul>
        <ul class="dot">
          <li v-for="(item,index) in stateName" :key="index">
            <i :class="{'doti':true,'dot_active':item.del}"></i>
          </li>
          <p class="bar-top"></p>
        </ul>
        <ul class="statusTime">
          <li v-for="(item,index) in timeList" :key="index">
            <div>{{item}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 流程图end -->
    <div class="invoice">
      <p>收货地址:{{data.address}}</p>
      <p>收货人:&emsp;{{data.name}}&nbsp;{{data.mobile}}</p>
      <!--<p>发票类型：{{data.invoiceType}}</p>-->
      <!--<p>发票抬头：{{data.invoiceTitle}}</p>-->
    </div>
    <div class="goods" v-for="(item,index) in data.goods" :key="index">
      <div class="img">
        <a :href="'/other/'+item.productUuid"><img :src="item.imageUrl" alt=""></a>
      </div>
      <div class="info">
        <p>
          <a :href="'/other/'+item.productUuid">{{item.productName}}</a>
          <span class="yd-badge" v-if="item.badge">{{item.badge}}</span>
        </p>
        <!--<p v-if="data.description">促销: {{data.description}}</p>-->
        <!--<p v-if="item.description">促销: {{item.description}}</p>-->
        <p><span v-for="(o,i) in item.spec" :key="i" style="color:#999">{{o.value}}&nbsp;</span>&emsp;×{{item.buyNum}}</p>
        <p>单价：<span style="color:#ff4545;">¥{{(item.price-0).toFixed(2)}}</span></p>
        <p v-show="item.firstMoney">定金: ¥{{(item.firstMoney-0).toFixed(2)}}</p>
        <p v-show="data.orderType=='3'&&item.payMoney">尾款: ¥{{(item.payMoney-0).toFixed(2)}}</p>
        <!--<div v-if="item.productGiftList&&item.productGiftList.length>0">-->
          <!--<span>赠品：</span>-->
          <!--<div class="gift">-->
            <!--<p v-for="(val,index) in item.productGiftList" :key="index">{{val.productName}} * {{item.buyNum}}</p>-->
          <!--</div>-->
        <!--</div>-->
      </div>
        <div class="btnbox">
            <yd-button type="hollow" v-if="data.afterGoodsdetail[index].state !== null" @click.native="$router.push({path:'/my/refundDetail',query:{orderId:data.orderNo, number:index}})">查看售后</yd-button>
            <yd-button type="hollow" v-if="data.afterGoodsdetail[index].state == null && Number(data.state) >= 7" @click.native="$router.push({path:'/my/applyRefund',query:{orderId:data.uuid, uuid:data.goods[index].uuid}})">申请售后</yd-button>
        </div>
      <!--<div class="finalPrice">¥{{(item.payMoney-0).toFixed(2)}}</div>-->
    </div>
    <!--<div class="order-gift" v-if="data.gift && data.gift.length>0">-->
      <!--<span>订单赠：</span>-->
      <!--<div class="gift">-->
        <!--<p v-for="(item,index) in data.gift" :key="index">{{item}}</p>-->
      <!--</div>-->
    <!--</div>-->
    <div class="invoiceState">
      <!--<p>发票：<span @click="mshow=true">{{data.invoiceType}} &gt;</span></p>-->
        <p>发票种类: <span>{{data.invoiceType}}</span></p>
        <p>发票抬头: <span>{{myInvoice.invoiceTitle}}</span></p>
        <p>纳税人识别号: <span>{{myInvoice.ratePayCode}}</span></p>
        <p>发票内容: <span>{{myInvoice.invoiceContent}}</span></p>
      <p>买家留言: <span class="note">{{data.note}}</span></p>
    </div>
    <!--<yd-popup v-model="mshow" position="center" class="invoiceBox">-->
      <!--<div style="background-color:#fff;">-->
        <!--<p>发票类型:{{data.invoiceType}}</p>-->
        <!--<p>发票抬头:{{onlineInvoice.invoiceTitle}}</p>-->
        <!--<p>发票内容:{{onlineInvoice.invoiceContent}}</p>-->
        <!--<p>纳税人识别号:{{onlineInvoice.ratePayCode}}</p>-->
        <!--<yd-button @click.native="mshow = false">关闭</yd-button>-->
      <!--</div>-->
    <!--</yd-popup>-->
    <div class="price">
      <p>
        <span class="left">商品金额:</span>
        <span class="right">¥{{(data.payMoney-0).toFixed(2)}}</span>
      </p>
      <p>
        <span class="left">优惠</span>
        <span class="right">-¥{{(data.freeMoney-0).toFixed(2)}}</span>
      </p>
      <p>
        <span class="left">运费</span>
        <span class="right">¥{{data.yfMoney}}</span>
      </p>
      <!--<p>-->
        <!--<span class="left">积分抵扣</span>-->
        <!--<span class="right">-¥{{data.jfMoney}}</span>-->
      <!--</p>-->
      <p v-if="data.state=='1'&&((data.overdueDay=='1'&&data.orderType=='3'&& data.now < data.firstPayTime)||data.resfirstPayState=='noo')">
        <span class="left">定金</span>
        <span class="right cr">¥{{(data.goods[0].firstMoney-0).toFixed(2)}}</span>
      </p>
      <p v-else-if="data.state=='1'&&data.overdueDay!='1'&&data.orderType=='3'&&data.now < data.firstPayTime&&data.resfirstPayState=='yoo'">
        <span class="left">定金</span>
        <span class="right cr">¥{{(data.goods[0].firstMoney-0).toFixed(2)}}</span>
      </p>
      <p v-else-if="data.state=='2'&&data.buttonState.payLastButton">
        <span class="left">尾款</span>
        <span class="right cr">¥{{(data.goods[0].payMoney-0).toFixed(2)}}</span>
      </p>
      <p v-else>
        <span class="left">订单总价:</span>
        <span class="right cr">¥{{(data.total-0).toFixed(2)}}</span>
      </p>
      <p class="sum">实付款: <span>¥{{(data.total-0).toFixed(2)}}</span></p>
    </div>
    <yd-actionsheet :items="orderCloseItem" v-model="orderColseV" cancel="取消"></yd-actionsheet>
    <yd-actionsheet :items="recevierItem" v-model="recevierV" cancel="取消"></yd-actionsheet>
    <!-- <div class="invoiceState">
      <p>支付方式：{{data.payTypeName}}</p>
      <p>支付流水号:{{data.payTypeBackCode}}</p>
    </div> -->
      <div class="btnbox">
          <yd-button type="hollow" v-if="data.buttonState.cancelButton" @click.native="orderColseV=true;uuid=data.uuid">取消订单</yd-button>
          <yd-button type="danger" v-if="data.state=='1'&&((data.overdueDay=='1'&&data.orderType=='3'&& data.now < data.firstPayTime)||data.resfirstPayState=='noo')" @click.native="$router.push({path:'/order/pay',query:{orderId:data.orderId,type:2,orderType:1}})">
              付定金
          </yd-button>
          <yd-button type="danger" v-if="data.state=='1'&&data.overdueDay!='1'&&data.orderType=='3'&&data.now < data.firstPayTime&&data.resfirstPayState=='yoo'" @click.native="$router.push({path:'/order/pay',query:{orderId:data.orderId,type:2,orderType:1}})">
              付定金
          </yd-button>
          <yd-button type="danger" v-if="(!data.isSecKill&&data.state=='1'&&data.orderType=='1')||(data.isSecKill&&data.remainMinute>0)" @click.native="$router.push({path:'/order/pay',query:{orderId:data.orderId,type:2}})">
              付款
          </yd-button>
          <yd-button type="danger" v-if="data.state=='2'&&data.buttonState.payLastButton" @click.native="$router.push({path:'/order/pay',query:{orderId:data.orderId,type:2}})">
              付尾款
          </yd-button>
          <yd-button type="hollow" v-if="data.state=='6'||data.state=='7'" @click.native="$router.push({path:'/my/logistics',query:{uuid:data.uuid}})">查看物流</yd-button>
          <yd-button type="hollow" v-if="data.buttonState.confirmReceiveButton" @click.native="recevier(data.uuid)">确认收货</yd-button>
          <yd-button type="hollow" v-if="data.commentState == '2'&&data.state == '7'" @click.native="$router.push({path:'/my/comment',query:{uuid:data.uuid}})">查看评价</yd-button>
          <yd-button type="hollow" v-if="data.commentState == '1'&&data.state == '7'" @click.native="$router.push({path:'/my/goodComment',query:{uuid:data.uuid}})">评价</yd-button>
      </div>
  </div>
</template>
<script>
export default {
  head() {
		return {
			title: 'T严选商城-订单详情',
		}
	},
  data() {
    return {
      uuid: '',
      data: { buttonState: {} },
      orderColseV: false,
      orderCloseItem: [],
      recevierV: false,
        myInvoice:{},
      recevierItem: [{ label: '确认收货', method: () => this.recevier() }],
      stateName: [
        { name: '下单', del: false },
        { name: '付款', del: false },
        { name: '发货', del: false },
        { name: '交易成功', del: false },
        { name: '评价', del: false },
      ],
      timeList: [],
      isPre: false,
      mshow: false,
      onlineInvoice:''
    }
  },
  mounted() {
    this.uuid = this.$route.query.uuid
    this.getData()
    this.orderCloseItem = [
      { label: '现在不想购买', method: () => this.closeOrder('现在不想购买') },
      { label: '重复下单', method: () => this.closeOrder('重复下单') },
      { label: '商品价格较贵', method: () => this.closeOrder('商品价格较贵') },
      { label: '收货人信息有误', method: () => this.closeOrder('收货人信息有误') },
      { label: '送货时间过长', method: () => this.closeOrder('送货时间过长') },
      { label: '其他原因', method: () => this.closeOrder('其他原因') },
    ]
  },
  methods: {
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
    recevier(uuid) { // 确认收货
      this.$dialog.confirm({
        title: '温馨提示',
        mes: '确认收货后不能修改，确认收货吗？',
        opts: () => {
          this.$http.post('/usercenter/order/reveiveKuyu', { orderUuid: uuid }, res => {
            if (res && res.code == 0) {
              this.$dialog.alert({
                mes: '确认成功！', callback: () => {
                  this.$router.go(0)
                }
              })
            } else {
              this.$dialog.alert({ mes: '确认失败！' })
            }
          })
        }
      });
    },
    getData() {
      this.$http.post('/usercenter/order/ajaxviewKuyu', { uuid: this.uuid }, res => {
        let data = {}
        this.timeList = []
        this.onlineInvoice = res.data.onlineInvoice||{}
        let m = res.data.m
        data.uuid = m.uuid
        data.orderId = m.orderId
        // data.orderStatusName = m.orderStatusName
        data.state = m.state
        data.commentState = m.commentState
        data.overdueDay = m.overdueDay
        data.resfirstPayState = m.resfirstPayState
        data.orderType = m.orderType
        data.note = m.note
        data.payTypeName = m.payTypeName
        data.payTypeBackCode = m.payTypeBackCode
        data.invoiceState = res.data.ordernaryInvoice.invoiceState //1未开票 2已开票 3作废
          data.afterGoodsdetail = res.data.m.detailList
          console.log(res)
        //订单赠
        if (m.discountModel && m.discountModel.length > 0) {
          var gift = []
          m.discountModel.map((x) => {
            //促销
            if (x.description) {
              data.description = x.description;
            }
            if (x.giftNames) {
              x.giftNames.map((y) => {
                gift.push(y)
              })
            }
          })
          data.gift = gift


        }
        //时间
        if (m.orderTime) {
          this.timeList.push(m.orderTime)
        }
        if (m.payTime && m.orderType != '3') {
          this.timeList.push(m.payTime)
        }
        if (m.orderType == '3' && m.firstMoneyPaySuccessTime && m.firstMoneyPaySuccessTime.indexOf(':') > 0) {
          this.timeList.push(m.firstMoneyPaySuccessTime)
        }
        if (m.orderType == '3' && m.lastMoneyPaySuccessTime && m.lastMoneyPaySuccessTime.indexOf(':') > 0) {
          this.timeList.push(m.lastMoneyPaySuccessTime)
        }
        if (m.sendTime) {
          this.timeList.push(m.sendTime)
        };
        if (m.confirmTime) {
          this.timeList.push(m.confirmTime)
        };
        if (m.commentTime) {
          this.timeList.push(m.commentTime)
        };
        //订单状态
        //预售订单
        if (m.state != '8' && m.orderType == '3') {//已下单未付款
          this.stateName = [
            { name: '下单', del: false },
            { name: '付定金', del: false },
            { name: '付尾款', del: false },
            { name: '发货', del: false },
            { name: '交易成功', del: false },
            { name: '评价', del: false },
          ]
          if (m.state == '1') {
            this.stateName[0].del = true;
          }
          if (m.state == '2') {
            this.stateName[1].del = true;
          }
          if (m.state == '4' || m.state == '5') {
            this.stateName[2].del = true;
          }
          if (m.state == '6') {
            this.stateName[3].del = true;
          }
          if (m.commentState == '1' || m.state == '7') {
            this.stateName[4].del = true;
          }
          if (m.commentState == '2') {
            this.stateName = [
              { name: '下单', del: false },
              { name: '付定金', del: false },
              { name: '付尾款', del: false },
              { name: '发货', del: false },
              { name: '交易成功', del: false },
              { name: '评价', del: false },
            ]
          }
        }
        //普通订单
        if (m.state != '8' && m.orderType == '1') {//已下单未付款
          if (m.state == '1') {
            this.stateName[0].del = true;
          }
          if (m.state == '4' || m.state == '5') {
            this.stateName[1].del = true;
          }
          if (m.state == '6') {
            this.stateName[2].del = true;
          }
          if (m.commentState != '2' && m.state == '7') {
            this.stateName[3].del = true;
          }
          if (m.state == '7' && m.commentState == '2') {
            this.stateName = [
              { name: '下单', del: false },
              { name: '付款', del: false },
              { name: '发货', del: false },
              { name: '交易成功', del: false },
              { name: '评价', del: false },
            ]
          }
        }




        let firstPayTime = m.firstPayTime ? new Date(m.firstPayTime.replace(/\-/g, '/')).getTime() : ''
        let lastStar = m.lastStartPayTime ? new Date(m.lastStartPayTime.replace(/\-/g, '/')).getTime() : ''
        let lastPayTime = m.lastPayTime ? new Date(m.lastPayTime.replace(/\-/g, '/')).getTime() : ''
        let now = new Date().getTime()
        let stateTxt = ''
        if (m.orderType == '3') {
          this.isPre = true;
        }
        if (m.orderType == '3' && m.state == '1' && now < firstPayTime) {
          stateTxt = '等待支付定金';
          data.firstPayTimeStr = m.firstPayTime
        } else if (m.orderType == '3' && m.state == '1' && now > firstPayTime) {
          stateTxt = '等待支付定金超时';
        } else if (m.orderType == '3' && m.state == '2' && m.ucenterButton.payLastButton != true && now < lastStar) {
          stateTxt = '等待支付尾款未开始';
        } else if (m.orderType == '3' && m.state == '2' && m.ucenterButton.payLastButton == true) {
          stateTxt = '等待支付尾款';
          data.lastPayTimeStr = m.lastPayTime
        } else if (m.orderType == '3' && m.state == '2' && m.ucenterButton.payLastButton != true && now > lastPayTime) {
          stateTxt = '等待支付尾款超时';
        } else if (m.state == '1' && m.limitPromotion == true) {
          stateTxt = '';
        } else {
          stateTxt = m.orderStatusName;
        }

        if (m.limitPromotion) {
          // stateTxt = '秒杀'
          var isSecKill = true;
          if (m.state == '1') {
            var remainMinute = Math.ceil(m.limitRemainPayTime / 60000);
            if (remainMinute > 0) {
              var orderTime = remainMinute > 60 ? (remainMinute / 60).toFixed(0) : '0' + ' 小时 ' + remainMinute % 60 + ' 分钟'
            } else {
              var orderTime = '已过期'
            }
          } else {
            var orderTime = '已过期'
          }
        }else{
            orderTime = res.data.m.orderTime
        }
        data.orderTime = orderTime
        data.remainMinute = remainMinute
        data.isSecKill = isSecKill ? isSecKill : false

        data.orderStatusName = stateTxt
        data.firstPayTime = firstPayTime
        data.now = now



        //goods
        var goods = []
        m.detailList.map((y) => {
          goods.push({
            productName: y.productName,
            buyNum: y.buyNum,
            price: y.basePrice,
            imageUrl: y.specUuid,
            spec:eval(y.spec),
            state: y.state,
            uuid: y.uuid,
            firstMoney: y.firstMoney,
            payMoney: y.payMoney,
            productUuid: y.productUuid,
            productGiftList: y.productGiftList,
            description: y.discountModel && y.discountModel.description ? y.discountModel.description : '',
            badge: data.isSecKill ? '秒杀' : (y.suit ? '套装' : (y.discountModel ? (y.discountModel.giftNames && y.discountModel.giftNames[0] ? '赠品' : (y.discountModel.description ? '促销' : '')) : (m.discountModel && m.discountModel.length > 0 ? (m.discountModel[0].description ? '促销' : '') : '')))
          })
        })
        data.goods = goods
        // invoice & address
        let address = res.data.omam ? res.data.omam : ''
        let invoice = res.data.ordernaryInvoice
        data.address = address.address
        data.name = address.name
        data.mobile = address.mobile
        data.invoiceType = invoice ? (invoice.invoiceType == 2 ? '电子发票' : '增值税发票') : ''
        data.invoiceTitle = invoice ? invoice.invoiceTitle : ''
        // price
        data.payMoney = m.productMoney // 总金额
        data.freeMoney = m.freeMoney
        data.jfMoney = m.integralReduceMoney ? m.integralReduceMoney : '0.00'
        data.yfMoney = m.affixation ? m.affixation : '0.00'
        data.total = m.payMoney  // 合计 ，其实就是 实际支付金额
        data.buttonState = m.ucenterButton
            this.myInvoice= invoice
        this.data = data
      })
    }
  }
}
</script>
<style lang="less">
    .order-detail {
        .goods {
            height: 100%;
            .btnbox {
                border: none;
            }
        }
    }

</style>
