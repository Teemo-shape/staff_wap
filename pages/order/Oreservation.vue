<template>
  <div class="Oreservation">
    <yd-navbar title="抢购订单">
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
            <span>{{addressList.consignee}}</span>&nbsp;&nbsp;&nbsp;&nbsp
            <span>{{addressList.mobile}}</span>
          </p>
        </div>
        <div class="recive_add">
          收获地址：{{addressList.area+addressList.address}}
        </div>
      </div>
      <div class="inAdd fr">
      </div>
    </div>
    <!-- <div class="recive_item_empty" v-else="addressList=''">
                            <p class="address_empty fl">主人，您的收货地址为空，去设置一下吧~</p>
                            <div class="inAdd fr" @click="getAdd">
                              <b class="iky-arrow-right"></b>
                            </div>
                          </div> -->
    <!--商品-->
    <div class="product fs24">
      <div class="product_top">
        <div class="product_img fl">
          <img :src="centerPic">
        </div>
        <div class="product_info fl">
          <p class="product_name">{{productName}}</p>
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
    <div class="invoice">
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">
            发票类型
          </span>
          <span slot="right">
            <b :class="{'iky-checked':isEleActive,'iky-uncheck':!isEleActive}" @click="changeEleActive"></b>
            <span>电子发票</span>
            <b :class="{'iky-checked':isAddActive,'iky-uncheck':!isAddActive}" @click="changeAddActive"></b>
            <span>增值税发票</span>
          </span>
        </yd-cell-item>
      </yd-cell-group>
      <span class="elevoice fr" @click="invoiceVisible=true;">
        <yd-icon name="question"></yd-icon>
        什么是电子发票
      </span>
    </div>
    <div class="elevoice_title" v-show="isEleActive==true">
      <yd-cell-group>
        <yd-cell-item>
          <input maxlength="30" type="text" slot="left" v-model='eleTitle' placeholder="请输入发票抬头"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="20" type="text" slot="left" v-model='electron_code' placeholder="请输入纳税人识别号/统一社会信用代码 (企业选填) "></input>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <div class="elevoice_title addvalue_voice" v-show="addVoiceVisible==true">
      <yd-cell-group>
        <yd-cell-item>
          <input maxlength="30" type="text" slot="left" v-model='companyName' placeholder="请输入发票抬头"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="20" type="text" slot="left" v-model='code' placeholder="请输入纳税人识别号"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="30" required type="text" slot="left" v-model='address' placeholder="请输入注册地址"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="13" type="text" slot="left" v-model='registerMobile' placeholder="请输入注册电话"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="15" type="text" slot="left" v-model='bankName' placeholder="请输入开户银行"></input>
        </yd-cell-item>
        <yd-cell-item>
          <input maxlength="19" minlength="16" type="text" slot="left" v-model='bankNo' placeholder="请输入银行账户"></input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">
            <yd-button type="hollow" @click.native="saveAddvoice">确认</yd-button>
          </span>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <yd-popup v-model="invoiceVisible" position="bottom" height="61%">
      <div class="elevoice_doc">
        <ul>
          <li> </li>
          <li>什么是电子发票</li>
          <li> </li>
        </ul>
        <p>
          感谢您选择电子发票，电子发票是税局认可的有效付款凭证，其法律效力、基本用户及使用规定同纸质发票，可作为用户维权、保修的有效凭据。如需要纸质发票可自行下载打印；
        </p>
        <p>
          您在订单详情的“发票信息”栏可查看、下载您的电子发票；
        </p>
        <div class="Iknow" @click="invoiceVisible=false;">我知道了</div>
      </div>
    </yd-popup>
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
          <span>￥{{price}}</span>
        </li>
        <li class="submit_order" @click="saveOrder">
          提交订单
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  head() {
    return {
      title: 'TCL官网-请购订单',
    }
  },
  data() {
    return {
      params: {},
      Oparams: {},
      productId: '',
      from: '',
      skuNo: '',
      storeNote: '',
      submodelUuid: '',
      rushBuyBeginTime: '',
      addressList: [],
      addressUuid: '',

      centerPic: '',
      productName: '',
      price: '',
      num: 1,


      reserveOrderId: '',
      productUuid: '',
      // skuNo:'',
      invoiceUuid: '',
      invoiceCate: 2,
      addressId: '',

      eleuuid: '',
      eleTitle: '',
      electron_code: '',
      companyName: '',
      code: '',
      address: '',
      registerMobile: '',
      bankName: '',
      bankNo: '',
      adduuid: '',
      checkArea: '',
      area: '',
      // invoiceUuid:'',

      radio4: '电子发票',
      invoiceVisible: false,
      //        buyNum:1,
      isEleActive: true,
      isAddActive: false,
      addVoiceVisible: false,
    }
  },
  mounted() {
    this.reserveOrderId = this.$route.query.reserveOrderId
    this.skuNo = this.$route.query.skuNo
    this.productUuid = this.$route.query.productUuid

    this.getPerOrder()
    this.geteleList()
    this.getaddList()
  },
  methods: {
    //获取电子发票
    geteleList() {
      this.$http.post('/usercenter/electronInvoice/getByCustomerUuid', {}, res => {
        if (res.code == '0') {
          if (res.data && res.data.length > 0) {
            this.eleTitle = res.data[0].titleContent
            this.electron_code = res.data[0].code
            this.eleuuid = res.data[0].uuid
          }
        }
      })
    },
    //增值税发票
    getaddList() {
      this.$http.post('/usercenter/addInvoice/getByCustomerUuid', {}, res => {
        if (res.code == '0') {
          if (res.data && res.data.length > 0) {
            this.companyName = res.data[0].companyName
            this.code = res.data[0].code
            this.address = res.data[0].address
            this.registerMobile = res.data[0].registerMobile
            this.bankName = res.data[0].bankName
            this.bankNo = res.data[0].bankNo
            this.adduuid = res.data[0].uuid
          }
        }
      })
    },
    getPerOrder() {
      this.Oparams = {
        reserveOrderId: this.reserveOrderId,
        productUuid: this.productUuid,
        skuNo: this.skuNo,
      }
      this.Oparams['terminalType'] = '02'
      this.$http.post('/usercenter/reserveorder/perserveBuyKuyu', this.Oparams, res => {
        if (res.code == '0') {
          if (res.data) {
            var data = res.data
            this.addressId = data.addressId
            if (data.addressList && data.addressList.length > 0) {
              this.addressList = data.addressList.filter(o => o.uuid == this.addressId)[0]
              if (!this.addressList) {
                this.$dialog.alert({
                  mes: '预约地址丢失!', callback: () => {
                    this.$router.back()
                  }
                })
              } else {
                this.addressUuid = this.addressList.uuid
              }
            } else {
              this.$dialog.alert({
                mes: '预约地址丢失!', callback: () => {
                  this.$router.back()
                }
              })
            }
            this.centerPic = data.front.samllPicture
            this.productName = data.m.productMain.productName
            this.price = (data.m.shopPrice - 0).toFixed(2)
            this.num = data.subModel.buyNum
          }
        } else if (res.code == '-2') {
          this.$dialog.alert({
            mes: '您已经抢购过了，请购买其他商品!', callback: () => {
              this.$router.push({ 'path': '/' })
            }
          })
        } else {
          this.$dialog.alert({
            mes: '该预约不存在！', callback: () => {
              this.$router.push({ 'path': '/' })
            }
          })
        }
      })
    },
    changeEleActive() {
      this.invoiceCate = 2
      if (this.isAddActive) {
        this.isAddActive = false
        this.isEleActive = true;
      } else {
        this.isEleActive = true;
      }
      this.addVoiceVisible = false;
      //        this.isEleActive = !this.isEleActive;
    },
    changeAddActive() {
      this.invoiceCate = 3
      if (this.isEleActive) {
        this.isEleActive = false
        this.isAddActive = true;
      } else {
        this.isAddActive = true;
      }
      this.addVoiceVisible = true;
      //        this.isAddActive = !this.isAddActive;
    },
    saveAddvoice() {
      if (this.valideInvoice()) {
        this.addVoiceVisible = false;
      }
    },
    valideInvoice() {
      var validData = [
        { value: this.companyName, errTip: '发票抬头可输入中文、字母、数字，不可输入特殊符号。30个字符以内', pattern: /^[\u4e00-\u9fa5\a-zA-Z0-9]{1,30}$/ },
        { value: this.code, errTip: '纳税人识别号可输入数字、字母，不可输入文字、特殊符号，15-20位', pattern: /^[0-9a-zA-Z]{15,20}$/ },
        { value: this.address, errTip: '请输入注册地址!', pattern: /\S/ },
        { value: this.registerMobile, errTip: '请输入正确的注册电话!', pattern: /(^1[34578][0-9]{9}$)|(^0\d{2,3}-?\d{7,8}$)/ },
        { value: this.bankName, errTip: '开户银行：文字，数字,字母输入，不可输入特殊符号，15个字符以内', pattern: /^[\u4e00-\u9fa5\a-zA-Z0-9]{1,15}$/ },
        { value: this.bankNo, errTip: '请输入正确的银行账户,数字16-19位', pattern: /^\d{16,19}$/ },
      ]
      let valide = true
      validData.map((x) => {
        if (!x.pattern.test(x.value)) {
          valide = false
          this.$dialog.alert({ mes: x.errTip })
          return false;
        }
      })
      if (!valide) {
        return false
      } else {
        return true;
      }
    },
    saveOrder() {
      if (!this.addressList || !this.addressUuid) {
        this.$dialog.alert({ mes: '商品预约的地址丢失！' })
        return false;
      }
      if (this.invoiceCate == 3 && !this.valideInvoice()) {  // 验证增值税发票
        return false;
      }
      if (this.invoiceCate == 2) {
        if (this.electron_code !== '') {
          let reg = /^[0-9a-zA-Z]{15,20}$/
          if (!reg.test(this.electron_code)) {
            this.$dialog.alert({ mes: '纳税人识别号可输入数字、字母，不可输入文字、特殊符号，15-20位(可不填)' })
            return false;
          }
        }
        var reg = /^[\u4e00-\u9fa5\a-zA-Z0-9]{1,30}$/
        if (!reg.test(this.eleTitle)) {
          this.$dialog.alert({ mes: '发票抬头可输入中文、字母、数字，不可输入特殊符号。30个字符以内' })
          return false;
        }
      }


      var params = {}
      if (this.invoiceCate == "2") {
        params.electron_titleContent = this.eleTitle;
        params.electron_code = this.electron_code;
        params.electron_invoiceContent = '商品明细';
        params.address = this.addressList.area;
        params.invoiceUuid = this.eleuuid;
      } else if (this.invoiceCate == "3") {
        params.invoiceUuid = this.adduuid;
        params.add_companyName = this.companyName
        params.add_invoiceContent = '商品明细';
        params.add_code = this.code
        params.add_address = this.address;
        params.add_registerMobile = this.registerMobile;
        params.add_bankName = this.bankName;
        params.add_bankNo = this.bankNo;
        params.address = this.address;
      }
      params.invoiceCate = this.invoiceCate;
      params.reserveOrderId = this.reserveOrderId;
      params.payType = '1';
      params.ranNum = Math.random();
      params.recommender = this.$utils.getCookie('tkcid')
      params['terminalType'] = '02';

      params = JSON.stringify(params)
      this.$http.post('/usercenter/reserveorder/saveReserOrderKuyu', { paramStr: params }, res => {
        if (res.code == '0') {
          this.$router.push({ path: '/order/pay', query: { 'orderId': res.data.payOrderId, 'type': '2' } })
        } else {
          this.$dialog.alert({ mes: '商品库存不足或您已经抢购过' });
        };
      })
    },
  }
}
</script>

