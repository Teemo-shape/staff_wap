<template>
  <div class="index">
    <!-- 搜索框 -->
    <div :class="isFixed?'searchbox active':'searchbox'" id="search">
      <!-- <router-link class="iky-tcl-logo" :to="{path:'/'}"></router-link> -->
      <div class="search-box" @click="$router.push({path:'/search'})">
          <div class="t-logo">T严选</div>
          <span class="iky-search"></span>
          <input class="iky-search" type="text" placeholder="搜索商品名称" value=""/>

      </div>
    </div>

     <!-- 大banner -->
    <yd-slider class="hb" autoplay="3000">
      <!-- <yd-slider-item v-for="(n,i) in banners" :key="i"> -->
      <yd-slider-item v-for="(n,i) in topbanners" :key="i">
        <a :href="n.href">
          <img :src="n.src" :alt="n.alt">
        </a>
      </yd-slider-item>
    </yd-slider>

   <div class="zhuanti" v-if="zhuanti&&zhuanti.length>1">
      <a :href="item.href" v-for="(item,i) in zhuanti" :key="i">
        <div class="yd-grids-txt">
          <img :src="item.src" :alt="item.alt">
        </div>
      </a>
    </div>

  <!-- 明星产品推荐 -->
  <div class="z-box idot-pro">
    <div class="grids-title">
      <div class="g-title-l">
        <p class="main-t">{{startitle}}</p>
        <span class="sub-t">员工专享福利</span>
      </div>
       <!-- <a class="z-more z-red-more" :href="starmore">更多
         <span class="iky-more"></span>
       </a> -->
    </div>

    <div class="grids-wrap idot-pro-grids">
      <div class="z-box-list">
          <a :href="item.url" v-for="(item,i) in star" :key="i">
            <div class="img-wrapper">
              <img :src="item.imageUrl">
            </div>
           <p class="title">{{item.titleName}}</p>
           <p class="price">¥{{item.price}}</p>
          </a>
          <a class="more" :href="starmore" v-if="isMore">
            <p class="chinese">查看更多</p>
            <p class="english">See more</p>
          </a>
      </div>
    </div>
  </div>

  <!-- 小banner -->
  <yd-slider class="s-banner" autoplay="3000">
      <!-- <yd-slider-item v-for="(n,i) in banners" :key="i"> -->
    <yd-slider-item v-for="(item,i) in midbanners" :key="i">
      <a :href="item.url">
        <img :src="item.src" :alt="item.alt">
      </a>
    </yd-slider-item>
</yd-slider>

<!-- 热卖产品 -->
<div class="z-box hot-sale">
    <div class="grids-title">
      <div class="g-title-l">
        <p class="main-t">{{hottitle}}</p>
      </div>
       <a class="z-more" :href="hotmore">更多
         <span class="iky-more"></span>
       </a>
    </div>
    <div class="hot-sale-list">
     <a class="link-pic" :href="item.url" v-for="(item,i) in hot" :key="i" v-if="i<=4">
       <img :src="item.imageUrl">
     </a>
     <div class="clear"></div>
    </div>
</div>

<!-- T严选精品推荐  -->
<div class="T-yx">
   <div class="T-main-title">T严选精品推荐</div>
   <div class="T-list">
      <a :href="item.url" v-for="(item,i) in tuijian" :key="i">
        <div class="img-wrap">
          <img :src="item.imageUrl">
       </div>
       <p class="T-title">{{item.titleName}}</p>
        <p class="price-wrap">
           <span class="new-price">¥{{item.staffPrice}}</span>
           <span class="old-price">¥{{item.price}}</span>
         </p>
     </a>
   </div>
</div>
</div>
</template>
<script>
import db11 from '~/components/db11';
import http from '~/plugins/http';

let toggleFixed = null;

export default {
  components: { db11 },
  layout: 'tabbar',
  data() {
    return {
      isMore:false,//明星产品是否大于10
      isFixed: false,
      zhuanti:[],
      topbanners:[],
      midbanners:[],
      star: [],
      startitle:"明星产品",
      hottitle:"热卖产品",
      starmore:"javascript:;",
      hotmore:"javascript:;",
      hot: [],
      tuijian:[],
      ZtestBanners:[   //大banner
        {
          alt:'',
          href:'www.baidu.com',
          src:'/img/test-p/test-banner.png',
        }
      ],
      ZtestSbanners:[   //小banner
        // {
        //   alt:'',
        //   href:'www.baidu.com',
        //   src:'/img/test-p/test-p14.png',
        // }
      ],
      ZtestZhuanti:[    //专题
        {
          bigImageUrl:"/img/test-p/test-p15.png",
          opeTime:"2017-10-11 15:30:52.0",
          oper:"SysManager0000000035",
          orderNum:"1",
          smallImageUrl:"/img/test-p/test-p15.png",
          state:"1",
          titleName:"专题2",
          url:"http://hy.tcl.com",
          uuid:"b3ead218f9bc4138ab330a5e24434477"
        },
        {
          bigImageUrl:"/img/test-p/test-p16.png",
          opeTime:"2017-10-11 15:30:52.0",
          oper:"SysManager0000000035",
          orderNum:"1",
          smallImageUrl:"/img/test-p/test-p16.png",
          state:"1",
          titleName:"专题2",
          url:"http://hy.tcl.com",
          uuid:"b3ead218f9bc4138ab330a5e24434477"
        },
        {
          bigImageUrl:"/img/test-p/test-p21.png",
          opeTime:"2017-10-11 15:30:52.0",
          oper:"SysManager0000000035",
          orderNum:"1",
          smallImageUrl:"/img/test-p/test-p21.png",
          state:"1",
          titleName:"专题2",
          url:"http://hy.tcl.com",
          uuid:"b3ead218f9bc4138ab330a5e24434477"
        }

      ],
       ZtestIdot:[    //明星推荐
        {
          imageUrl:"/img/test-p/test-p27.png",
          titleName:"65英寸量子点曲面电视",
          price:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p20.png",
          titleName:"黑莓KEYone手机 银色",
          price:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p17.png",
          titleName:"TCL除醛除霾加湿空气净TCL除醛除霾加湿空气净TCL除醛除霾加湿空气净",
          price:"3999.00",
          url:"http://hy.tcl.com"
        }
        ],
       ZtestHot:[    //热卖产品
        {
          imageUrl:"/img/test-p/test-p19.png",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p23.png",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p24.png",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p25.png",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p1.png",
          url:"http://hy.tcl.com"
        }

      ],
      ZtestTYX:[    //T严选精品推荐
        {
          imageUrl:"/img/test-p/test-p27.png",
          titleName:"TCL L55E5800A-UD55英寸高清电视",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p20.png",
          titleName:"黑莓(BlackBerry)KEYone手机 银色",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p26.png",
          titleName:"TCL9公斤免污滚筒洗衣机",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p18.png",
          titleName:"TCL430L对开门无霜风冷冰箱",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p22.png",
          titleName:"TCL云智能除甲醛空气净化器",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        },
        {
          imageUrl:"/img/test-p/test-p17.png",
          titleName:"TCL除醛除霾加湿空气净化器",
          oldPrice:"3999.00",
          newPrice:"3999.00",
          url:"http://hy.tcl.com"
        }
      ]
    }
  },
  methods: {
    toggleFixed() {
      this.isFixed = window.scrollY > 50
    }
  },
  mounted() {
    toggleFixed = this.toggleFixed
    window.addEventListener('scroll', toggleFixed, false);
    // var self=this;
    // this.$http.get('http://10.120.41.9:80/rest/getIndexAdsStaff/wap',null,function (res) {
    //     self.topbanners=res.topAds;
    //     self.zhuanti = res.threeAds;
    //     self.midbanners = res.staffWapBannerAds;
    // })
    //
    // this.$http.get('/wap/specialsubject/getActives',null,function (res) {
    //   if(res.code==0){
    //     //self.zhuanti=res.retData;
    //   }
    //   else {
    //     this.$dialog.alert({ mes: _resData.message});
    //   }
    // })
    // this.$http.get('/homePage/featured/getActiveFeatured',{terminalType:'02'},function (_resData) {
    //   if(_resData.code==0){
    //     let star=[],hot=[],tuijian=[],midbanners=[];
    //     for(var i=0;i<_resData.retData.length;i++){
    //       switch (_resData.retData[i].bestSellingProducts){
    //         case 1:
    //           self.startitle=_resData.retData[i].titleName
    //           self.starmore =_resData.retData[i].url;
    //           star=_resData.retData[i].featuredContents.product
    //           // for(var c=0;c<_resData.retData[i].featuredContents.poster.length;c++){
    //           //   midbanners.push(_resData.retData[i].featuredContents.poster[c])
    //           // }
    //           break;
    //         case 2:
    //           self.hottitle=_resData.retData[i].titleName
    //           self.hotmore =_resData.retData[i].url;
    //           hot.push(_resData.retData[i].featuredContents.poster[0]);
    //           for(var b=0;b<4;b++){
    //             hot.push(_resData.retData[i].featuredContents.product[b]);
    //           }
    //           break;
    //         case 3:
    //           tuijian=_resData.retData[i].featuredContents.product
    //           // for(var c=0;c<_resData.retData[i].featuredContents.poster.length;c++){
    //           //   midbanners.push(_resData.retData[i].featuredContents.poster[c])
    //           // }
    //           break;
    //       }
    //     }
    //
    //     self.star=star
    //     self.hot=hot
    //     self.tuijian=tuijian
    //     self.midbanners=midbanners
    //   }
    //   else{
    //     this.$dialog.alert({ mes: _resData.message});
    //   }
    // })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', toggleFixed, false)
  },
  async asyncData(context) {
    http.context = context
    let star=[],hot=[],starmore,hotmore,tuijian,isMore;
    let allAd = await http.asyncGet('/getIndexAdsStaff/wap');
    //let _zhuanti = await http.asyncGet('/wap/specialsubject/getActives');
    let _resData=await http.asyncGet('/homePage/featured/getActiveFeatured',{terminalType:'02'});
    let xdata = _resData.retData;
    if(xdata && xdata.length>0){
      for(var i=0;i<_resData.retData.length;i++){
        switch (_resData.retData[i].bestSellingProducts){
          case 1:
            starmore =_resData.retData[i].url;
            let len = _resData.retData[i].featuredContents.product.length;
            console.log(_resData.retData[1].featuredContents.product);
            console.log(len);
            star=len<11?_resData.retData[i].featuredContents.product:_resData.retData[i].featuredContents.product.splice(10,len-10);
            isMore=len<11?false:true;
            //midbanners=_resData.retData[i].featuredContents.poster
            break;
          case 2:
            hotmore = _resData.retData[i].url;
            hot=_resData.retData[i].featuredContents.product
            //midbanners=_resData.retData[i].featuredContents.poster
            break;
          case 3:
            tuijian=_resData.retData[i].featuredContents.product
            //midbanners=_resData.retData[i].featuredContents.poster
            break;
        }
      }
    }
    let _minxing = await http.asyncGet('/wap/starproduct/getActives')

    var minxing = [], mx = _minxing.retData;

    (mx && mx.length > 0) && mx.map(x => minxing.push({
      title: x.titleName,
      sub: x.origPrice,
      price: x.price.toFixed(2),
      bigImageUrl: x.bigImageUrl,
      smallImageUrl: x.smallImageUrl,
      link: x.url,
    }))

    // 新闻
    let xinwen = await http.asyncGet('/getIndexAds/wap')

    // 单品分类
    let _fenlei = await http.asyncGet('/wap/singlerecommend/selectActive')
    var categroys = {
      '94d25234985844fe96583ef2e0aaf069': 'tv',
      '8e784f67ba3a4eb18f8aae0b7fc269f7': 'air',
      '3de79989b4324f489bbd9a18a8c88f13': 'refrigerator',
      'ae52b41cea714093ba9e3982eb657108': 'washer',
      '59db3d08b3c84a6db0ca4c1649dedb70': 'homeappliance',
      'ded4b2c281454509b191ad92ce2089d5': 'mobile',
      '74f4f7794c154454a3a669c2e462877e': 'other'
    }
    let flData = _fenlei.retData || []
    var cate = flData.categorys || []
    var adv = flData.adverts || []
    var goods = flData.items || []
    var category = []

    cate.map((x) => {
      var obj = {}
      obj.title = x.titleName
      obj.moreLink = x.url
      obj.uuid = x.uuid
      obj.banner = []
      adv.map((y) => {
        if (y.parentId == x.uuid) {
          obj.banner.push({ imgUrl: y.bigImageUrl, link: y.url })
        }
      })

      obj.goods = { lt: {}, rt: [] }
      let _category = `/${categroys[x.uuid]}/`
      var g = goods.filter(m => m.parentId == x.uuid)
      if (g && g.length > 0) {
        var gs = []
        g.map((x) => {
          let url = x.url.indexOf('uuid') > 0 ? _category + x.url.split('uuid=')[1] : x.url
          let obj = {
            guuid: x.productUuid,
            title: x.titleName, sub: x.babyDisplayName, price: x.price.toFixed(2),
            bigImageUrl: x.bigImageUrl, smallImageUrl: x.smallImageUrl, link: url, bgColor: x.bgColor
          }
          if (x.label != null) {
            obj.labelImageUrl = x.label.imageUrl
          }
          gs.push(obj)
        })
        obj.goods = gs
      }
      category.push(obj)
    })

    let body = []
    goods.map(x => body.push({ storeUuid: x.storeUuid, productUuid: x.productUuid }))
    body = JSON.stringify(body)
    let _cuxiao = await http.asyncGet('/wap/singlerecommend/getSingleStorePromotion', { body:body  })
    let cx = _cuxiao.retData
    category.map((x) => {
      x.goods.map((y) => {
        for (var d in cx) {
          if (d == y.guuid && cx[d][0]) {
            // let t = data[d][0]['promotionTypes'];
            let t = cx[d].map(x => x.promotionTypes.join(','))
            let discount = cx[d][0]['discount'];
            (t.indexOf('4') > -1) && (y.type = 'zp');
            (t.indexOf('6') > -1) && (y.type = 'zk');
            (t.indexOf('1') > -1) && (y.type = 'mj');
            (t.indexOf('3') > -1) && (y.type = 'zp');
            ((t.indexOf('5') > -1) && discount < 10) && (y.type = 'zk');
            ((t.indexOf('5') > -1) && discount > 10) && (y.type = 'plj');
          }
        }
      })
    })
    return {
      topbanners:allAd.topAds,
      midbanners:allAd.staffWapBannerAds,
      zhuanti: allAd.threeAds,
      star: star,
      isMore:isMore,
      hot: hot,
      starmore,
      hotmore,
      tuijian: tuijian,
      xdata:_resData
    }

  }
}
</script>
