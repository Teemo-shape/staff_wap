<template>
  <div class="experience">
    <yd-navbar title="用户体验中心">
      <a slot="left" @click="$router.back()">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
    </yd-navbar>
    <div class="hei">
      <yd-slider autoplay="5000" class="hb">
        <yd-slider-item v-for="(n,i) in swiperSlides" :key="i">
          <a :href="n.link">
            <img :src="n.url">
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>
    <div class="yd-tab">
      <ul class="yd-tab-nav">
        <li :class="item.active?'yd-tab-nav-item yd-tab-active':'yd-tab-nav-item'" v-for="(item,i) in tabList" :key="i" @click="change(i)">
          <a href="javascript:;">{{item.title}}</a>
        </li>
      </ul>
    </div>
    <div v-show="tabList[0].active">
      <div class="ru">
        <ul>
          <li v-for="(item,index) in listTop" :key="index">
            <a :href="item.path">
              <img :src="item.src" />
              <div>
                {{item.name}}
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <div class="donn">联系客服</div>
        <div class="left">
          <img src="/img/kf.png" />
          <p>24小时在线客服</p>
          <p>为您提供专业的客户服务</p>
          <div class="go" @click="go">立即咨询>></div>
        </div>
        <div class="right">
          <img src="/img/dh.png" />
          <p>7*24小时热线客服</p>
          <p>为您提供专业的客户服务</p>
          <div class="f">
            <a href="tel:4008-123456">4008-123456</a>
          </div>
        </div>
      </div>
    </div>
    <div v-show="tabList[1].active" class="shequ">
      <div class="hotAvtivity" v-for="(item,i) in hotData" :key="i">
        <div class="hotImg">
          <img :src="item.pic" alt="">
        </div>
        <div class="hotBottom">
          <div>
            <span>{{item.title}}</span>
          </div>
          <a :href="item.url" class="join">立即参加</a>
        </div>
      </div>
      <div class="cutLine"></div>
      <div class="luntan">
        <div class="l-header">
          <span>精华推荐</span>
          <a href="http://fans.tcl.com/forum/">查看全部</a>
        </div>
        <ul class="detail">
          <li v-for="(item,i) in jhData" :key="i" @click="goDetail(item)">
            <div class="l-title">
              <span class="pingce">{{'['+item.forumname+']'}}</span>   
              <div class="l-title-right">
                <div class="viewNum">
                  <img src="/img/tiyan/viewNum.png" alt="">
                  <span>{{item.views}}</span>
                </div>
                <div class="mesNum">
                  <img src="/img/tiyan/message.png" alt="">
                  <span>{{item.replies}}</span>
                </div>
              </div>
            </div>
            <p class="l-content">{{item.title}}</p>
            <div class="l-img" v-show="item.images&&item.images.length>0">
              <img :src="sItem" alt="" v-for="(sItem,index) in item.images" :key="index">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-show="tabList[2].active" class="jifen">
      <div class="jf-header">
        <a :href="earnJf">
          <img src="/img/tiyan/morejf.png" alt="">
        </a>
      </div>
      <div class="jf-duihuan">
        <span>积分兑换</span>
        <a :href="exchangeJf">更多兑换</a>
      </div>
      <ul class="jf-content">
        <li  v-for="(item,i) in jfData" :key="i">
          <a :href="item.productUrl">
            <img :src="item.imgUrl" alt="">
            <p>{{item.productName}}</p>
            <p>积分: {{item.price}}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty",
  head() {
    return {
      title: "TCL用户体验中心"
    };
  },
  data() {
    return {
      listTop: [
        {
          src: "/img/wx.png",
          name: "我要维修",
          path: "/service/repair-install?type=repair"
        },
        {
          src: "/img/az.png",
          name: "我要安装",
          path: "/service/repair-install?type=install"
        },
        { src: "/img/jd.png", name: "服务进度", path: "/service/searchResult" },
        { src: "/img/zc.png", name: "服务政策", path: "/service/policy" },
        {
          src: "/img/lq.png",
          name: "领取积分",
          path: "http://hy.tcl.com/wap/product/myproduct.html"
        },
        { src: "/img/jc.png", name: "产品教程", path: "/service/tutorial" },
        { src: "/img/zzjc.png", name: "自助检测", path: "/service/self-help" },
        {
          src: "/img/fp.png",
          name: "电子发票",
          path: "http://chaxunfapiao.com"
        }
      ],
      earnJf: "http://m.user.tcl.com/proxy/integral",
      exchangeJf: "http://hy.tcl.com/wap/default",
      list: [],
      swiperSlides: [],
      hotData: [], //热门数据
      jhData: [], //精华数据
      jfData: [], //积分商品
      tabList: [
        { title: "自助服务", active: true },
        { title: "社区精华", active: false },
        { title: "积分兑换", active: false }
      ]
    };
  },
  mounted() {
    this.getData();
    this.getAd();
    this.earnJf =
      document.domain == "m.tcl.com"
        ? "http://m.user.tcl.com/proxy/integral"
        : "http://m.testuser.tclo2o.cn/proxy/integral";
    this.exchangeJf =
      document.domain == "m.tcl.com"
        ? "http://hy.tcl.com/wap/default"
        : "http://jf.10get.com/wap/default";
    document.domain == "m.tcl.com"
      ? (this.listTop[4].path = "http://hy.tcl.com/wap/product/myproduct.html")
      : (this.listTop[4].path ="http://jf.10get.com/wap/product/myproduct.html");
  },
  methods: {
    goBack() {
      var obj = this.$http.isUniFunc();
      obj.isUni && (window.location.href = obj.host);
      !obj.isUni && this.$router.push({ path: "/my" });
    },
    getData() {
      this.$http.post("/servicecenter/getCommonProblems", {}, res => {
        this.list = res.retData.subCotentCategorys;
      });
    },
    getAd() {
      this.$http.post("/bannerpic/getBannerPicList", { type: 1 }, res => {
        this.swiperSlides = res.data;
      });
    },
    go() {
      window.open("http://wap.service.tcl.com/web/");
    },
    //热门活动
    getHotActivity() {
      this.$http.get("/usercenter/tclcustomer/getHotActivity", {}, res => {
        this.hotData = res.data;
      });
    },
    //精华主题
    getDigestPost() {
      this.$http.get("/usercenter/tclcustomer/getDigestPost", {}, res => {
        this.jhData = res.data;
      });
    },
    goDetail(item) {
      window.location.href = item.url;
    },
    getJfGoods() {
      this.$http.get("/integral/getHotGoods", {}, res => {
        this.jfData = res.data;
      });
    },
    change(index) {
      this.tabList.map((x, i) => {
        index === i ? (x.active = true) : (x.active = false);
      });
      if (index == 1) {
        this.getHotActivity();
        this.getDigestPost();
      } else if (index == 2) {
        this.getJfGoods();
      }
    }
  }
};
</script>
