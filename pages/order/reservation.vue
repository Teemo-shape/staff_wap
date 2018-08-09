<template>
  <div class="reservation">
    <yd-navbar title="预约订单">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="cutLine"></div>
    <div class="recive_item" v-if="addressList!=''">
      <div class="recive_icon fl">
        <div class="iky-address"></div>
      </div>
      <div class="recive_main fl fs24">
        <div class="recive_man">
          <p>
            收货人：
            <span>{{addressList.consignee}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>{{addressList.mobile}}</span>
          </p>
        </div>
        <div class="recive_add">
          收获地址：{{addressList.area+addressList.address}}
        </div>
      </div>
      <div class="inAdd fr" @click="getAdd">
        <b class="iky-arrow-right"></b>
      </div>
    </div>
    <div class="recive_item_empty" v-else="addressList=''">
      <p class="address_empty fl">主人，您的收货地址为空，去设置一下吧~</p>
      <div class="inAdd fr" @click="getAdd">
        <b class="iky-arrow-right"></b>
      </div>
    </div>
    <!--商品-->
    <div class="product fs24">
      <div class="product_top">
        <div class="product_img fl">
          <a :href="'/other/'+this.productUuid">
            <img :src="centerPic">
          </a>
        </div>
        <div class="product_info fl">
          <a :href="'/other/'+this.productUuid" class="product_name">{{productName}}</a>
          <p class="product_price">
            <span>￥{{price}}</span>
          </p>
        </div>
        <div class="product_num fr">
          X
          <span>{{num}}</span>
        </div>
      </div>
    </div>
    <!--底部固定条-->
    <div class="submit-box">
      <ul>
        <li class="final_buyNum">
          共
          <span>{{num}}</span>
          件
        </li>
        <li class="total_price">
          <b>总计:</b>
          <span>￥{{(price-0).toFixed(2)}}</span>
        </li>
        <li class="submit_order" @click="saveOrder">
          提交预约
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  head() {
    return {
      title: 'TCL官网-订单预约',
    }
  },
  data() {
    return {
      params: {}, productId: '', from: '', skuNo: '', storeNote: '', submodelUuid: '', rushBuyBeginTime: '', addressList: [], addressUuid: '',
      centerPic: '', productName: '', price: '', num: 1, productUuid: '',
    }
  },
  mounted() {
    this.productId = this.$route.query.productId
    this.from = this.$route.query.from || 'reservation'
    this.num = this.$route.query.buyNum

    this.skuNo = this.$route.query.skuNo
    this.storeNote = this.$route.query.storeNote
    this.submodelUuid = this.$route.query.submodelUuid
    this.rushBuyBeginTime = this.$route.query.rushBuyBeginTime

    if (!this.productId) {
      this.$dialog.alert({ mes: '参数丢失，页面加载失败' });
      return false;
    }
    this.getUserAddress()
    this.detail()
  },
  methods: {
    getUserAddress() {
      this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', {}, res => {
        if (res.data && res.data.length > 0) {
          var add = localStorage.getItem('chooseAddress')
          if (add) {
            add = JSON.parse(add)
            for (var i = 0; i < res.data.length; i++) {
              if (add.uuid == res.data[i].uuid) {
                this.addressList = add
                this.addressUuid = add.uuid
                break;
              } else {
                this.addressList = res.data.filter(o => o.isDefault == '1')[0];
                if (!this.addressList) {
                  this.addressList = res.data[0]
                }
                this.addressUuid = this.addressList.uuid
              }
            }
          } else {
            this.addressList = res.data.filter(o => o.isDefault == '1')[0];
            if (!this.addressList) {
              this.addressList = res.data[0]
            }
            this.addressUuid = this.addressList.uuid
          }
        }
      })
    },
    detail() {
      this.$http.get('/front/product/toProductKuyu', {
        uuid: this.productId,
        terminalType: '02'
      }, res => {
        if (res.code == '0') {
          var pro = res.productModel.productMain;
          this.centerPic = res.front.centerPicture
          this.productName = pro.productName
          this.price = (res.productSkuPrice - 0).toFixed(2)
          this.productUuid = res.productSku.productUuid
        } else if (res.code == '-2') {
          this.$dialog.confirm({
            mes: '您已经抢购过了，请购买其他商品',
            opts: [
              {
                txt: '确定',
                color: false,
                callback: () => {
                  this.$router.push({ path: '/' })
                }
              }]
          })
        } else {
          this.$dialog.confirm({
            mes: '该预约不存在！',
            opts: [
              {
                txt: '确定',
                color: false,
                callback: () => {
                  this.$router.push({ path: '/' })
                }
              }]
          })
        }
      })
    },

    getAdd() {
      var data = this.$route.query
      this.$utils.setCookie('queryParams', JSON.stringify(data))
      this.$router.push({ path: '/my/address?from=reservation' })
    },
    saveOrder() {
      if (!this.addressList || !this.addressUuid) {
        this.$dialog.alert({ mes: '请选择收货地址！' })
        return false;
      }
      var params = {
        skuNo: this.skuNo,
        productId: this.productId,
        buyNum: this.num,
        area: this.addressUuid,
        storeNote: this.storeNote,
        submodelUuid: this.submodelUuid,
        rushBuyBeginTime: this.rushBuyBeginTime,
        checkArea: this.addressUuid
      }

      this.$http.post('/reserve/createReserveOrderKuyu', params, res => {
        if (res.code == '0') {
          this.$dialog.confirm({
            mes: '恭喜你，预约成功!',
            opts: [{
              txt: '确定', color: false, callback: () => {
                this.$router.push({ path: '/order/reservationOk' })
              }
            }]
          })
        } else {
          this.$dialog.alert({
            mes: '预约失败，同一帐号只能预约同一商品一次!'
          })
        }
      })
    },
  }
}
</script>

