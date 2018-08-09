<template>
  <div class="search">
    <div class="searchBox" id="searchBox">
      <a href="javascript:history.go(-1)" class="iky-arrow-left"></a>
      <div class="txtBox">
        <span class="iky-search" @click="search"></span>
        <input type="text" :placeholder='placeholder' v-model="keyword" maxlength="16" @focus="searchWords($event)" @blur="blurInput($event)" v-on:input="searchWords($event)">
        <span class="iky-close" v-show="keyword" @click="keyword='';listShow=false;"></span>
      </div>
      <a href="javascript:;" class="yd-btn" @click="search">搜索</a>
    </div>
    <ul class="listShow" v-show="listShow">
      <li v-for="(item,index) in listData" :key="index" @click.stop="val(item.unionWord)">
        <span class="keyWord">{{item.unionWord}}</span>
        <span class="resultNum" v-show="item.hitCount>=0">约有{{item.hitCount}}件</span>
      </li>
    </ul>
    <div class="hotSearch">
      <h2>热门搜索</h2>
      <ul class="hotList">
        <li v-for="(item,index) in hotList" :key="index" @click="hotClick(item)">{{item}}</li>
      </ul>
    </div>
    <div class="hisSearch" v-show="hisList.length>0">
      <h2>历史搜索</h2>
      <ul class="hisList">
        <li v-for="(item,index) in hisList" :key="index" @click="hisClick(item)">{{item}}</li>
      </ul>
      <a href="javascript:;" class="clearHis" @click="clearHis" v-show="hisList.length>0">清空历史搜索</a>
      <p v-show="hisList.length==0" class="clearHis">还没有搜索记录哦</p>
    </div>
    <p class="empty" v-show="empty==1">非常抱歉，没有找到您所要的商品
      <a href="/">返回首页</a>
    </p>
    <p class="filterBar" v-show="fil==1">
      <span v-for="(f,index) in filterList" :key="index" @click="filter(f)" :class="{on:f.on}">{{f.name}}
        <i class="iky-arrow-up" v-show="f.type!==0" :class="{off:f.off}"></i>
        <i class="iky-arrow-down" v-show="f.type!==0" :class="{off:!f.off}"></i>
      </span>
    </p>
    <p v-show="loading==1" class="loading">数据加载中...</p>
    <ul class="proList" v-show="proList.length>0">
      <li v-for="(item,index) in proList" :key="index">
        <a :href="'/other/'+item.uuid">
          <img :src="item.pic">
          <p class="proName" v-html="item.name"></p>
          <p class="price">￥{{item.promotionPrice.toFixed(2)}}
            <span v-show="item.price>item.promotionPrice">￥{{item.price.toFixed(2)}}</span>
          </p>
        </a>
      </li>
    </ul>
    <div class="tip"></div>
    <db11></db11>
  </div>
</template>
<script>
import db11 from '~/components/db11';
let headerToggle = null;
let loadMore = null;
export default {
  components: { db11 },
  data() {
    return {
      hotList: [], hisList: [], proList: [], keyword: '', empty: 0,listShow:false,listData:[],
      nowPage: 1, pageShow: 8, pageCount: 0, sortBy: '', sortType: 1, loading: 0, fil: 0,
      placeholder: '电视',
      filterList: [
        { "name": "全部", type: 0, on: 1, off: 1 },
        { "name": "价格", type: 1, on: 0, off: 1 },
        { "name": "销量", type: 2, on: 0, off: 1 }
      ],
      loadEnd: false, pageCount: 0
    }
  },
  watch: {
    nowPage(val) {
      this.getData()
    }
  },
  mounted() {
    headerToggle = this.headerToggle
    loadMore = this.loadMore
    window.addEventListener('scroll', headerToggle, false)
    window.addEventListener('scroll', loadMore, false)
    this.getHot();
    this.getHis();
    //this.getData();
    this.keyword = this.$route.query.keyword || ''
    this.kwd()
    // this.getWords()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', headerToggle, false)
    window.removeEventListener('scroll', loadMore, false)
  },
  methods: {
    blurInput(){
      var _this = this
      setTimeout(function(){
        _this.listShow = false;
      },20)
    },
    getWords(){
      this.listData = []
      this.$http.get('/front/product/wap/hotkeyword',{
        word:this.keyword
      },res=>{
        if(res.code == 0){
          this.listData = res.retData;
          this.listShow = true;
          this.modal = true;
        }
      })
    },
    searchWords(e){
      if(this.keyword.replace(/(^\s*)|(\s*$)/g, '') == ''){
        this.listShow = false;
        return false;
      }
      this.getWords();
    },
    val(v){
      this.keyword = v;
      this.listShow = false;
      this.search();
    },
    kwd() {
      if (this.keyword == '') return false;
      this.search();
    },
    headerToggle() {
      if (this.$route.path == '/search') {
        if (this.proList.length < 3) return false;
        let obj = document.getElementById('searchBox');
        obj.className = window.scrollY > 50 ? 'searchBox active' : 'searchBox'
      }
    },
    getHot() {
      this.$http.get('/front/productList/getHotKeyWord', {}, res => {
        if (res && res.length > 0) {
          this.hotList = res;
        }

      })
    },
    getHis() {
      this.hisList = this.$utils.getCookie('historySearch') != null ? this.$utils.getCookie('historySearch').split(',') : [];
    },
    search() {
      if (this.keyword.replace(/(^\s*)|(\s*$)/g, '') == '') {
        /*this.$dialog.toast({
            mes: '请输入搜索关键字',
            timeout: 1000,
            icon: 'error'
        });
        return;*/
        this.keyword = this.placeholder;
        this.getData();
      }
      this.listShow = false;  //移除搜索联想面板
      this.hisCookie(this.keyword);
      this.proList = [];
      this.nowPage != 1 ? this.nowPage = 1 :this.getData();
      // this.getData();
    },
    hotClick(kwd) {
      this.hisCookie(kwd);
      this.keyword = kwd;
      this.proList = [];
      this.nowPage != 1 ? this.nowPage = 1 :this.getData();
      // this.nowPage = 1;
      // this.getData();
    },
    hisClick(kwd) {
      this.hisCookie(kwd);
      this.keyword = kwd;
      this.proList = [];
      this.nowPage != 1 ? this.nowPage = 1 :this.getData();
      // this.nowPage = 1;
      // this.getData();
    },
    hisCookie(kwd) { //存储搜索历史记录
      if (kwd && this.hisList.indexOf(kwd) == -1) {
        this.hisList.splice(0, 0, kwd);
      } else {
        this.hisList.splice(this.hisList.indexOf(kwd), 1);
        this.hisList.splice(0, 0, kwd);
      }
      this.hisList = this.hisList.splice(0, 5);
      this.$utils.setCookie('historySearch', this.hisList);
      this.getHis();
    },
    clearHis() {
      this.$utils.delCookie('historySearch');
      this.hisList = [];
    },
    filter(o) {
      this.filterList.map((m) => {
        m.on = 0;
      })
      o.on = 1;
      o.off = !o.off;
      if (o.type == 0) {
        this.sortBy = 'sortWeight';
        this.sortType = 1;
      } else if (o.type == 1) {
        this.sortBy = 'price';
        this.sortType == 1 ? this.sortType = 2 : this.sortType = 1;
      } else if (o.type == 2) {
        this.sortBy = 'salsnum';
        this.sortType == 1 ? this.sortType = 2 : this.sortType = 1;
      }
      this.proList = [];
      this.nowPage == 1 ? this.getData() : this.nowPage = 1;

      // this.getData();
    },
    getData() {
      this.loading = 1;
      var params = {
        pageShow: this.pageShow,
        nowPage: this.nowPage,
        totalNum: this.totalNum,
        keyword: this.keyword,
        sortBy: this.sortBy,
        sortType: this.sortType,
        ranNum: Math.random(),
        terminalType: '02'
      }
      this.loadEnd = false;
      this.$http.get('/itemsearch/toProductList', params, res => {
        this.loading = 0;
        this.fil = 1;
        this.loadEnd = true;
        if (res.list && res.list.length > 0) {
          this.empty = 0;
          if (res.totalNum) {
            this.totalNum = !res.totalNum ? 100 : res.totalNum;
            this.pageCount = Math.ceil(res.totalNum / this.pageShow);
          };
          this.proList = this.proList.concat(res.list);
        } else {
          this.empty = 1;
          this.fil = 0;
        }
      })
    },
    loadMore() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.nowPage < this.pageCount) {
        this.nowPage++
      }
    }
  },
  head() {
    return {
      title: 'T严选商城-商品搜索',
    }
  }
}

</script>
