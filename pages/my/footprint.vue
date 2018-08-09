<script src="../../.nuxt/router.js"></script>
<template>
  <div class="collection">
    <yd-navbar title="我的足迹">
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
    <div id="foot_print">
      <yd-checklist v-model="checklist" ref="checklistDemo" :callback="change" color="#FF4545">
        <div class="detail" v-for="(item,index) in data0" :key="index">
          <div class="unit_date">{{index}}</div>
          <div class="list_item" v-for="(o,i) in item" :key="i">
            <yd-checklist-item :class="{ishidden:isshow}"  :val='o.goodsId'>
                <a class="a_block img_item" :class="{no_goods:!o.onSell}" :href="'/other/'+o.goodsId">
                  <img :src="o.goodsImgUrl">
                  <img class="no_sell" src="./../../static/img/soldout1.png" v-if="!o.onSell"/>
                </a>
                <a class="a_block text_item" :href="'/other/'+o.goodsId">
                  <p class="product_title">{{o.goodsName}}</p>
                  <p>
                    <span class="staff_price">¥{{o.price?parseFloat(o.price).toFixed(2):0.00}}</span>
                    <span class="del-price">¥{{o.shopPrice?parseFloat(o.shopPrice).toFixed(2):0.00}}</span>
                  </p>
                </a>
            </yd-checklist-item>
          </div>
        </div>
      </yd-checklist>
    </div>
    <div class="operator" v-show="showModifyBtn">
      <yd-checkbox class="checkbox" v-model="isCheckAll" shape="circle" @change.native="checkAll"  color="#FF4545">全选</yd-checkbox>
      <div  class="del" @click="btnDel">删除</div>
    </div>
  </div>
</template>
<script>
  let loadMore = null;
  export default {
    head() {
      return {
        title: 'T严选商城-我的足迹'
      }
    },
    data() {
      return {
        pageShow: 50,
        nowPage: 1,
        totalNum: 100,
        pageCount: 0,
        data0: {},
        productUuids: [],
        cartData:[],
        loadTxt: '',
        empty: false,
        showModifyBtn:false, //显示多选按钮
        checklist:[],
        isCheckAll: false,
        isshow:true
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
        let _this = this;
        this.$http.get('/usercenter/producthistory/getStaffLookedGods', params, r => {
          this.loadEnd = true;
          // this.data0 = Object.assign({},_this.data0,r.data);
          this.data0 = r.data;
        })
      },
      loadMore() {
        if (this.nowPage == this.pageCount) {
          this.loadTxt = '后面没有了...'
        } else {
          this.loadTxt = '上拉加载更多...'
        }
        let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100;
        if (start && this.loadEnd && this.page < this.pageCount) {
          this.nowPage++
        }
      },
      modify(e){
        if(!this.showModifyBtn){
          this.showModifyBtn=true;
          e.target.innerHTML='完成'
          this.isshow=false;
        }
        else{
          this.showModifyBtn=false;
          e.target.innerHTML='编辑';
          this.isshow=true;
        }
      },
      change(value, isCheckAll) {
        this.isCheckAll = isCheckAll;
      },
      checkAll() {
       this.isCheckAll = !this.isCheckAll;
        this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
      },
      changeVal(e){
        let productUuid=e.target.parentNode.querySelector('.yd-checkbox-text').innerHTML;
        if(e.target.checked){
          this.productUuids.push(productUuid)
        }
        else{
          this.productUuids.splice(this.productUuids.indexOf(productUuid),1)
        }
      },
      btnDel() {
        if(!this.checklist.length){
        this.$dialog.toast({
            mes: '请勾选要删除的商品足迹',
            timeout: 1500
        });
        return false;
      }
      this.$dialog.confirm({
          title: '确定删除商品的足迹？',
          opts: () => {
              this.$http.get('/usercenter/producthistory/deleteStaffLookedGods', { productUuids: this.checklist.join(),terminalType:'02', ranNum:Math.random()}, res => {
                if (res.code == 0) {
                  this.$refs.checklistDemo.$emit('ydui.checklist.checkall',false);
                  this.getData();
                }
                else{
                  this.$dialog.toast({
                    mes: res.msg,
                    timeout: 1500
                  })
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
  .detail{
    background-color: #fff;
    margin-bottom: 0!important;
    .unit_date{
      background-color: #F1F1F1;
      height: 1.5rem;
      line-height: 1.5rem;
      color: #999;
      font-size: .64rem;
      padding-left: .64rem;
    }
  }
  .operator{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    text-align: center;
    font-size: .64rem;

    background-color: #FBFBFB;
    z-index: 99;
    .checkbox{
      float: left;
      margin-left: .5rem;
      .yd-checkbox-icon{
        vertical-align: middle;
      }
    }
    .del{
      width: 5rem;
      height: 100%;
      float: right;
      background-color:#FF4545;
      color: #fff;
    }
  }
</style>

