<template>
  <div class="cart">
    <div id="searchBox" class="searchBox">
      <yd-navbar title="购物车">
        <a slot="left" v-show="type=='edit'" @click="$router.push({path:'/'})">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </a>
        <a href="javascript:;" slot="right" class="edit" @click="edit" v-show="type=='edit'">编辑</a>
        <a href="javascript:;" slot="right" class="edit" @click="ok" v-show="type=='ok'">完成</a>
      </yd-navbar>
    </div>
    <div class="empty" v-show="empty==1">
      <img src="/img/emptyCart.png">
      <p>购物车空空的哦，去挑选心爱的商品吧～</p>
      <a href="/">去逛逛吧～</a>
    </div>

    <div class="cart-list" id="cartL" v-show="empty==0">
      <div class="item" v-for="(item,index) in cartList" :key="index">
        <span v-if="(type=='edit')&&(!item.onSell || !item.suitOnSell || item.buyNum==0)" class="invalid">{{(!item.onSell || !item.suitOnSell)?'失效':(item.buyNum==0?'无货':'')}}</span>
        <span v-else-if="(type=='ok')&&(!item.onSell || !item.suitOnSell || item.buyNum==0)">
          <i class="iky-remove" @click="removeUnit(item)" v-show="type=='ok'">&nbsp;</i>
        </span>
        <span v-else>
          <i :class="item.checked==false?'chk iky-uncheck':'chk iky-checked'" @click="chkState(item)">&nbsp;</i>
        </span>
        <a :href="'/other/'+item.productId" class="link">
          <div class="img">
            <img :src="item.productImgUrl" alt="">
          </div>
          <div class="res">
              <div class="title">{{item.productName}}</div>
              <p class="attrs" :class="item.attrValues.length>0?'':'attrs1'" v-if="item.attrValues">
                <span v-for="(i,index) in item.attrValues" :key="index">{{i.value + ' '}}</span>
              </p>
              <div class="price-wrap">
                <span class="price">
                  {{(parseFloat(item.totalPrice)/parseInt(item.buyNum)==parseFloat(item.staffPrice))?'员工价':'亲友价'}}<span class="small">￥</span>{{item.suitUuid ?item.singleMarketPrice:((item.finalPrice - 0) > 0 ? (item.finalPrice-0).toFixed(2) : (item.buyNum == 0 ? (item.singleMarketPrice-0).toFixed(2) : (item.totalPrice / item.buyNum-0).toFixed(2)))}}
                </span>
              <span class="unitSum" v-show="!item.suitUuid&&item.onSell&&item.buyNum>0">
                <span class="yd-spinner amount" id="numChg">
                  <a href="javascript:;" @click="numChg(item,item.buyNum,1)"></a>
                  <input type="text" placeholder="" class="spinner-input" @blur="numChg(item,item.buyNum,2)" v-model="item.buyNum" readonly>
                  <a href="javascript:;" @click="numChg(item,item.buyNum,3)"></a>
                </span>
              </span>
            </div>
          </div>
        </a>
        <!--<div v-if="item.productWarning == 0">-->
          <!--<div class="tip">{{(item.stockNo == 0) ? '库存不足' : ''}}</div>-->
        <!--</div>-->
        <!--<div v-else-if="item.productWarning == 1">-->
          <!--<div class="tip">{{item.stockNo == 0 ? '库存不足' : '库存不足，最多可买'+item.stockNo+'件'}}</div>-->
        <!--</div>-->
        <!--<div v-else-if="item.productWarning == 2">-->
          <!--<div class="tip">{{item.stockNo == 0 ? '库存不足' : '库存紧张'}}</div>-->
        <!--</div>-->
        <!--<div v-else></div>-->
      </div>
      <div class="operate">
        <span :class="checkAll?'checkAll iky-checked':'checkAll iky-uncheck'" @click="chkAll">
          <em>全选</em>
        </span>
        <div v-if="type=='edit'">
          <div class="pay">
            合计：
            <span class="pay-price">&yen;{{cartsTotalMount}}</span>
            <p>总额:&yen;{{productTotalMount}}&nbsp;立减&yen;{{(productTotalMount-cartsTotalMount).toFixed(2)}}</p>
          </div>
          <div :class="!inValid?'btn':'btn disabled'">
            <a href="javascript:;" @click="toPay">结算（{{num}}）</a>
          </div>
        </div>
        <div v-else>
          <a href="javascript:;" :class="!inValid?'scBtn btn':'scBtn btn disabled'" @click="favor(checkedArr)" style="width: 6.3rem;">移入收藏</a>
          <a href="javascript:;" :class="!inValid?'btn':'btn disabled'" @click="remove(checkedArr)" style="width: 6.3rem;">删除</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let cartList = []
const headerToggle = () => {
  let obj = document.getElementById('searchBox'),
    c = document.getElementById('cartL'),
    h = document.getElementsByClassName('_7th')[0].getBoundingClientRect().height;
  obj && (obj.className = window.scrollY > (cartList.length > 2 ? h : 200) ? 'searchBox active' : 'searchBox')
  c && (c.className = window.scrollY > (cartList.length > 2 ? h : 200) ? 'cart-list crt' : 'cart-list')
};
export default {
  data() {
    return {
      //img: require('@/static/img/emptyCart.png'),
      num: 0,
      checkAll: true,
      type: 'edit',
      cartList: [],
      empty: 0,
      cartsTotalMount: 0.00,
      productTotalMount:0.00,
      checkedArr: [],
      invalidArr: [],
      inValid: true,
      //headerFixed:false,
      items: []
    }
  },
  mounted() {
    this.list()
    cartList = this.cartList
    window.addEventListener('scroll', headerToggle, false)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', headerToggle, false)
  },
  methods: {
    /*back() {
        let _his = util.getCookie('his') ? util.getCookie('his') : '';
        if(_his != ''){
            window.location.href = '/'
        }else{
            this.$router.back();
        }
        util.delCookie('his');
    },*/

    list() {
      this.$http.get('/cart/show', {
        terminalType: '02'
      }, res => {
        (res.code == 1) && (this.empty = 1);
        //购物车不为空
        if (res.data && res.data.carts && res.data.carts.length > 0) {
          this.cartList = res.data.carts;
          this.cartsTotalMount = res.data.cartsTotalMount;
          this.productTotalMount = res.data.productTotalMount;
          this.checkedArr = [];
          this.invalidArr = [];
          let sum = 0;
          this.cartList.map((o) => {
            if (o.checked == true) {
              this.checkedArr.push(o);
              sum += o.buyNum;
            }
            (!o.onSell || !o.suitOnSell || o.stockNo == 0) && (this.invalidArr.push(o));
            //小能客户
            this.items.push({
              id: o.productId,
              count: o.buyNum
            });
          });
          this.num = sum;
          (this.cartList.length == (this.checkedArr.length + this.invalidArr.length)) ? (this.checkAll = true) : (this.checkAll = false);
          (this.checkedArr.length == 0) ? this.inValid = true : this.inValid = false;
          //小熊客服
          let ntalkerparam = {
            cartprice: res.data.cartsTotalMount,
            items: this.items
          };
          // NTKF_PARAM['ntalkerparam'] = ntalkerparam;
          window.XNupdate({
            ntalkerparam: ntalkerparam
          })
        } else {
          this.empty = 1;
          this.type = '';

          let ntalkerparam = {
            cartprice: 0,
            items: []
          };
          // NTKF_PARAM['ntalkerparam'] = ntalkerparam;
          window.XNupdate({
            ntalkerparam: ntalkerparam
          })
        }
      });
    },
    //商品单选
    chkState(obj) {
      var pids = [];
      pids.push('product_' + obj.productId + '_' + obj.attrIds + (obj.suitUuid && obj.suitUuid != 'null' ? '_' + obj.suitUuid : ''));
      if (obj.suitSubProduct) {
        for (var i = 0; i < obj.suitSubProduct.length; i++) {
          var o = obj.suitSubProduct[i];
          pids.push('product_' + o.productId + '_' + o.attrIds + (obj.suitUuid && obj.suitUuid != 'null' ? '_' + obj.suitUuid : ''));
        }
      }
      this.$http.get('/cart/changeChooseKuyu', {
        productIdAndAttrId: pids.join(';'),
        chooseState: !obj.checked,
        suitUuid: obj.suitUuid == 'null' ? '' : obj.suitUuid,
        random: Math.random()
      }, res => {
        this.list();
      });
    },
    //购物车加减
    numChg(obj, b, t) {
      if (obj.stockNo - 0 <= 0) return false;
      var getPids = function(pre) {
        var pids = [];
        pids.push(pre + obj.productId + '_' + obj.attrIds + (obj.suitUuid && obj.suitUuid != 'null' ? '_' + obj.suitUuid : ''));
        if (obj.suitSubProduct) {
          for (var i = 0; i < obj.suitSubProduct.length; i++) {
            var o = obj.suitSubProduct[i];
            pids.push(pre + o.productId + '_' + o.attrIds + (obj.suitUuid && obj.suitUuid != 'null' ? '_' + obj.suitUuid : ''));
          }
        }
        return pids.join(';')
      },
        params = {
          productIdAndAttrId: pids,
          random: Math.random(),
          suitUuid: obj.suitUuid
        },
        changeNum = 0;
      //减法
      if (t == 1) {
        (b - 0 > 1) && (b--);
        var pids = getPids('reducestock_'),
          changeNum = b
      }
      //文本框
      if (t == 2) {
        var pids = getPids('stock_');
        if (b == '' || isNaN(b)) {
          this.$dialog.alert({ mes: '请输入购买数量!' });
          return;
        } else if (b > obj.stockNo) {
          this.$dialog.alert({ mes: '最多可购买' + obj.stockNo + '件' });
          b = obj.stockNo;
        }
        changeNum = b
      }
      //加法
      if (t == 3) {
        b++;
        if (b > obj.stockNo) {
          this.$dialog.alert({ mes: '最多可购买' + obj.stockNo + '件' });
          b = obj.stockNo;
          changeNum = b
        }
        changeNum = b
        var pids = getPids('addstock_');
      }
      this.$http.get('/cart/changeNumsKuyu', {
        productIdAndAttrId: pids,
        suitUuid: obj.suitUuid == 'null' ? '' : obj.suitUuid,
        changeNum: changeNum,
        random: Math.random()
      }, res => {
        this.list();
      });
    },
    edit() {
      this.type = 'ok'
    },
    ok() {
      this.type = 'edit'

      //                this.checkedArr = []
      //                this.cartList.map((o) => {
      //                    if(o.stockNo == 0){
      //                        o.checked = false;
      //                    }
      //                    (o.checked == true) && (this.checkedArr.push(o));
      //                });
      //                this.num = this.checkedArr.length;
    },
    chkAll() {
      this.checkAll = !this.checkAll;
      this.$http.get('/cart/changeChooseKuyu', {
        productIdAndAttrId: "allRecords",
        chooseState: this.checkAll,
        suitUuid: '',
        terminalType: '02',
        random: Math.random()
      }, res => {
        this.list();
      });
    },
    toPay() {
      if (this.inValid) return;
      //跳转到结算页面
      //this.$router.push({ path: ''})
      //检测代码
      typeof (_smq) == 'object' && _smq.push(['custom', 'wap', 'jiesuan']);
      window.location.href = '/order/confirm'
    },
    removeUnit(item) {
      let unitArr = [];
      unitArr.push(item);
      this.remove(unitArr);
    },
    remove(obj) {
      //if (this.inValid) return;
      var pids = [],
        sids = [];
      obj.map((o) => {
        pids.push('remove_' + o.productId + '_' + o.attrIds + (o.suitUuid && o.suitUuid != 'null' ? '_' + o.suitUuid : ''));
        sids.push(o.suitUuid);
        if (o.suitSubProduct) {
          for (var i = 0; i < o.suitSubProduct.length; i++) {
            var i = o.suitSubProduct[i];
            pids.push('remove_' + i.productId + '_' + i.attrIds + (o.suitUuid && o.suitUuid != 'null' ? '_' + o.suitUuid : ''));
          }
        }
      })
      if(!pids.length||!sids.length){
        this.$dialog.alert({mes:'请选择要删除的商品。'})
        return false;
      }
      this.$dialog.confirm({
        title: '',
        mes: '确定要删除所选择的宝贝吗？',
        opts: () => {
          this.$http.get('/cart/removeKuyu', {
            random: Math.random(),
            productIdAndAttrId: pids.join(';'),
            suitUuid: sids.join(';')
          }, res => {
            this.$dialog.alert({
              mes: '删除成功!'
            });
            this.list();
          });
        }
      });
    },
    //批量收藏
    favor(obj){
      var pids = [],sids = [],removerPids=[];
      obj.map((o) => {
        pids.push(o.productId);
        sids.push(o.suitUuid);
        removerPids.push('remove_' + o.productId + '_' + o.attrIds + (o.suitUuid && o.suitUuid != 'null' ? '_' + o.suitUuid : ''));
      })
      if(!pids.length){
        this.$dialog.alert({mes:'请选择要收藏的商品。'})
        return false;
      }
      this.$dialog.confirm({
        title: '',
        mes: '确定要将所选宝贝移入收藏吗？',
        opts: () => {
          this.$http.get('/front/product/collectProduct?random='+Math.random(),{
              productUuid:pids.join(';'),
              ranNum:Math.random()
            },res => {
              this.$dialog.alert({
                mes: '成功收藏!'
              });
              this.$http.get('/cart/removeKuyu', {
                random: Math.random(),
                productIdAndAttrId: removerPids.join(';'),
                suitUuid: sids.join(';')
              }, res => {
                this.list();
              });

            })
        }
      })

    }
  },
  head() {
    return {
      title: 'T严选商城-购物车',
    }
  }
}
</script>
