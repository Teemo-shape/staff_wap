<template>
  <div class="productDetail">
    <div id="commmentModal">
      <header>
        <section class="row">
          <div class="col col1 hd-back" @click="back">
            <i class="icon iky-arrow-left font32"></i>
          </div>
          <h1 class="col col21 hd-title font32">商品评价</h1>
          <div class="col col2 hd-cart" @click="intoCart">
            <i class="icon iky-cart font36"></i>
            <span></span>
          </div>
        </section>
      </header>
      <section class="comment">
        <div class="row hd">
          <div class="col col10">
            <font>{{comments.averagescore | toFixed}}</font>
            <p class="cm">{{comments.size}}人评论</p>
            <p class="star">
              <span class="yd-rate" style="font-size: 0.575rem; color: rgb(204, 204, 204);">
                <a href="javascript:;" :class="{'rate-active': item<=comments.averagescore}" style=" padding-right: 0.06rem;" v-for="item in 5" :key="item"></a>
              </span>
            </p>
          </div>
          <div class="col col14">
            <ul>
              <li>
                <p>5星</p>
                <p class="line">
                  <i :style="{width:(comTypes.fiveStartCount/comments.size*100*0.06) +'rem'}"></i>
                </p>
                <p>{{comTypes.fiveStartCount}}</p>
              </li>
              <li>
                <p>4星</p>
                <p class="line">
                  <i :style="{width:(comTypes.fourStartCount/comments.size*100*0.06) +'rem'}"></i>
                </p>
                <p>{{comTypes.fourStartCount}}</p>
              </li>
              <li>
                <p>3星</p>
                <p class="line">
                  <i :style="{width:(comTypes.threeStartCount/comments.size*100*0.06) +'rem'}"></i>
                </p>
                <p>{{comTypes.threeStartCount}}</p>
              </li>
              <li>
                <p>2星</p>
                <p class="line">
                  <i :style="{width:(comTypes.twoStartCount/comments.size*100*0.06) +'rem'}"></i>
                </p>
                <p>{{comTypes.twoStartCount}}</p>
              </li>
              <li>
                <p>1星</p>
                <p class="line">
                  <i :style="{width:(comTypes.oneStartCount/comments.size*100*0.06) +'rem'}"></i>
                </p>
                <p>{{comTypes.oneStartCount}}</p>
              </li>
            </ul>
          </div>
        </div>

      </section>
    </div>
    <section class="comment comment2">
      <div class="font24 txce gray" v-show="!(list.length>0)" style="padding:2rem .6rem;">暂无数据</div>
      <div class="" v-show="(list.length>0)">
        <yd-list theme="1" slot="list">
          <div class="comms" v-for="(item, index) in list" :key="index">
            <div class="header row">
              <ul class="col col18">
                <li>
                  <img class="tx" :src="(item.customerImageUrl ? item.customerImageUrl: 'http://m.tcl.com/res/img/default.png' )" />
                </li>
                <li>
                  <p class="font26 customerName">{{item.firstShopComment.customerName}}
                    <span class="v">{{item.firstShopComment.version}}</span>
                  </p>
                  <p class="star">
                    <span class="yd-rate" style="font-size: 0.575rem; color: rgb(204, 204, 204);">
                      <a href="javascript:;" :class="{'rate-active': item.firstShopCommentScores[0]&&it<=item.firstShopCommentScores[0].appScore}" style=" padding-right: 0.06rem;" v-for="it in 5" :key="it"></a>
                    </span>
                  </p>
                </li>
              </ul>
              <div class="col col6 font24 gray time">{{item.firstShopComment.appTime | matTime}}</div>
            </div>
            <div class="commsCbox">
              <p class="font26 comcc">{{item.firstShopComment.comments | formatxss}}</p>
              <div>
                <p class="imgcont">
                  <img class="plimg" v-for="(i, index) in item.firstShowImgs" :src="i.imgUrl" @click="open(i.id)" :key="index" />
                  <!-- <imgShow :list="item.firstShowImgs"></imgShow> -->
                </p>
                <p class="font26 superaddition" v-show="item.firstReplyComment">
                  <span class="red">官方回复:</span>{{item.firstReplyComment ? item.firstReplyComment.replyContent : ''}}</p>
                <p class="gray font26 addTime" v-show="item.afterShopComment">用户{{item | pubTime}}追评</p>
                <p class="font26 superaddition" v-show="item.afterShopComment">
                  <span class="red">用户追评:</span>{{item.afterShopComment&&item.afterShopComment.comments | formatxss}}</p>
                <!-- <p class="font26 superaddition" v-show="item.afterReplyComment">
                                                                              <span class="red">官方回复:</span>{{item.afterReplyComment ? item.afterReplyComment.replyContent : ''}}</p> -->
                <p class="imgcont">
                  <img class="plimg" v-for="(i,index) in item.afterShowImgs" :src="i.imgUrl" :key="index" @click="open(i.id)"/>
                  <!-- <imgShow :list="item.afterShowImgs"></imgShow> -->
                </p>
                <p class="font26 superaddition" v-show="item.afterReplyComment">
                  <span class="red">官方回复:</span>{{item.afterReplyComment ? item.afterReplyComment.replyContent : ''}}</p>
              </div>
            </div>
          </div>
          <div class="empty">{{loadTxt}}</div>
        </yd-list>
        <imgBig :list="imgList" ref="imgShow"></imgBig>
        <!-- 数据全部加载完毕显示 -->
      </div>
    </section>
    <footer>
      <div class="row commmentFoot">
        <div class="font32 buy" @click="buy">{{buyName}}</div>
      </div>
    </footer>
  </div>
</template>
<script>
import { ImgBig } from '~/components/imgBig';
var isload = typeof window === 'undefined'
let loadList = null;
export default {
  name: 'comments',
  components: {
    'imgBig': ImgBig
  },
  data() {
    return {
      api: {
        getComClassify: '/front/product/getProductCommentCounts', //评论分类
        getComments: '/front/product/showProductComments', // 评论
        buy: '/front/product/addProductToCart', //  普通下单
      },
      queryParam: { uuid: '', terminal: '02' }, loadTxt: '下拉加载更多...',
      all: {},
      canBuy: false, showHelpTag: true, list: [], loadEnd: false, pageCount: 0,
      comments: {
        size: 0, list: [],
        good: {
          firstShopComment: { customerName: '', version: '', appTime: '', comments: '', },
          afterShopComment: { day: '', comments: '', },
          afterShowImgs: [],
          customerImageUrl: 'http://m.tcl.com/res/img/default.png',
          star: 0,
        },
        wm: {}, averagescore: ''
      },
      orderType: { key: '标准', value: -1 }, buyName: '加入购物车', comTypes: '', nowPage: 1, pageCount: 0, pageShow: 8,imgList:[]
    }
  },
  filters: {
    toFixed: function(val) {
      return val ? val.toFixed(1) : '';
    },
    matTime: function(val) {
      // return val ? this.$utils.formatDate(val) : '';
    },
    pubTime: function(val) {
      var t = '', c = val.afterShopComment ? (val.afterShopComment.appTime - val.firstShopComment.appTime) : 0;
      return c >= 86400000 ? parseInt(c / 86400000) + '天后' : '当天'
    },
    formatxss: function(dom) {
      if (isload) return;
      var d = document.createElement('div');
      dom = (dom && dom != undefined) ? dom.replace(/\s+/ig, '') : '';
      d.innerHTML = dom;
      return d.innerText;
    }
  },
  mounted() {
    loadList = this.loadList
    window.addEventListener('scroll', loadList, false)
    var uuid = this.$route.params.uuid;
    this.canBuy = this.$route.query.canBuy;
    this.queryParam.uuid = uuid;
    this.getComClassify();
    this.getComments();
    this.type = this.$route.query.type
    if (this.type == true || this.type == 'true') {
      this.buyName = '返回商品详情'
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', loadList, false)
  },
  methods: {
    open(id){
      for(let [index,item] of this.imgList.entries()){
        if(item.id == id){
          this.$refs.imgShow.showCom(index);
        }
      }
    },
    intoCart() { //去购物车页面
      this.$router.push({ path: '/cart' })
    },
    back() {
      this.$router.back();
    },
    getComClassify() { //评论分类
      var params = {
        productUuid: this.queryParam.uuid,
      };
      this.$http.post(this.api.getComClassify, params, res => {
        if (res.code == 0) {
          this.comTypes = res.data;
        }
      })
    },
    buy() {
      (this.type == true || this.type == 'true') ? this.$router.back() : this.addCart();
    },
    addCart() { // 添加到购物车
      if (this.canBuy) {
        if (this.orderType.type == 'suit') { //套餐购买
          this.suitBuy(1, () => {
            this.addSuccess();
            // self.cart.cartSize = self.cart.cartSize + self.cart.size;
          });
        } else { //普通购买
          this.usualBuy(() => {
            this.addSuccess();
            // self.cart.cartSize = self.cart.cartSize + self.cart.size;
          });
        }
      }
    },
    addSuccess() {
      this.$dialog.toast({
        mes: '成功加入购物车',
        timeout: 1000,
        icon: 'success'
      });
    },
    usualBuy(cb) { //普通下单
      var params = {
        productUuid: this.$route.params.uuid,
        buyNum: this.$route.query.buyNum,
        attrId: this.$route.query.attrId,
        recommender: this.$route.query.recommender || '',
        terminalType: '02',
      };
      this.$http.get(this.api.buy, params, res => {
        if (res.code == 0) {
          if (cb) cb();
        } else {
          this.$dialog.alert({ mes: res.msg })
        }
      })
    },
    getComments() { //评论
      var params = {
        productUuid: this.queryParam.uuid,
        nowPage: this.nowPage,
        pageShow: this.pageShow,
      };
      this.loadEnd = false

      this.$http.post(this.api.getComments, params, res => {
        this.loadEnd = true
        if (res.commentList.length > 0) {
          this.pageCount = res.wm.totalPage
          this.comments.size = res.wm.totalNum;
          this.comments.averagescore = res.averagescore;
          this.list = [...this.list, ...res.commentList];
          for(let item of this.list){
            if(item.firstShowImgs && item.firstShowImgs.length>0){
              this.imgList.push(...item.firstShowImgs);
            }
            if(item.afterShowImgs && item.afterShowImgs.length>0){
              this.imgList.push(...item.afterShowImgs);
            }
          }
        }
        this.pageCount == this.nowPage && (this.loadTxt = '后面没有啦^_^')
      });
    },
    loadList() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.nowPage < this.pageCount && (this.list.length > 0)) {
        this.nowPage++
        this.getComments()
      }
    }
  },
  head() {
    return {
      title: 'T严选商城-商品评论',
    }
  }
}
</script>
