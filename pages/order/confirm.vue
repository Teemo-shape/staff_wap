<template>
  <div class="confirm">
    <div v-show="!fpShow">
      <yd-navbar title="确认订单">
      <span @click="goBack()" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </span>
      </yd-navbar>
      <div class="cutLine"></div>
      <div class="recive_item" v-if="addressList!=''" @click="getAdd">
        <div class="recive_main fl">
          <div class="recive_man">
            <p style="padding-left: .625rem">
              收货人：
              <span>{{addressList.consignee}}</span>&nbsp;&emsp;
              <span>{{addressList.mobile}}</span>
            </p>
          </div>
          <div class="recive_add" style="padding-left: .625rem;">
              <i class="iky-address" style="text-indent: -.625rem;
    display: inline-block;"></i>收货地址：{{addressList.area+addressList.address}}
          </div>
          <div class="canSale" v-if="NoStock">
            抱歉，部分商品或者赠品暂时缺货，请选择其他送货地区或者购买其他商品
          </div>
        </div>
        <div class="inAdd fr">
          <b class="iky-arrow-right"></b>
        </div>
      </div>
      <div class="recive_item_empty" v-else-if="addressList==''">
        <p class="address_empty fl">主人，您的收货地址为空，去设置一下吧~</p>
        <div class="inAdd fr" @click="getAdd">
          <b class="iky-arrow-right"></b>
        </div>
      </div>
      <!--商品-->
      <div class="product fs24" v-show="!item.suitUuid" v-for="(item,k) in detailModelList" :key="k">
        <div class="product_top">
          <div class="product_img fl">
            <a :href="'/tv/'+item.productUuid">
              <img :src="item.productImgUrl || item.productImg ||imgUrl||''">
            </a>
          </div>
          <div class="product_info fl">
            <a :href="'/tv/'+item.productUuid" class="product_name">{{item.productName}}</a>
            <span class="product_spec" v-for="(val,index) in item.attrValues" :key="index">
            {{val.value}}
            </span>
            <p class="product_price">
              {{(parseFloat(item.totalPrice)/parseInt(item.buyNum)==parseFloat(item.staffPrice))?'员工价':'亲友价'}}
              ¥ <span class="price_int">{{item.nowPrice!==0?parseInt(item.nowPrice):parseInt(item.basePrice)}}</span>
              <span class="price_float">.{{item.nowPrice!==0?item.nowPrice.toFixed(2).split('.')[1]:item.basePrice.toFixed(2).split('.')[1]}}</span>
              <span class="buy_num">×{{item.buyNum}}</span>
            </p>
            <!--<p class="product_coupe" v-show="item.attrAndValue==promotionSkus&&!isKill">-->
              <!--<span>{{cxName.promotionName}}</span>-->
            <!--</p>-->
            <!--<p v-if="ispreSales">定金：￥{{firstPay}}</p>-->
            <!--<p class="product_kill" v-if="isKill==true">秒杀</p>-->
            <!--<p class="product_suit" v-if="item.suitUuid == suitUuid">(套装：{{suitName}})</p>-->
            <!--<p v-if="isKill">{{exitsGoods?'有货':'无货'}}</p>-->
            <!--<p v-else-if="ispreSales">{{exitsGoods?'有货':'无货'}}</p>-->
            <!--<p v-else v-for="(val,key) in stockMap" :key="key">-->
              <!--<span v-if="item.productUuid == key">{{val}}</span>-->
            <!--</p>-->
          </div>
        </div>
        <div class="mysum">
          <span class="small">小计: </span><span class="red-wrap">&yen;&nbsp;<strong><span lass="price_int">{{parseInt(item.totalPrice)}}</span>
          <span class="price_float">.{{item.totalPrice.indexOf('.')>0?parseFloat(item.totalPrice).toFixed(2).split('.')[1]:'00'}}</span></strong></span>
        </div>
      </div>
      <div class="jifen" v-show="useMaxIntegral>0">
        <yd-cell-group>
          <yd-cell-item>
      <span slot="left">
      可用
      <span class="jifen_total">{{useMaxIntegral}}</span>积分抵扣
      <span class="jifen_chang">￥{{jfMoney}}</span>&nbsp;&nbsp;
      <yd-switch v-model="jfSwitch"></yd-switch>
      </span>
            <span slot="right">
      <span class="jifen_chang">-￥{{jfSwitch?jfMoney:0}}</span>
      </span>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="invoice">
        <yd-cell-group>
          <yd-cell-item>
          <span slot="left">
            发票
          </span>
            <span slot="right" @click="fpShow=true">
            {{(invoiceCate == 2?'电子发票'+(faT=='personal'?'个人':'企业'):'增值税发票')}}
                <i class="icon iconfont-tcl icon-xiangyou"></i>
          </span>
          </yd-cell-item>
        </yd-cell-group>
        <!--<span class="elevoice fr" @click="invoiceVisible=true;">-->
        <!--<yd-icon name="question"></yd-icon>-->
        <!--什么是电子发票-->
        <!--</span>-->
      </div>

      <!--留言-->
      <div class="message">
        <yd-cell-group>
          <yd-cell-item>
          <span slot="left">
            买家留言
          </span>
            <input maxlength="30" slot="right" placeholder="选填:对本次交易的补充说明" v-model="note"></input>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <!--<yd-popup v-model="invoiceVisible" position="bottom" height="60%">-->
      <!--<div class="elevoice_doc">-->
      <!--<ul>-->
      <!--<li> </li>-->
      <!--<li>什么是电子发票</li>-->
      <!--<li> </li>-->
      <!--</ul>-->
      <!--<p>-->
      <!--感谢您选择电子发票，电子发票是税局认可的有效付款凭证，其法律效力、基本用户及使用规定同纸质发票，可作为用户维权、保修的有效凭据。如需要纸质发票可自行下载打印；-->
      <!--</p>-->
      <!--<p>-->
      <!--您在订单详情的“发票信息”栏可查看、下载您的电子发票；-->
      <!--</p>-->
      <!--<div class="Iknow" @click="invoiceVisible=false;">我知道了</div>-->
      <!--</div>-->
      <!--</yd-popup>-->
      <div class="price">
        <p>
          <span class="left">商品总价</span>
          <span class="right">¥{{cartManager.totalMoney}}</span>
        </p>
        <p>
          <span class="left">运费</span>
          <span class="right">¥{{(cartManager.affix-0).toFixed(2)}}</span>
        </p>
        <p>
          <span class="left">优惠促销</span>
          <span class="right">-¥{{cartManager.reduceMoney}}</span>
        </p>
      </div>
      <!--底部固定条-->
      <div class="submit-box">
        <ul>
          <!--<li class="final_buyNum">-->
          <!--共-->
          <!--<span>{{pcount}}</span>-->
          <!--件-->
          <!--</li>-->
          <!--<li class="total_price" v-if="jfSwitch==true">-->
          <!--<b>应付金额:</b>-->
          <!--<span>￥{{(paymoney-jfMoney-0).toFixed(2)}}</span>-->
          <!--</li>-->
          <li v-if="NoStock" class="submit_order_noStack">
            确定下单
          </li>
          <li v-else class="submit_order" @click="saveOrder">
            确定下单
          </li>
          <li class="total_price">
            应付金额:
            <span>￥{{(paymoney-0).toFixed(2)}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--发票-->
    <div class="fapiao" v-show="fpShow">
      <yd-navbar title="发票信息">
      <span @click="fpShow=false" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </span>
      </yd-navbar>
      <div class="sel">
        <!--<b :class="{'iky-checked':isEleActive,'iky-uncheck':!isEleActive}" @click="changeEleActive"></b>-->
        <span :class="{'on':isEleActive}" @click="changeEleActive">电子发票</span>
        <!--<b :class="{'iky-checked':isAddActive,'iky-uncheck':!isAddActive}" @click="changeAddActive"></b>-->
        <span :class="{'on':isAddActive}" @click="changeAddActive">增值税发票</span>
      </div>
      <div class="type" v-show="isEleActive==true">
        <strong>发票类型</strong>
        <ul>
          <li :class="{'on':faT=='personal'}" @click="toggleT('personal')">个人</li>
          <li :class="{'on':faT=='enterprise'}" @click="toggleT('enterprise')">企业</li></ul>
        <p>电子普通发票与纸质普通发票具有同等法律效力，可作为售后维权凭证、支持报销入账</p>
      </div>
      <div class="elevoice_title" v-show="isEleActive==true">
        <yd-cell-group>
          <strong>发票抬头</strong>
          <yd-cell-item>
            <input maxlength="30" type="text" slot="left" v-model='eleTitle' placeholder="请输入发票抬头"></input>
          </yd-cell-item>
          <strong v-if="faT=='enterprise'">纳税人识别号</strong>
          <yd-cell-item v-if="faT=='enterprise'">
            <input maxlength="20" type="text" slot="left" v-model='electron_code' placeholder="请输入纳税人识别号/统一社会信用代码 (企业选填) "></input>
          </yd-cell-item>
          <yd-cell-item>
          <span slot="left">
            <yd-button type="hollow" @click.native="saveEle">确认</yd-button>
          </span>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="elevoice_title addvalue_voice" v-show="addVoiceVisible==true" style="margin-bottom: 0">
        <yd-cell-group>
          <strong>发票抬头</strong>
          <yd-cell-item>
            <input maxlength="30" type="text" slot="left" v-model='companyName' placeholder="请输入发票抬头"></input>
          </yd-cell-item>
          <strong>纳税人识别号</strong>
          <yd-cell-item>
            <input maxlength="20" type="text" slot="left" v-model='code' placeholder="请输入纳税人识别号"></input>
          </yd-cell-item>
          <strong>注册地址</strong>
          <yd-cell-item>
            <input maxlength="30" required type="text" slot="left" v-model='address' placeholder="请输入注册地址"></input>
          </yd-cell-item>
          <strong>注册电话</strong>
          <yd-cell-item>
            <input maxlength="13" type="text" slot="left" v-model='registerMobile' placeholder="请输入注册电话"></input>
          </yd-cell-item>
          <strong>开户银行</strong>
          <yd-cell-item>
            <input maxlength="15" type="text" slot="left" v-model='bankName' placeholder="请输入开户银行"></input>
          </yd-cell-item>
          <strong>开户账号</strong>
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
    </div>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: 'T严选商城-订单确认',
      }
    },
    data() {
      return {
        param: {},
        yhm_code: '',//优惠码
        terminalType: '02',
        controlNum: 0,
        jfSwitch: false, //积分开关
        invoiceVisible: false,
        //        buyNum:1,
        isEleActive: true,
        isAddActive: false,
        addVoiceVisible: false,

        addressList: [],
        addressUuid: '', //地址
        exitsGoods: true, //是否有货
        cxName: [], //促销
        reduceMoney: '', //促销减钱
        pName: '',//满减之类的
        promotionSkus: [],//促销sku

        mzgiftName: [], //满赠礼品
        attrValues: [], //商品属性
        allAffix: 0, //运费
        firstPay: 0,//定金
        suitUuid: [],//套装
        suitName: '',//套装名
        suitStock: 0,//套装库存

        isKill: false, //秒杀
        promotionUuid: '',
        skuNo: '',
        areaId: '',



        ispreSales: false,//是否预付定金
        pIds: '',
        attrIds: '',
        buyNum: 1,
        willType: '',
        ordertype: 0,

        useMaxIntegral: 0,//最多可使用积分抵现
        olduseMaxIntegral: 0,

        integral: 0,//积分数
        jfUuid: '',//积分
        percentage: 1,//底线百分比
        proportion: 1,//抵现比例  积分数量
        proportion2: 1,//抵现比例  人民币数量
        jfMoney: 0,//积分减去的钱
        oldMoney: 0,//时时价格

        iscoupon: false, //优惠券
        couponName: '',
        storeUuid: '',
        couponMoney: 0,//优惠券减去的钱
        denomination: 0, //优惠码减去的钱

        note: '',//留言
        noteStoreUuid: [], //商户id
        pcount: '',//件数
        paymoney: '',//付款金额
        cartuid: '',

        //发票信息
        invoiceCate: 2, //发票类型
        eleuuid: '', //电子发票uuid
        eleTitle: '', //电子发票抬头
        electron_code: '',//电子发票纳税人识别号
        companyName: '', //增值税发票抬头
        code: '',//纳税人识别号
        address: '', //注册地址
        registerMobile: '', //注册电话
        bankName: '', //开户银行
        bankNo: '', //银行账户
        adduuid: '',
        checkArea: '',
        area: '',
        jifenPromotionUUID: '',
        integralReduceNum: '',
        totalMoneyShow: '',
        detailModelList: [],
        totalmoney: '',
        products: [],
        gift: '',


        items: [],   //小熊客户

        imgUrl: '',//预付定金图片
        suitList: [], //套装重组数据
        isGift: false,//是否有单品赠
        NoStock: false,  //没有库存
        stockMap: '',  //库存
        cartManager:'',
        fpShow:false,
        faT:'personal'
      }
    },
    created() {
      this.pIds = this.$route.query.pIds
      this.attrIds = this.$route.query.attrIds
      this.attrIds = this.$route.query.attrIds
      this.buyNum = this.$route.query.buyNum
      this.willType = this.$route.query.willType

      this.promotionUuid = this.$route.query.promotionUuid
      this.skuNo = this.$route.query.skuNo
      this.areaId = this.$route.query.areaId

      var data = this.$route.query
      if (data) {
        this.$utils.setCookie('queryParams', JSON.stringify(data))
      }
    },
    mounted() {
      this.sortFun()
      this.geteleList()
      this.getaddList()
      //this.getLocal()
    },
    methods: {
      // link() {
      //   this.$utils.setCookie('his', window.location.href);
      // },
      /*getLocal() {
        if (this.$utils.getCookie('jfAndNote')) {
          let j = JSON.parse(this.$utils.getCookie('jfAndNote'))
          this.jfSwitch = j.jfSwitch
          this.note = j.note
        }
      },*/
      sortFun() { //判断类型
        if (this.promotionUuid && this.skuNo) { //秒杀
          this.isKill = true
          this.getSecKillProduct()
        } else if (this.pIds && this.attrIds) { //预付定金
          this.ispreSales = true
          this.getpresaleProduct()
        } else { //普通
          this.getBalance();
        }
      },
      //秒杀订单
      getSecKillProduct() {
        this.$http.get('/front/product/fastBuyLimitProduct', {
          skuNo: this.skuNo,
          promotionUuid: this.promotionUuid
        }, res => {
          if (res) {
            this.getData(res)
            this.seckillHasGoods({
              productSku: this.skuNo,
              promotionUuid: this.promotionUuid,
              addressUuid: this.addressUuid
            })
            this.paymoney = res.cartManager.detailModelList[0].totalPrice
            this.cartuid = res.cartManager.storeUuid;
            this.param['affix_' + this.cartuid] = res.cartManager.affix || 0;
            // params['shipType_' + cartuid] = res.cartManager.storeUuid;
            this.param['cartTotal_' + this.cartuid] = res.orderTotalMoney;
            this.param['storeReduce_' + this.cartuid] = res.cartManager.reduceMoney || 0;
            this.param['hipType_' + this.cartuid] = 1;
            this.param.productBuyNum = 1;
            this.param.promotionUuid = this.promotionUuid;
            this.param.productSku = this.skuNo;
          } else {

          }

        })
      },
      //预售订单
      getpresaleProduct() {
        var add = localStorage.getItem('chooseAddress')
        var preParams = {
          dealerBcustomerUuid: '',
          pIds: this.pIds,
          buyNum: this.buyNum,
          attrIds: this.attrIds,
          chooseCod: '',
          willType: 2,
          terminalType: '02',
          addressUuid: add?JSON.parse(add).uuid:''
        }
        this.$http.post('/front/product/presaleProductToOrder', preParams, res => {
          if (res) {
            var data = res.retData
            this.getData(res.retData)
            this.hasGoods({
              pIds: this.pIds,
              attrIds: this.attrIds,
              buyNum: this.buyNum,
              willType: 2,
              orderType: 'reserve',
              reserveUuid: res.retData.preSale.uuid,
              addressUuid: this.addressUuid
            })
          if(this.buyNum>1){
            this.paymoney = data.preSale.firstCost && data.preSale.firstCost - 0 > 0 ? data.preSale.firstCost* this.buyNum: data.orderTotalMoney; //付款金额
          }else{
            this.paymoney = data.preSale.firstCost && data.preSale.firstCost - 0 > 0 ? data.preSale.firstCost: data.orderTotalMoney; //付款金额
          }

            this.param.productUuid = data.pIds;
            this.param.buyNum = this.buyNum;
            this.param.productBuyNum = this.buyNum;
            this.param.jifenPromotionUUID = '';
            this.param.attrIds = data.attrIds;
            this.param.willType = '2'
            this.param.pIds = data.pIds;
            if (data.preSale) {
              this.cartuid = data.preSale.storeUuid;
              this.param['affix_' + this.cartuid] = data.cartManager.affix || 0;
              this.param['storeReduce_' + this.cartuid] = data.cartManager.reduceMoney || 0;
              this.param['storePromotion_' + this.cartuid] = data.preSale.uuid;
            }
          } else {

          }
        })
      },
      //普通订单
      getBalance() {
        this.$http.get('/order/toBalanceKuyu', { terminalType: this.terminalType }, res => {
          if (!res.cartManagerList || res.cartManagerList.length == 0) {
            this.$dialog.alert({
              mes: '您的购物车是空的或未选中任何商品!', callback: () => {
                this.$router.push({ 'path': '/cart' })
              }
            })
          }
          this.getData(res)
          this.hasGoods({
            addressUuid: this.addressUuid
          })
        })
      },
      //渲染数据
      getData(res) {
        this.allAffix = res.allAffix   //运费
        this.totalmoney = res.orderTotalMoney

        this.useMaxIntegral = res.useMaxIntegral;  //最大使用积分
        this.olduseMaxIntegral = res.useMaxIntegral;

        var jf = res.integralToNowModel && res.integralToNowModel.uuid || '';
        this.jifenPromotionUUID = jf;

        if (res.preSale) {   //预售
          this.ispreSales = true;
          if (res.preSale.firstCost && res.preSale.firstCost > 0)
            this.ordertype = 1;
        }

        //收获地址
        if (res.addressList && res.addressList.length > 0) {
           var add = localStorage.getItem('chooseAddress')
          if (add) {
            add = JSON.parse(add)
            for (var i = 0; i < res.addressList.length; i++) {
              if (add.uuid == res.addressList[i].uuid && add.consignee == res.addressList[i].consignee && add.mobile == res.addressList[i].mobile && add.area == res.addressList[i].area && add.address == res.addressList[i].address) {
                this.addressList = add
                this.addressUuid = add.uuid
                break;
              } else {
                this.addressList = res.addressList.filter(o => o.isDefault == '1')[0];
                if (!this.addressList) {
                  this.addressList = res.addressList[0]
                }
                this.addressUuid = this.addressList.uuid
              }
            }
          } else {
            this.addressList = res.addressList.filter(o => o.isDefault == '1')[0];
            if (!this.addressList) {
              this.addressList = res.addressList[0]
            }
            this.addressUuid = this.addressList.uuid
          }
        }




        if (res.cartManagerList && res.cartManagerList.length > 0) {
          this.products = [] //清空优惠券码参数
          this.noteStoreUuid = []  //清空留言用的商户uuid
          res.cartManagerList.map(m => {
            m.detailModelList.map(o => {
              //优惠券码参数
              this.products.push({
                productUuid: o.productUuid,
                productCost: o.totalretailPrice,
                storeUuid: m.storeUuid
              })
              //套装
              if (o.suitUuid) {
                this.param['productPrice_' + o.attrAndValue + '_' + o.suitUuid] = o.totalPrice
                this.param['productBasePrice_' + o.attrAndValue + '_' + o.suitUuid] = o.basePrice
                this.param['productNowPrice_' + o.attrAndValue] = o.nowPrice
                this.param['suitNum_' + o.suitUuid] = o.buyNum
              }
              else {
                this.param['productPrice_' + o.attrAndValue] = o.totalPrice
                this.param['productBasePrice_' + o.attrAndValue] = o.basePrice
                this.param['productNowPrice_' + o.attrAndValue] = o.nowPrice
                //                  this.param['productNum_'+o.suitUuid] = o.buyNum
              }
              //促销
              if (o.nowPromotion) {
                this.param['productDetail_' + o.attrAndValue] = o.nowPromotion
              }
              //礼品
              if (o.productGiftIds && o.productGiftIds.length > 0) {
                this.gift = o.productGiftIds.join(',')
                this.param['productGiftIds_' + o.attrAndValue] = this.gift
              }

            })
            //取商户id(用于留言)
            this.noteStoreUuid.push(m.storeUuid)
            //满减
            if (m.storePromotionsList) {
              m.storePromotionsList.map(i => {
                this.param['storeReduce_' + m.storeUuid] = m.reduceMoney
                this.param['storePromotion_' + m.storeUuid] = i.promotionUuid
              })
            }
            this.param['affix_' + m.storeUuid] = m.affix
            this.param['shipType_' + m.storeUuid] = 1
            this.param['cartTotal_' + m.storeUuid] = m.totalMoney
            this.param['storeReduce_' + m.storeUuid] = m.reduceMoney
          })
        }
        if (res.suitMap) { //套装
          this.suitUuid = []
          for (var key in res.suitMap) {
            this.suitUuid.push(res.suitMap[key])
            this.suitName = res.suitMap[key].name
            this.suitStock = res.suitMap[key].stock
          }
        }

        if (res.cartManager && res.cartManager.detailModelList.length > 0) {
          this.reduceMoney = res.cartManager.reduceMoney
          this.detailModelList = res.cartManager.detailModelList //只用单个商品用到,单品赠用到

          for (var i = 0; i < this.detailModelList.length; i++) {
            var d = this.detailModelList[i]
            if (d.productGiftLists && d.productGiftLists.length > 0) {
              this.isGift = true
              break
            } else {
              this.isGift = false;
            }
          }
          // this.detailModelList.map(o => {
          //   if (o.productGiftLists && o.productGiftLists.length > 0) {
          //     this.isGift = true
          //     return false;
          //   } else {
          //     this.isGift = false;
          //   }
          // })

          //套装数据重组(专用于套装)
          this.suitList = []
          var dl = res.cartManager.detailModelList
          var arr = []
          this.suitUuid.forEach((v1, i1, array1) => {
            var list = []
            dl.forEach((v2, i2, array2) => {
              if (v1.uuid == v2.suitUuid) {
                v2.suitName = v1.name //套装名
                list.push(v2)
              }
            })
            arr.push(list)
          })
          this.suitList = arr  //套装循环列表

          //小能客户
          this.detailModelList.forEach((v, i, arr) => {
            this.items[i] = {
              id: v.productUuid,
              count: v.buyNum
            }
          })

          var cx = res.cartManager.storePromotionsList //促销
          var mzgift = res.cartManager.productGiftLists //促销满赠的礼品

          if (!this.ispreSales && cx && cx.length > 0 && cx[0].promotionTypes) {
            this.cxName = cx[0];
            this.pName = this.getProType(cx[0].promotionTypes)
            this.promotionSkus = cx[0].promotionSkus
          }
          if (mzgift && mzgift.length > 0) { //订单赠品
            mzgift.map(m => {
              this.mzgiftName.push(m.productName)
            });
          }

        }

        if (this.ispreSales && res.cartManager.firstPay && res.cartManager.firstPay > 0) {//定金
          this.firstPay = res.cartManager.firstPay
          this.imgUrl = res.productModel.productImage.smallImageUrl
        }

        if (!(this.isKill || this.ispreSales)) {
          if (res.cartManager && res.cartManager.couponList && res.cartManager.couponList.length > 0) {
            var uuid = ''
            if (this.$utils.getCookie('chooseCoupon')) { //取本地优惠券(用户选择的优惠券)
              let o = JSON.parse(this.$utils.getCookie('chooseCoupon'))
              for (var i = 0; i < res.cartManager.couponList.length; i++) {
                if (o.uuid == res.cartManager.couponList[i].uuid) {  //本地存的必须是优惠券列表
                  this.iscoupon = true
                  this.couponName = o.couponTypeName
                  this.couponMoney = o.money;
                  this.storeUuid = o.storeUuid;
                  uuid = o.uuid
                  //必须使用优惠券,参数
                  this.param['storeCoupon_' + this.storeUuid] = uuid;
                  this.param['storeCouponReduce_' + this.storeUuid] = this.couponMoney;
                  break;
                } else { //取优惠券列表
                  this.iscoupon = true
                  var cList = res.cartManager.couponList
                  var arr = [];
                  cList.map(o => {
                    if (o.state === '1') {  //可用
                      arr.push(o.money)
                      this.sort(arr)  //优惠券排序
                      if (o.money === arr[arr.length - 1]) {  //取最大面值的优惠券
                        this.couponName = o.couponTypeName
                        this.couponMoney = o.money;
                        this.storeUuid = o.storeUuid;
                        uuid = o.uuid;
                      }
                    }
                  })
                  //必须使用优惠券,参数
                  this.param['storeCoupon_' + this.storeUuid] = uuid;
                  this.param['storeCouponReduce_' + this.storeUuid] = this.couponMoney;
                }
              }
            } else { //优惠券列表
              this.iscoupon = true
              var cList = res.cartManager.couponList
              var arr = [];
              cList.map(o => {
                if (o.state === '1') {  //可用
                  arr.push(o.money)
                  this.sort(arr)  //优惠券排序
                  if (o.money === arr[arr.length - 1]) {  //取最大面值的优惠券
                    this.couponName = o.couponTypeName
                    this.couponMoney = o.money;
                    this.storeUuid = o.storeUuid;
                    uuid = o.uuid;
                  }
                }
              })
              //必须使用优惠券,参数
              this.param['storeCoupon_' + this.storeUuid] = uuid;
              this.param['storeCouponReduce_' + this.storeUuid] = this.couponMoney;
            }
          } else {
            this.iscoupon = false
            this.couponName = ''
            this.couponMoney = ''
            this.storeUuid = ''
            this.param['storeCoupon_' + this.storeUuid] = ''
            this.param['storeCouponReduce_' + this.storeUuid] = ''
          }
        }



        if (res.integralToNowModel) {//积分
          var jf = res.integralToNowModel
          this.jfUuid = jf.uuid;
          this.proportion = jf.proportion;
          this.jfMoney = this.useMaxIntegral / this.proportion - 0
        }
        //数量
        this.pcount = this.ispreSales ? res.buyNum : (this.isKill ? 1 : res.real_total_num);
        //money
        this.paymoney = this.isKill ? res.cartManager.detailModelList[0].totalPrice : (this.ispreSales ? (res.preSale.firstCost && res.preSale.firstCost - 0 > 0 ? res.preSale.firstCost : res.orderTotalMoney) : res.cartManager.totalMoney);
        if (this.iscoupon) {
          this.paymoney = this.paymoney - this.couponMoney
        }
        this.cartManager = res.cartManager


        //小能客户
        var ntalkerparam = {
          cartprice: this.paymoney,
          items: this.items
        };
        if (typeof window !== 'undefined') {
          window.XNupdate({
            ntalkerparam: ntalkerparam
          })
        }

      },
      sort(array) { //数组排序
        for (var unfix = array.length - 1; unfix > 0; unfix--) {
          /*给进度做个记录，比到未确定位置*/
          for (var i = 0; i < unfix; i++) {
            if (array[i] > array[i + 1]) {
              var temp = array[i];
              array.splice(i, 1, array[i + 1]);
              array.splice(i + 1, 1, temp);
            }
          }
        }
      },
      goBack() {
        this.$utils.delCookie('jfAndNote')
        localStorage.removeItem('chooseAddress')
        this.$utils.delCookie('chooseCoupon')
        this.$router.push({ path: '/cart' })
      },
      //去优惠券列表
      goCoupon() {
        if (this.ispreSales || this.isKill) {
          return false;
        }
        let jfAndNote = {
          jfSwitch: this.jfSwitch,
          note: this.note
        }
        this.$utils.setCookie('jfAndNote', JSON.stringify(jfAndNote))

        this.$router.push({ path: '/my/coupon?from=confirm' })
      },
      //获取促销类型
      getProType(p) {
        if (!p) return '';
        var _p = '';
        p.indexOf('1') >= 0 && (_p += '满减');
        p.indexOf('4') >= 0 && (_p += '满赠');
        p.indexOf('5') >= 0 && (_p += '打折');
        p.indexOf('6') >= 0 && (_p += '满折');
        p.indexOf('7') >= 0 && (_p += '买减');
        return _p;
      },
      //普通校验库存
      hasGoods(param) { //检测地址是否有货
        if (!param.addressUuid) { return false; }
        param.terminalType = '02'
        this.$http.get('/splitorder/chooseaddressNewKuyu', param, res => {
          if (res.stockMap) {
            if (this.ispreSales && res.stockMap[param.attrIds] == '无货') {  //预售(单独做判断)
              this.exitsGoods = false;
            }
            this.stockMap = res.stockMap  //库存
            for (var key in this.stockMap) {
              if (this.stockMap[key] == '无货') {
                this.NoStock = true;  //不能提交订单
                this.exitsGoods = false;
                break;
              } else {
                this.NoStock = false;  //可以提交订单
              }
            }
          }
          // 有地区是不可售
          if (res.code == 0) {
            if (res.splitError == 'error') {
              this.NoStock = true
            }
          } else {
            this.NoStock = true
          }

        })
      },
      //秒杀校验库存
      seckillHasGoods(params) {
        if (!params.addressUuid) {
          return false;
        }
        this.$http.post('/splitorder/findStockNum', params, res => {
          if (res.retData && res.retData.split_error == "error") {
            this.exitsGoods = false;
            this.NoStock = true;  //不能提交订单
          }
        })
      },
      //数量控件
      numChg(obj, b, t, delFlag) {
        if (!this.addressUuid) {
          this.$dialog.alert({ mes: '请选择收货地址' })
          return false;
        }

        var getPids = function(pre) {
          var pids = [];
          if (delFlag == true) {
            for (var i = 0; i < obj.length; i++) {
              var o = obj[i];
              pids.push(pre + o.productUuid + '_' + o.attrAndValue + (o.suitUuid && o.suitUuid != 'null' ? '_' + o.suitUuid : ''));
            }
          } else {
            pids.push(pre + obj.productUuid + '_' + obj.attrAndValue + (obj.suitUuid && obj.suitUuid != 'null' ? '_' + obj.suitUuid : ''));
          }
          return pids.join(';')
        }

        if (!delFlag) {  //单个商品取库存数量
          puid = obj.productUuid + '_stock'
          if (this.stockMap) {
            for (var key in this.stockMap) {
              if (key == puid) {
                var stock = Number(this.stockMap[key])
              }
            };
          };
        } else { //套装取库存数量
          var stockArr = [], puid = ''
          obj.map(o => {
            puid = o.productUuid + '_stock'
            for (var key in this.stockMap) {
              if (puid == key) {
                stockArr.push(this.stockMap[key])
              }
            };
          })
          this.sort(stockArr)
          var stock = stockArr[0]
        }


        changeNum = 0;
        //减法
        if (t == 1) {
          if (b <= 1) {  //数量为1的时候不能再减
            return false;
          }
          (b - 0 > 1) && (b--);
          var pids = getPids('reducestock_'),
            changeNum = b
        }

        //加法
        if (t == 3) {
          if (this.NoStock) {  //没用库存时不能加
            return false;
          }
          b++;
          if (b > stock) {
            this.$dialog.alert({ mes: '最多可购买' + stock + '件' });
            b = stock;
            changeNum = b
          }
          changeNum = b
          var pids = getPids('addstock_');
        }


        this.$http.get('/order/changeBalanceKuyu', {
          addressUuid: this.addressUuid,
          productIdAndAttrId: pids,
          suitUuid: delFlag ? obj[0].suitUuid : '',
          changeNum: changeNum,
          terminalType: '02',
          random: Math.random()
        }, res => {
          // this.sortFun();
          //清空促销相关数据(改变价格会影响促销,赠品)
          this.promotionSkus = []
          this.cxName = []
          this.mzgiftName = []   //清空订单赠

          //不再调toBalanceKuyu接口了  直接使用本接口
          if (res.cartManagerList && res.cartManagerList.length > 0) {
            this.getData(res)
          }

          //不再调用hasGoods接口  直接用本接口库存
          if (res.stockMap) {
            if (this.ispreSales && res.stockMap[param.attrIds] == '无货') {  //预售(单独做判断)
              this.exitsGoods = false;
            }
            this.stockMap = res.stockMap  //库存
            for (var key in this.stockMap) {
              if (this.stockMap[key] == '无货') {
                this.NoStock = true;  //不能提交订单
                this.exitsGoods = false;
                break;
              } else {
                this.NoStock = false;  //可以提交订单
              }
            }
          }
          // 有地区是不可售   不用做判断此处
          // if (res.code == 0) {
          //   if (res.splitError == 'error') {
          //     this.NoStock = true
          //   }
          // } else {
          //   this.NoStock = true
          // }

        });
      },
      //去地址列表
      getAdd() {
        let jfAndNote = {
          jfSwitch: this.jfSwitch,
          note: this.note
        }
        this.$utils.setCookie('jfAndNote', JSON.stringify(jfAndNote))

        this.$router.push({ path: '/my/address?from=confirm', query: this.$route.query })
      },
      toggleT(t){
        this.faT=t
      },
      saveEle(){
        console.log(this.validEle())
        if (this.validEle()) {
          this.fpShow = false
        }
      },
      validEle(){
        var re = true;
        var reg = /^[\u4e00-\u9fa5\a-zA-Z0-9]{1,30}$/
        if (!reg.test(this.eleTitle)) {
          this.$dialog.alert({ mes: '发票抬头可输入中文、字母、数字，不可输入特殊符号。30个字符以内' })
          re = false;
          return re
        }
        if (this.faT=='enterprise') {
          let reg = /^[0-9a-zA-Z]{15,20}$/
          if (!this.electron_code||!reg.test(this.electron_code)) {
            this.$dialog.alert({ mes: '纳税人识别号可输入数字、字母，不可输入文字、特殊符号，15-20位(可不填)' })
            re = false
            return re
          }
        }
        if (!re) {
          return false
        } else {
          return true;
        }
      },
      saveAddvoice() {
        console.log(this.valideInvoice())
        if (this.valideInvoice()) {
          //this.addVoiceVisible = false;
          this.fpShow = false
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
      //获取电子发票
      geteleList() {
        this.$http.post('/usercenter/electronInvoice/getByCustomerUuid', {}, res => {
          if (res.data && res.data.length > 0) {
            this.eleTitle = res.data[0].titleContent
            this.electron_code = res.data[0].code
            this.eleuuid = res.data[0].uuid
          }
        })
      },
      //增值税发票
      getaddList() {
        this.$http.post('/usercenter/addInvoice/getByCustomerUuid', {}, res => {
          if (res.data && res.data.length > 0) {
            this.companyName = res.data[0].companyName
            this.code = res.data[0].code
            this.address = res.data[0].address
            this.registerMobile = res.data[0].registerMobile
            this.bankName = res.data[0].bankName
            this.bankNo = res.data[0].bankNo
            this.adduuid = res.data[0].uuid
          }
        })
      },
      //选择发票
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

      saveOrder() {
        //检测代码
        typeof (_smq) == 'object' && _smq.push(['custom', 'wap', 'goumai_2']);
        //壁合检测
//      typeof (beheActiveEvent) == 'function' && beheActiveEvent({at:"buy1",src:"1697009386",cid:"",sid:"27295.25156",orderid:"",cost:""})
//
        if (this.jfSwitch && (this.paymoney - this.jfMoney) < 1) {
          this.$dialog.alert({ mes: '抵扣后的订单金额少于1元不能使用' })
          return false;
        }
        if (this.invoiceCate == 3 && !this.valideInvoice()) {  // 验证增值税发票
          return false;
        }
        if (this.invoiceCate == 2 && !this.validEle()) {
          return false;
        }
        if (!this.exitsGoods) {
          this.$dialog.alert({ mes: '购物车中有库存不足或者不在该地区销售的商品，请返回购物车修改' });
          return false;
        }
        if (!this.addressList || !this.addressUuid) {
          this.$dialog.alert({ mes: '请选择收货地址' })
          return false;
        }
        //			返利网需要的参数
        var __fanliCookie = this.$utils.getCookie('fanliCookie');
        if (__fanliCookie) {
          __fanliCookie = JSON.parse(__fanliCookie.replace(/'/g, '"'));
          for (var k in __fanliCookie) {
            this.param[k] = __fanliCookie[k];
          }
        }
        this.param.checkArea = this.addressUuid;
        this.param.area = this.addressUuid;
        this.param.invoiceCate = this.invoiceCate;
        this.param.jifenPromotionUUID = this.jifenPromotionUUID;

        this.param.totalMoneyShow = (this.paymoney - 0).toFixed(2);
        if (this.jfSwitch == true) {
          this.param.integralReduceNum = this.useMaxIntegral;
          this.param.totalMoneyShow = (this.paymoney - this.jfMoney).toFixed(2);
        } else {
          this.param.integralReduceNum = '';
          this.param.totalMoneyShow = (this.paymoney - 0).toFixed(2);
        }
        this.param.orderFrom = this.$utils.iswx() ? 6 : 1;    //判断订单来源
        if (this.invoiceCate == "2") {
          this.param.invoiceUuid = this.eleuuid
          this.param.electron_code = this.electron_code
          this.param.electron_titleContent = this.eleTitle;
          this.param.electron_invoiceContent = '商品明细';
        } else if (this.invoiceCate == "3") {
          this.param.invoiceUuid = this.adduuid;
          this.param.add_companyName = this.companyName;
          this.param.add_code = this.code;
          this.param.add_address = this.address;
          this.param.add_registerMobile = this.registerMobile;
          this.param.add_bankName = this.bankName;
          this.param.add_bankNo = this.bankNo;
        }
        this.param.terminalType = '02';
        this.noteStoreUuid.map(o => {
          this.param["storeNote_" + o] = this.note
        })
        // this.param.note = this.note
        this.param['recommender'] = this.$utils.getCookie('tkcid')

        if (this.isKill) { //秒杀
          this.$http.post('/cart/saveLimitOrder', this.param, res => {
            if (res.code == '0') {
              //isGroup 1是组合，2是单品
              this.$utils.delCookie('seckilldata');
              this.$utils.delCookie('jfAndNote')
              localStorage.removeItem('chooseAddress')
              this.$utils.delCookie('chooseCoupon')
              this.$router.replace({ path: '/order/pay', query: { 'from': 'confirm', 'orderId': res.data.payOrderId, 'type': res.data.isGroup } })
              /*var url = '/order/orderpay.html?orderid=' + res.data.payOrderId + '&type=' + res.data.isGroup;
              window.location.replace(url);*/
              // window.location.href =
            } else if (res.code == '10' || res.code == 'no_stock') {
              this.$dialog.alert({ mes: '库存不足，或者商品不在送货地址区域销售！' })
            } else if (res.code == 'only_one') {
              this.$dialog.alert({ mes: '用同一个会员只能购买一件' })
            } else if (res.code == '11') {
              this.$dialog.alert({ mes: '促销库存不足！' })
            } else {
              if (res.code && res.msg)
                this.$dialog.alert({ mes: res.msg })
              else
                this.$dialog.alert({ mes: '订单提交失败，请重试！' });
            };
            return false;
          })
        } else if (this.ispreSales) { //预付定金
          this.$http.post('/front/product/presaleSaveOrder', this.param, res => {
            if (res.code == '0') {
              this.$utils.delCookie('presalesdata');
              this.$utils.delCookie('jfAndNote')
              localStorage.removeItem('chooseAddress')
              this.$utils.delCookie('chooseCoupon')
              this.$router.replace({ path: '/order/pay', query: { 'from': 'confirm', 'orderId': res.retData.payOrderId, 'type': res.retData.orderType, 'ordertype': this.ordertype } })
              /* var url = '/order/orderpay.html?orderid=' + res.retData.payOrderId + '&ordertype=' + ordertype + '&type=' + res.retData.orderType;
               window.location.replace(url);*/

            } else if (res.code == '10' || res.code == 'no_stock') {
              this.$dialog.alert({ mes: '库存不足，或者商品不在送货地址区域销售！' })
            } else if (res.code == '11') {
              this.$dialog.alert({ mes: '促销库存不足！' })
            } else {
              if (res.code && res.msg)
                this.$dialog.alert({ mes: res.msg })
              else
                this.$dialog.alert({ mes: '订单提交失败，请重试！' })
            }
          })
        } else {
          this.$http.post('/cart/saveOrderKuyu', this.param, res => {
            if (res.code == '0') {
              this.$utils.delCookie('jfAndNote')
              localStorage.removeItem('chooseAddress')
              this.$utils.delCookie('chooseCoupon')

              this.$router.replace({ path: '/order/pay', query: { 'from': 'confirm', 'orderId': res.payOrderId, 'type': res.isGroup } })

              /*var url = '/order/orderpay.html?orderid=' + res.payOrderId + '&type=' + res.isGroup;
              window.location.replace(url);*/
            } else if (res.code == '10' || res.code == 'no_stock') {
              this.$dialog.alert({ mes: '库存不足，或者商品不在送货地址区域销售！' })
            } else if (res.code == '11') {
              this.$dialog.alert({ mes: '促销库存不足！' })
            } else {
              (res.code && res.msg) ? this.$dialog.alert({ mes: res.msg }) : this.$dialog.alert({ mes: '订单提交失败，请重试！' })
            }

          })
        }
      },

    }
  }
</script>
