<template>
  <div class="collection">
    <yd-navbar title="我的收藏">
      <router-link to="/my" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
      <span class="edit" slot="right" @click="modify">编辑</span>
    </yd-navbar>
    <div class="empty" v-if="empty">
      <p>没有收藏的商品!</p>
      <span>现在就去收藏吧</span>
      <router-link :to="{path:'/'}">去逛逛</router-link>
    </div>
    <div>
      <yd-checklist v-model="checklist" ref="checklistDemo" color="#FF4545">
        <ul class="detail">
            <li class="list_item" v-for="(item,index) in data" :key="index">
              <yd-checklist-item :class="{ishidden:!showModifyBtn}"  :val='item.productUuid'>
                  <a class="a_block img_item" :href="'/other/'+item.productUuid">
                    <img :src="item.pim.productImage.centerImageUrl">
                    <div class="no_goods"  v-if="!item.onSell"><img src="./../../static/img/no-good.png"/></div>
                  </a>
                  <a class="a_block text_item" :href="'/other/'+item.productUuid">
                    <p class="product_title">{{item.productName}}</p>
                    <p>
                      <span class="staff_price">¥{{item.pim.staffPrice?item.pim.staffPrice.toFixed(2):0.00}}</span>
                      <span class="del-price">¥{{item.favoritePrice?item.favoritePrice.toFixed(2):0.00}}</span>
                    </p>
                  </a>
              </yd-checklist-item>
            </li>
        </ul>
      </yd-checklist>
    </div>
    <div v-show="showModifyBtn" class="del_all" @click="btnDel">删除收藏</div>
  </div>
</template>
<script>
let loadMore = null;
export default {
  head() {
    return {
      title: 'T严选商城-我的收藏'
    }
  },
  data() {
    return {
      pageShow: 8,
      nowPage: 1,
      totalNum: 100,
      pageCount: 0,
      data: [],
      productUuids: [],
      cartData:[],
      loadTxt: '',
      empty: false,
      showModifyBtn:false, //显示多选按钮
      checklist:[]
    }
  },
  watch: {
    nowPage(val) {
      this.getData()
    }
  },
  mounted() {
    this.getData()
    loadMore = this.loadMore
    window.addEventListener('scroll', loadMore, false)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', loadMore, false)
  },
  methods: {
    getData() {
      var params = {
        pageShow: this.pageShow,
        nowPage: this.nowPage,
        totalNum: this.totalNum,
        terminalType: '02'
      }
      this.loadEnd = false
      this.loadTxt = '数据加载中...'

      this.$http.get('/usercenter/productfavorite/toProductFavoriteKuyu', params, r => {
        this.loadEnd = true
        if (r.data.pagination.totalNum == 0) this.empty = true
        if (r.data.pagination.totalNum) {
          this.pageCount = Math.ceil(r.data.pagination.totalNum / this.pageShow);
        };

        var cartData = this.cartData
        var list = r.data.productFavoriteModels.map(function(m) {
          var d = cartData.filter(function(n) {
            return n.productId == m.productUuid;
          })[0];
          if (d && d.productId) {
            m.cartText = '已加入购物车'
            m.isCart = true
          } else {
            m.cartText = '加入购物车'
            m.isCart = false
          }
          m.isFav = true
          m.favText = '取消收藏'
          return m
        })
        this.data = this.data.concat(list)
        this.loadTxt = this.data.length < 8 ? '后面没有了...' : '上拉加载更多...'
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
    modify(e){
      if(!this.showModifyBtn){
        this.showModifyBtn=true;
        e.target.innerHTML='取消';
      }
      else{
        this.showModifyBtn=false;
        e.target.innerHTML='编辑';
      }
    },
    btnDel() {
      if(!this.checklist.length){
        this.$dialog.toast({
            mes: '请勾选要删除的商品',
            timeout: 1500
        });
        return false;
      }
      this.$dialog.confirm({
          title: '确定删除收藏的商品？',
          opts: () => {
              this.$http.post('/usercenter/productfavorite/cancelFavoriteKuyu', { productUuid: this.checklist }, res => {
                if (res.code == 0) {
                  for(let item of this.checklist){
                    for(let [index,item2] of this.data.entries()){
                      if(item2.productUuid == item){
                        this.data.splice(index,1)
                      }
                    }
                  }
                  this.$refs.checklistDemo.$emit('ydui.checklist.checkall',false);
                  this.empty = this.data.length == 0;
                }
              });
          }
      });
    }
  }
}
</script>
<style lang="less">
  .edit{
    margin-right: .6rem;
  }
  .list_item{
      display: flex;
    }
    .yd-checklist:after{
      border-bottom: none;
    }
  .del_all{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    text-align: center;
    font-size: .64rem;
    color: #fff;
    background-color: #FF4545;
    z-index: 99;
  }
</style>

