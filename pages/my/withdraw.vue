<template>
  <div class="my-info">
    <yd-navbar title="退货/退款管理">
      <router-link to="/my/orders" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <yd-cell-group title="">
      <yd-cell-item>
        <span slot="left">退货/退款管理</span>
        <!-- <span slot="right">右边内容一</span> -->
      </yd-cell-item>
      <!-- <p class="refund_tip">
                        尊敬的用户，感谢您在网上申请维修服务，请详细登记您的个人信息和服务请求，我们将尽快与您联系，谢谢！
                    </p> -->
      <!-- <yd-cell-item>
                        <span slot="left">产品信息</span>
                    </yd-cell-item> -->
      <yd-cell-item>
        <span slot="left">
          购买时间: {{dataList.orderTime}}
        </span>
        <span slot="right"></span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          订单号：{{dataList.orderId}}
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          发起退款时间：{{dataList.applyTime}}
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          售后状态：{{dataList.statusName}}
        </span>
      </yd-cell-item>
      <yd-cell-item class="pro_detail">
        <span slot="left">
          <a class="pro_img" :href="'/other/'+detail.productUuid">
            <img :src="od.specUuid" alt="">
          </a>
          <a class="pro_name" :href="'/other/'+detail.productUuid">{{detail.productName}}</a>
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          申请数量：{{od.buyNum}}
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          交易金额：{{orderMain.payMoney}} 元
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">
          退款金额：{{orderMain.settleMoney}} 元
        </span>
      </yd-cell-item>
      <yd-cell-item v-if="dataList.state=='1'">
        <span slot="left">
          退款原因：
          <span>{{reason}}</span>
        </span>
        <span slot="right"></span>
      </yd-cell-item>
      <yd-cell-item v-if="dataList.state=='1'">
        <span slot="left">
          详细描述：
        </span>
        <yd-textarea slot="right" v-model="des" :readonly="true"></yd-textarea>
      </yd-cell-item>
    </yd-cell-group>
    <div :class="reason?'canSubmit':'submit'" @click="submit" v-if="dataList.state=='1'">
      <p>取消申请</p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'T严选商城-退货/推客管理',
    }
  },
  data() {
    return {
      param: {},
      // orderMain: {},
      // orderDetail: {},
      backReasons: [
        '与商家已达成协议',
        '问题已解决',
        '不想申请',
      ],
      des: '',
      reason: '',
      dataList: {},
      detail: {},
      serviceUuid: '',
      orderDetailId: '',
      od: {},
      orderMain: {},
    }
  },
  mounted() {
    this.param.nowPage = '1'
    this.param.pageShow = '5'
    this.param.nowChooseTab = ''
    this.param.searchName = this.$route.query.orderId
    this.getData()
  },
  methods: {
    getData() {
      this.$http.post('/usercenter/afterSale/listKuyu', this.param, res => {
        if (res.code == '0') {
          this.dataList = res.data.dataList[0]
          this.serviceUuid = this.dataList.uuid;
          this.detail = this.dataList.detailModelList[0];
          this.orderDetailId = this.detail.detailUuid;
          this.od = this.detail.od
          this.orderMain = this.dataList.orderMain;

          this.reason = this.dataList.reason;
          this.des = this.dataList.description;
        }
      })
    },
    submit() {
      // if (!this.reason) {
      //     return false;
      // }

      var refund = {
        serviceUuid: this.serviceUuid,
        orderDetailId: this.orderDetailId,
        cancelContent: this.des,
        reason: this.reason
      }
      this.$http.get('/usercenter/afterSale/cancelKuyu', refund, res => {
        if (res.code == '0') {
          this.$dialog.alert({
            mes: '取消成功！', callback: () => {
              this.$router.push({ path: '/my/orders' })
            }
          })

        }
      })
    },
  },
}
</script>