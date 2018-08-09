<template>
  <div class="searchGoods" id="searchGoods">
    <div class="search-header" id="search-header">
      <span class="titleChannel" @click="$router.go(-1)">
        <span class="iky-arrow-left"></span>
        <h1>{{tit}}</h1>
      </span>
      <a href="/search" class="search-box " :class="{v2:hastopAd}" id="search-box" ref="sbox">
        <span class="iky-search"></span>
        <span class="ctitle">TCL观影王</span>
      </a>
    </div>
    <yd-slider class="height" autoplay="3000" v-if="bannerList">
      <yd-slider-item v-for="(n,index) in bannerList" :key="index">
        <a :href="n.link">
          <img :src="n.url" :alt="n.name">
        </a>
      </yd-slider-item>
    </yd-slider>
    <div class="tj-title" v-if="minxing&&minxing.length > 2">
      <div class="left">新品推荐</div>
      <a @click="recommendGoods" class="right">
        <span>
          <span class="iky-refresh changea"></span>换一批</span>
      </a>
    </div>
    <yd-grids-group :rows="2" class="box rec" v-if="minxing&&minxing.length > 2">
      <div class="list">
        <a v-for="(m,i) in minxing" :key="i" :href="m.link" class="item">
          <p class="title">{{m.title}}</p>
          <p class="sub" v-if="m.sub>m.price">￥{{m.sub}}</p>
          <p class="price">￥{{m.price}}</p>
          <div class="img">
            <img :src="i==0?m.bigImageUrl:m.smallImageUrl" :alt="m.title">
          </div>
        </a>
      </div>
    </yd-grids-group>
    <div class="tiaojian " :class="{pdt25:hastopAd}">
      <ul class="filterBar">
        <a :class="{active:active}" @click="all">全部
          <b>|</b>
        </a>
        <a @click="price">
          <span :class="{active:active1}">价格</span>
          <span class="sortP">
            <span class="iky-arrow-up" :class="{active:price1}"></span>
            <span class="iky-arrow-down" :class="{active:price2}"></span>
          </span>
          <b>|</b>
        </a>
        <a @click="sort">
          <span :class="{active:active2}">销量</span>
          <span class="sortN">
            <span class="iky-arrow-up" :class="{active:num2}"></span>
            <span class="iky-arrow-down" :class="{active:num1}"></span>
          </span>
          <b>|</b>
        </a>
        <a class="last" :class="{active:active3}" @click="filter">筛选
          <span class="iky-filter"></span>
        </a>
      </ul>
      <div class="show" :class="{filterHeight:height}">
        <div class="showSelect" v-for="(item,key) in filterList" :key="key">
          <div class="titleSelect">
            根据{{item.txt}}
            <a class="iky-arrow-up" @click="slide(key)"></a>
          </div>
          <div class="selectList" v-show="refresh">
            <a :class="n.active?'active':''" :data="n.name" v-for="(n,m) in item.list" @click.stop="selectClick(n,item.list)" :key="m">{{n.pro}}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="prolist" tabindex="-1">
      <a :href='item.url' v-for="(item,i) in proList" :key="i">
        <li>
          <img :src="item.pic" class="proImg" :alt="item.name">
          <p class="proTitle" v-html="item.name"></p>
          <p class="proo">
            <span class="proPrice">￥{{(item.promotionPrice?item.promotionPrice:item.price).toFixed(2)}}</span>
            <span v-if='item.promotionPrice!=0&&item.promotionPrice!=item.price' class="proSale">￥{{item.price.toFixed(2)}}</span>
          </p>
        </li>
      </a>
      <div class="pages">
        <a :href="`/${type}?nowPage=${p}`" v-for="(p,i) in pageCount" :key="i">{{p}}</a>
      </div>
      <div class="tip" v-if="showTip">
        {{tip1}}
      </div>
      <div class="null" v-else>
        非常抱歉，没有找到您所要的商品...
      </div>
    </div>
    <db11></db11>
  </div>
</template>
<script>
import db11 from '~/components/db11';
import http from '~/plugins/http'
import axios from 'axios'
const cuuids = { tv: '456a4e26d34540eab1b31c7212a5fd98', mobile: '9dcd3d03e0674150831553d1bcd86176', air: '325fe3718b3f4d4f8abe611373df821a', refrigerator: 'bbef5c0d59e74f04a1aadcc8003d9511', washer: '51dc2554485d4c549503a63298c34fae', homeappliance: '778c3418ca0a459b925a1edd09620c88' }
const headerToggle = () => {
  let obj = document.getElementById('search-header');
  obj && (obj.className = window.scrollY > 50 ? 'search-header header-scroll' : 'search-header')
}
let upload = null;

export default {
  layout: 'tabbar',
  components: { db11 },
  data() {
    return {
        hastopAd:true,
      refresh: true, ad: [], tit: '', minxing: [], data: '', tip1: '',
      price1: false, num1: false, price2: false, num2: false, selectList: true, showTip: true, height: true, active: true, active1: false, active2: false, active3: false, proList: [],
      bannerList: [], nowPage: 1, Page: 1, totalNum: 100, keyword1: ';;', catgoryid: '', sortBy: 'sortWeight', sortType: 1, categorysStr: '',
      channel: '',
      cText: {
        tv: [{
          txt: '价格选择',
          value: ['0-2000', '2000-3999', '4000-5999', '6000-7999', '8000-9999', '10000-14999', '15000-24999', '25000以上'],
          key: ['价格区间-零到两千', '价格区间-两千到三千九', '价格区间-四千到五千九', '价格区间-六千到七千九', '价格区间-八千到九千九', '价格区间-一万到一万四千九', '价格区间-一万五到两万四千九', '价格区间-两万五以上']
        }, {
          txt: '尺寸选择',
          value: ['32英寸', '40-43英寸', '48-50英寸', '55-60英寸', '60英寸以上'],
          key: ['尺寸-32', '尺寸-40-43', '尺寸-48-50', '尺寸-55-60', '尺寸-60以上']
        }, {
          txt: '特色选择',
          value: ['量子点', '曲面屏', '高色域', '4K超高清', '安卓智能'],
          key: ['屏幕类型-量子点', '屏幕类型-曲面电视', '色域-高色域', '分辨率-3840*2160（4K分辨率/UHD）', '电视类型-智能电视,操作系统-Android']
        }],
        mobile: [{
          txt: '价格选择',
          value: ['0-999', '1000-1999', '2000-2999', '3000-3999', '4000-4999', '5000以上'],
          key: ['价格区间-零到九百', '价格区间-一千到一千九', '价格区间-两千到两千九', '价格区间-三千到三千九', '价格区间-四千到四千九', '价格区间-五千以上']
        }, {
          txt: '屏幕尺寸筛选',
          value: ['3.5 英寸以下', '3.6-4.5英寸', '4.6-5.5英寸', '5.5英寸以上'],
          key: ['屏幕尺寸-手机-3.5英寸以下', '屏幕尺寸-手机-3.6-4.5英寸', '屏幕尺寸-手机-4.6-5.5英寸', '屏幕尺寸-手机-5.5英寸以上']
        }, {
          txt: '系列筛选',
          value: ['黑莓系列', '平板系列', '手机配件'],
          key: ['系列-黑莓系列', '系列-平板系列', '系列-手机配件']
        }],
        washer: [{
          txt: '价格选择',
          value: ['0-499', '500-999', '1000-1499', '1500-1999', '2000-2499', '2500-2999', '3000以上'],
          key: ['价格区间-零到四百九', '价格区间-五百到九百九', '价格区间-一千到一千四百九', '价格区间-一千五到一千九百九', '价格区间-两千到两千四百九', '价格区间-两千五到两千九百九', '价格区间-三千以上']
        }, {
          txt: '体积容量筛选',
          value: ['5kg以下', '5-6kg', '6-7kg', '7-8kg', '8kg以上'],
          key: ['脱水容量-5以下', '脱水容量-5-6', '脱水容量-6-7', '脱水容量-7-8', '脱水容量-8以上']
        }, {
          txt: '类别筛选',
          value: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频'],
          key: ['洗衣机类别-波轮变频', '洗衣机类别-波轮全自动', '洗衣机类别-滚筒变频', '洗衣机类别-滚筒定频']
        }],
        refrigerator: [{
          txt: '价格选择',
          value: ['0-999', '1000-1999', '2000-2999', '3000-3999', '4000-4999', '5000以上'],
          key: ['价格区间-零到九百', '价格区间-一千到一千九', '价格区间-两千到两千九', '价格区间-三千到三千九', '价格区间-四千到四千九', '价格区间-五千以上']
        }, {
          txt: '体积容量筛选',
          value: ['100L以下', '101L-200L', '201L-300L', '301L-500L', '500L以上'],
          key: ['总有效容积（L）-100L以下', '总有效容积（L）-101-200L', '总有效容积（L）-201-300L', '总有效容积（L）-301-500L', '总有效容积（L）-500L']
        }, {
          txt: '类别筛选',
          value: ['单门式', '双门式', '三门式', '多门式', '对开门式'],
          key: ['冰箱类别-单门式', '冰箱类别-双门式', '冰箱类别-三门式', '冰箱类别-多门式', '冰箱类别-对开门式']
        }],
        air: [{
          txt: '价格选择',
          value: ['1000-1999', '2000-2999', '3000-3999', '4000-4999', '5000-5999', '6000-6999', '7000以上'],
          key: ['价格区间-一千到一千九', '价格区间-两千到两千九', '价格区间-三千到三千九', '价格区间-四千到四千九', '价格区间-五千到五千九', '价格区间-六千到六千九', '价格区间-七千以上']
        }, {
          txt: '匹数筛选',
          value: ['1匹', '1.5匹', '2匹', '3匹'],
          key: ['匹数-1P', '匹数-1.5P', '匹数-2P', '匹数-3P']
        }, {
          txt: '特点筛选',
          value: ['壁挂式', '立柜式', '圆柱式', '移动式'],
          key: ['特点-壁挂式', '特点-立柜式', '特点-圆柱式', '特点-移动式']
        }, {
          txt: '变频/定频筛选',
          value: ['变频', '定频'],
          key: ['定频/变频-变频', '定频/变频-定频']
        }],
        homeappliance: [{
          txt: '价格选择',
          value: ['0-999', '1000-1999', '2000-2999', '3000-4999', '5000-10000', '10000以上'],
          key: ['价格区间-零到九百', '价格区间-一千到一千九', '价格区间-两千到两千九', '价格区间-三千到四千九', '价格区间-五千到一万', '价格区间-一万以上']
        }, {
          txt: '类别筛选', value: ['空气净化器', '净水机', '吸尘器', '除螨仪', '电热水器', '加湿器', '扫地机', '挂烫机','配件'], key: ['空气净化器', '净水机', '吸尘器', '除螨仪', '电热水器', '加湿器', '扫地机', '挂烫机','健康电器配件']
        }],
         other: [{
              txt: '价格选择',
              value: ['0-999', '1000-1999', '2000-2999', '3000-4999', '5000-10000', '10000以上'],
              key: ['价格区间-零到九百', '价格区间-一千到一千九', '价格区间-两千到两千九', '价格区间-三千到四千九', '价格区间-五千到一万', '价格区间-一万以上']
          }]
      },
      filterList: [], url: '', type: '', keywords: [], loadEnd: true, pageCount: 0,
    }
  },
  created() {
    // this.type = this.$route.query.catgoryid;
    this.type = this.$route.params.goods;
    // this.getData()
    if(!cuuids[this.type]){
        this.catgoryid = this.$route.query.catId;
        this.channel = this.type
        this.queryUrl ='/newchannel/'+this.channel+'?catId='+this.$route.query.catId+'&choose='+this.$route.query.choose+'&keyword='+this.$route.query.keyword;
        // 筛选
        if(!cuuids[this.$route.query.choose]){
            this.filterList = this.cText["other"]
        }else{
            this.filterList = this.cText[this.$route.query.choose]
        }

        this.filterList.map(o => {
            o.list = []
            o.key.map((m, n) => {
                o.list.push({
                    active: false,
                    name: m,
                    pro: o.value[n]
                })
            })
        })
    }else{
        this.catgoryid = cuuids[this.type];
        this.channel = this.type
        switch (this.type) {
            case "refrigerator": this.channel = 'toIcebox'; this.tit = '冰箱'; break;
            case "homeappliance": this.channel = 'toHealthEleKuyu'; this.tit = '健康电器'; break;
            case "washer": this.channel = 'toIceWash'; this.tit = '洗衣机'; break;
            case "tv": this.tit = '电视'; break;
            case "air": this.tit = '空调'; break;
            case "mobile": this.tit = '手机'; break;
        }
        this.queryUrl = '/newchannel/' + this.channel;
        // 筛选
        this.filterList = this.cText[this.type]
        this.filterList.map(o => {
            o.list = []
            o.key.map((m, n) => {
                o.list.push({
                    active: false,
                    name: m,
                    pro: o.value[n]
                })
            })
        })
    }

  },
  mounted() {
    typeof document !== 'undefined' && (this.$refs.sbox.style.width = 77 - (this.tit.length - 2) * 4 + '%')
    this.getNTKF(this.type)
    upload = this.upload
    window.addEventListener('scroll', headerToggle, false)
    window.addEventListener('scroll', upload, false)
  },
  watch: {
		/* $route(v) {
			this.type = v.params.goods;
			// this.type = v.query.catgoryid;
			this.catgoryid = cuuids[this.type];
			this.nowPage = 1
			this.getData()
			this.getNTKF(this.type)
		}, */
    nowPage(v) {
      this.tip1 = '加载中...'
      this.queryList()
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', headerToggle, false)
    window.removeEventListener('scroll', upload, false)
  },
  methods: {
    getNTKF(cid) {
      /*频道页分类名称，相应的cateUuid 对应相应的频道*/
      var channelObj = {
        "tv": "电视",
        "mobile": "手机",
        "air": "空调",
        "toIcebox": "冰箱",
        "toIceWash": "洗衣机",
        "toHealthEleKuyu": "健康电器"
      };
      // window.NTKF_PARAM && (window.NTKF_PARAM['ntalkerparam'] = {
      // 	category: channelObj[cid] //分类名称，多分类可以用分号(;)分隔， 长路径父子间用冒号(:)分割
      // })
    },
    getData() {
      // this.getChannelAds()
      this.all()
      this.upload()
      // this.recommendGoods()
    },
    upload() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.nowPage < this.pageCount && (this.proList.length > 0)) {
        this.nowPage++
      }
    },
    queryList() {
      this.loadEnd = false
      this.$http.get(this.queryUrl, {
        terminalType: '02',
        nowPage: this.nowPage,
        pageShow: 8,
        totalNum: !this.totalNum ? 100 : this.totalNum,
        keyword1: this.keyword1,
        categoryUuid: this.catgoryid,
        sortBy: this.sortBy,
        sortType: this.sortType,
        categorysStr: this.categorysStr
      }, res => {
        this.loadEnd = true
        if (!this.catgoryid) {
          this.$dialog.alert({ mes: '参数丢失' })
          return false
        }
        if (res.list && res.list.length == 0) {
          this.tip1 = ''
          this.showTip = false
          this.proList = []
        } else {
          this.showTip = true
          this.totalNum = !res.totalNum ? 100 : res.totalNum
          this.pageCount = Math.ceil(!this.totalNum ? 100 : this.totalNum / 8);
          if (this.nowPage == 1) {
            this.proList = res.list
          } else {
            res.list.map(o => {
              this.proList.push(o)
            })
          }
          // this.nowPage == 1 ? this.proList = res.list : this.proList.concat(res.list)
          this.proList.map(o => {
            o.url = o.uuid ? `/${this.type}/${o.uuid}` : ''
          });

          if (this.pageCount > this.nowPage) {
            this.tip1 = '加载中...'
            //						this.loadEnd = true
          } else {
            this.tip1 = '后面没有了...'
          }
        }
      })
    },
		/* getChannelAds() {
			let chn = this.channel
			if (chn == 'toIceWash') chn = 'washer'
			if (chn == 'toHealthEleKuyu') chn = 'health'
			if (chn == 'toIcebox') chn = 'refrigerator'
			this.$http.post('/getChannelAds/wap', {
				terminalType: '02',
				channel: chn
				//					channel: 'air'
			}, res => {
				this.bannerList = res
			})
		}, */
    all() {
      this.nowPage = 1; this.active = true; this.active1 = false; this.active2 = false; this.active3 = false;
      this.price1 ? this.price1 = false : this.price2 = false
      this.num1 ? this.num1 = false : this.num2 = false
      this.height = true; this.sortBy = 'sortWeight';
      this.keywords = []; this.totalNum = 100; this.keyword1 = ';;'; this.sortType = 1; this.categorysStr = ''
      this.filterList.map(o => o.list.map(x => x.active = false))
      this.queryList()
    },
    price() {
      this.nowPage = 1
      this.active = false
      this.active1 = true
      this.active2 = false
      this.active3 = false
      this.num1 = this.num2 = false
      this.price1 = !this.price1
      this.price1 ? this.price2 = false : this.price2 = true
      this.price1 ? this.sortType = 2 : this.sortType = 1
      this.height = true
      this.sortBy = 'price'
      this.queryList()
    },
    sort() {
      this.nowPage = 1
      this.active = false
      this.active1 = false
      this.active2 = true
      this.active3 = false
      this.height = true
      this.price1 = this.price2 = false
      this.num1 = !this.num1
      this.num1 ? this.num2 = false : this.num2 = true
      this.num1 ? this.sortType = 1 : this.sortType = 2
      this.sortBy = 'salsnum'
      this.queryList()
    },
    filter() {
      this.active = false
      this.active1 = false
      this.active2 = false
      this.active3 = !this.active3
      this.height = !this.height
      this.price1 ? this.price1 = false : this.price2 = false
      this.num1 ? this.num1 = false : this.num2 = false
    },
    recommendGoods() {
      this.$http.post('/wap/channelrecommend/getActives', this.data, res => {
        var mx = res.retData;
        this.minxing = [];
        (mx && mx.length > 0) && mx.map(x => this.minxing.push({
          title: x.titleName,
          sub: x.origPrice.toFixed(2),
          price: x.price.toFixed(2),
          bigImageUrl: x.bigImageUrl,
          smallImageUrl: x.smallImageUrl,
          link: x.url,
        }))
        var uuids = []
        mx.map(o => {
          uuids.push(o.uuid)
        })
        this.data = { uuids: uuids.join(',') }
      })
    },
    slide(key) {
      var k = document.getElementsByClassName('selectList')
      var b = document.getElementsByClassName('titleSelect')[key].getElementsByTagName('a')[0]
      for (var i = 0; i < k.length; i++) {
        if (i == key) {
          if (!k[i].style.height) {
            b.className = 'iky-arrow-up change'
            k[i].style.height = 0
            k[i].style.borderTop = 'none';
          } else {
            k[i].removeAttribute('style')
            b.className = 'iky-arrow-up'
          }
        }
      }
    },
    selectClick(item, list) {
      //老的失焦，移除搜索列表
      let old = list.filter(x => x != item && x.active)[0]
      old && (old.active = false, this.keywords.splice(this.keywords.indexOf(old.name), 1))

      item.active = !item.active; this.refresh = false; this.refresh = true
      item.active ? (this.keywords.push(item.name), this.nowPage = 1) : this.keywords.splice(this.keywords.indexOf(item.name), 1)
      this.keyword1 = this.keywords.join(';'); this.queryList()
      return false
    }
  },

  async asyncData(context) {
    http.context = context
    let params = context.params
    let query = context.query
    let type = params.goods
    if (['tv', 'mobile', 'refrigerator', 'washer', 'air', 'homeappliance', '_nuxt'].indexOf(type) < 0) {
        if(type.length == 32) {
            context.redirect(`/other/${type}`)
        }else{
            if(context.query.catId.length != 32){
                context.redirect('/404')
            }

        }
    }
    let typeUrl,tit,queryUrl,channel,_list,bannerList,list,proList,totalNum,pageCount,hastopAd;
      if (['tv', 'mobile', 'refrigerator', 'washer', 'air', 'homeappliance', '_nuxt'].indexOf(type) < 0) {
          typeUrl = type
          tit = ''
          //大图广告
          var queryAds = {
              pageNo:""
          }
          queryAds.pageNo=type;
          channel = type
          bannerList = await http.asyncPost('/bannerpic/getBannerPictures', queryAds);
          bannerList=bannerList.data;
          if(bannerList){
              hastopAd=false;
          }else{
             hastopAd=true;
          }

          // 加载商品列表
          queryUrl ='/newchannel/'+type+'?catId='+context.query.catId+'&choose='+context.query.choose+'&keyword='+context.query.keyword;
          let _list = await http.asyncGet(queryUrl, {
              terminalType: '02',
              nowPage: query.nowPage || 1,
              pageShow: query.pageShow || 8,
              totalNum: query.totalNum || 100,
              keyword1: query.keyword || ';;',
              categoryUuid: query.catId,
              sortBy: query.sortBy || 'sortWeight',
              sortType: query.sortType || 1,
              categorysStr: query.categorysStr || ''
          })
          proList = [], list = _list.list
          list && list.length > 0 && list.map((x) => {
              proList.push({
                  name: x.name,
                  price: x.price,
                  promotionPrice: x.promotionPrice,
                  uuid: x.uuid,
                  pic: x.pic,
                  url: `/${type}/${x.uuid}`
              })
          })
          //页码
          totalNum = _list.totalNum || 100
          pageCount = Math.ceil(totalNum / 8);
      }else{
           typeUrl = type
           tit = ''
          switch (type) {
              case "refrigerator": typeUrl = 'toIcebox'; tit = '冰箱'; break;
              case "homeappliance": typeUrl = 'toHealthEleKuyu'; tit = '健康电器'; break;
              case "washer": typeUrl = 'toIceWash'; tit = '洗衣机'; break;
              case "tv": tit = '电视'; break;
              case "air": tit = '空调'; break;
              case "mobile": tit = '手机'; break;
          }
           queryUrl = '/newchannel/' + typeUrl;

          //大图广告
           channel = type
          if (type == 'homeappliance') channel = 'health'
           bannerList = await http.asyncPost('/getChannelAds/wap', { terminalType: '02', channel: channel });

          if(bannerList){
              hastopAd=false;
              let bannerListTemp=[];
              for(let i=0;i<bannerList.length;i++){
                  bannerListTemp.push({
                      link:bannerList[i].href,
                      url:bannerList[i].src,
                      name:bannerList[i].alt
                  })
              }
              bannerList=bannerListTemp;
              console.log(bannerList);
          }else{
              hastopAd=true;
          }
          // 加载商品列表
          let _list = await http.asyncGet(queryUrl, {
              terminalType: '02',
              nowPage: query.nowPage || 1,
              pageShow: query.pageShow || 8,
              totalNum: query.totalNum || 100,
              keyword1: query.keyword || ';;',
              categoryUuid: cuuids[type],
              sortBy: query.sortBy || 'sortWeight',
              sortType: query.sortType || 1,
              categorysStr: query.categorysStr || ''
          })
           proList = [], list = _list.list
          list && list.length > 0 && list.map((x) => {
              proList.push({
                  name: x.name,
                  price: x.price,
                  promotionPrice: x.promotionPrice,
                  uuid: x.uuid,
                  pic: x.pic,
                  url: `/${type}/${x.uuid}`
              })
          })
          //页码
           totalNum = _list.totalNum || 100
           pageCount = Math.ceil(totalNum / 8);
      }

    // 换一换推荐
   // let _minxing = await http.asyncPost('/wap/channelrecommend/getActives')
      let _minxing = [];
    var minxing = [], mx = _minxing.retData;

    var uuids = [];

    (mx && mx.length > 0) && mx.map(x => {
      minxing.push({
        title: x.titleName,
        sub: x.origPrice.toFixed(2),
        price: x.price.toFixed(2),
        bigImageUrl: x.bigImageUrl,
        smallImageUrl: x.smallImageUrl,
        link: x.url,
      }); uuids.push(x.uuid)
    })

    let data = { uuids: uuids.join(',') }



    // 关键字
    let title = type == 'homeappliance' ? '【TCL健康电器】空气净化器_净水器等健康电器–TCL官网' : `【TCL${tit}】TCL${tit}价格_TCL${tit}怎么样–TCL官网`
    let description = `TCL${tit}官方渠道售卖，TCL商城是TCL集团的网上购物商城，提供正品TCL${tit}产品。全国包邮、正品低价、快速送达、提供正规发票。`
    let keywords = type == 'homeappliance' ? 'TCL健康电器,空气净化器,净水器,TCL官网' : `TCL${tit},TCL${tit}价格,TCL${tit}怎么样,TCL官网`
    return {
      tit: tit, data,
      bannerList: bannerList,
      minxing: minxing,
      title: title, description: description, Keywords: keywords,
      proList: proList, totalNum: totalNum, pageCount: pageCount,hastopAd:hastopAd
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'keywords', name: 'keywords', content: this.Keywords }
      ]
    }
  }
}
</script>
