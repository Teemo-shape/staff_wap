<template>
  <div class="__main">
    <nuxt/>
    <yd-popup v-model="v_category" position="bottom" height='100%' class="v_category">
        <!-- 仿美的分类布局↓ -->
      <div class="fake-MeidiCate">
        <div class="search-box" @click="$router.push({path:'/search'})">
            <div class="t-logo">T严选</div>
            <span class="iky-search"></span>
            <input class="iky-search" type="text" placeholder="搜索商品名称" value=""/>
            <span class="icon iconfont-tcl icon-xiaoxipx"></span>
        </div>
         <div class="category-left">
            <ul class="cate-nav">
               <li :class="nowNav === index? 'red': ''" v-for="(item,index) in category" @click="cateNav(index)" :key="item.categoryNo">
                 <span>{{item.categoryName}}</span>
               </li>
            </ul>
         </div>
         <div class="category-right">
             <div class="category-topimg"  v-if="brandsIcon[nowNav]" >
                 <img :src="brandsIcon[nowNav].icon" :alt="brandsIcon[nowNav].name">
             </div>
            <div class="cate-list-wrap" v-for="brand in brands[nowNav]" :key="brand.categoryNo">
              <div class="cate-title" @click="goURL(brand.categoryUrl)">
                 <span class="cate-gray-line"></span>
                 <span class="cate-txt">{{brand.categoryName}}</span>
                 <span class="cate-gray-line"></span>
              </div>
              <div class="cata-list">
                  <a :href="good.categoryUrl" v-for="good in brand.children" :key="good.uuid">
                    <img :src="good.iconPath" :alt="good.categoryNote" @click="goURL(good.categoryUrl)">
                    <p>{{good.categoryName}}</p>
                  </a>
              </div>
            </div>

         </div>
      </div>
    </yd-popup>
    <!-- 底部菜单 -->
    <!--<yd-tabbar fixed color="#333" bgcolor="">-->
      <!--<yd-tabbar-item :rel='(item.path==""||item.path=="/")?"":"nofollow"' :class="{active:item.active}" :title="item.title" v-for="(item,index) in menu" :key="index" @click.native="showCate(item,index)" :link="item.path" :id="'item'+index">-->
        <!--<span class="icon iconfont-tcl " :class="'icon-'+item.icon" slot="icon"></span>-->
      <!--</yd-tabbar-item>-->
    <!--</yd-tabbar>-->
    <footer class="yd-tabbar tabbbar-top-line-color tabbar-fixed" style="color: rgb(9, 187, 7); font-size: 0.24rem;">
        <a v-for="(item,index) in menu" :class="{active:item.active}"  :id="'item'+index" :title="item.title" :href="item.path" class="yd-tabbar-item" rel="" :key="index"  @click.stop="showCate(item,index)"  id="item0" style="color: rgb(51, 51, 51);"><span class="yd-tabbar-icon">
		<span class="icon iconfont-tcl" :class="'icon-'+item.icon"></span> <span class="yd-tabbar-badge"></span>
		</span> <span class="yd-tabbar-txt">{{item.title}}</span></a>
    </footer>
    <!-- 右下角效能客服 -->
    <nav :class="isShowTop?'kf-up in':'kf-up'">
      <a href="javascript:void(0);" class="iky-kefu" onclick="NTKF.im_openInPageChat('kf_9428_1525949700591')"></a>
      <a href="javascript:;" class="iky-arrow-up" onclick="document.documentElement.scrollTop = document.body.scrollTop =0;"></a>
    </nav>
  </div>
</template>
<script>

export default {
  data() {
    return {
      nowNav:0,
      activeKey: 0,
      isshow: true,
      data: {},
      isShowTop: false,
      v_category: false,
      menu: [
        { title: "首页", icon: "shouye", path: "/", active: true, img: "c" },
        { title: "分类", icon: "fenlei", path: "#", img: "g" },
          { title: "客服", icon: "kefu2", path: "#", img: "n" },
        { title: "购物车", icon: "gouwuche3", path: "/cart", img: "m" },
          { title: "个人", icon: "wode", path: process.env.UC || "/my", img: "d" }
      ],
      category: [],
      brands:[],
      brandsIcon:[],
      goods:[],
      other: [
        { title: "关于TCL", icon: "about", path: "/about" },
        { title: "铁粉社区", icon: "bbs", path: "http://fans.tcl.com/" },
        { title: "积分商城", icon: "jf-shop", path: "http://hy.tcl.com/" },
        {
          title: "经销商之家",
          icon: "dealer",
          path: "http://m.tcl.com/tcldealer/dealer/toLogin"
        },
        { title: "员工内购", icon: "emp-buy", path: "http://www.pengpengmall.com/" },
        // { title: "用户体验中心", icon: "uec", path: "/service/uec" }
      ],
      paths: [
        "/",
        "/bulkPurchase",
        "/my",
        "/homeappliance",
        "/my/comments",
        "/tv",
        "/mobile",
        "/refrigerator",
        "/washer",
        "/air"
      ],
      catePaths: [
        "/tv",
        "/mobile",
        "/refrigerator",
        "/washer",
        "/air",
        "/homeappliance"
      ]
    };
  },
  watch: {
    $route(v) {
      this.menu.map(
        x =>
          (x.active =
            x.path == v.path ||
            (x.path == "" &&
              v.path != "/" &&
              this.catePaths.indexOf(v.path) >= 0))
      );
    }
  },
  beforeMount() {
    //客服
    if (typeof window === "undefined") return;
    // OSS 登录
    this.$utils.osslogin();

    var user = this.$utils.getCookie("user");
    var Uid = user ? JSON.parse(user).customerName : ""; //获取用户ID
    window.NTKF_PARAM = {
      siteid: "kf_9428", //企业ID，为固定值，必填
      settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
      // settingid: "kf_9428_1481253249164", //测试环境所用
      uid: Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
      uname: Uid, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
      isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
      userlevel: "1" //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
    };
    window.XNupdate = function(obj) {
      NTKF_PARAM && typeof NTKF !== "undefined" && NTKF.im_updatePageInfo(obj);
    };
    //返利网 old
    var __token = this.$utils.parseQuery("ihome-token");
//    var __fanliCookie = this.$utils.parseQuery("fanliCookie");
//    __fanliCookie && this.$utils.setCookie("fanliCookie", __fanliCookie);
    __token && this.$utils.setCookie("wap_staff_token", __token);

    //监听滚动到顶部
    window.addEventListener("scroll", () => this.showTop(), false);
  },
  updated() {
    this.setBar();
    // (this.catePaths.indexOf(path) >= 0 && path != '/') && (this.menu[1].active = true)
  },
  mounted() {
    this.setBar();
    this.getCategory();
// document.getElementById('item1').removeAttribute('href');
  },
  methods: {
    cateNav(index){
      this.nowNav = index;
    },
    setBar() {
      let path = this.$route.path;
      var that=this;
      this.menu.map(
        function(x,index,arr){
          x.active = x.path == path || (x.path == "#" && path != "/" && that.catePaths.indexOf(path) >= 0 && index !=2 ) || (x.path == "#" && x.icon=="fenlei" && index ==1 && path != "/" && path != "/my")
        }
      );
    },
      getCategory(){
          this.$http.get('/front/product/productcategoryfront/getAllNodesById',{uuid: 'staff_wap'},res => {
              if(res.code == '0'){
                  this.category = res.list;
                  res.list.map((y) => {
                      this.brandsIcon.push({
                          icon:y.iconPath,
                          name:y.categoryName
                      })
                      this.brands.push(y.children);
                  })
              }
          });
      },
    hide() {
      this.v_category = false;
      this.menu[1].active = false;
    },
    showCate(item,index) {
      if (index == 1) {
        this.v_category = !this.v_category;
        this.menu[1].active = this.v_category;
        return false;

      } else if(index==2){
          NTKF.im_openInPageChat('kf_9428_1525949700591')
      }else {
        this.v_category = false;
      }

//      if(index != 2){
//        window.location.href = item.path
//      }else{
//        //是否跳转统一用户中心
//        var obj = this.$http.isUniFunc()
//        obj.isUni && (window.location.href = obj.host+'/proxy/home/index?from='+encodeURIComponent(window.location.href))
//        !obj.isUni && this.$router.push({path:item.path})
//      }
    },
    /*getTopAdv() {
      //顶通广告
      this.$http.get("/homePage/getActiveTopBars?terminalType=02", {}, res => {
        if (res.retData) {
          this.data.src = res.retData.imgUrl;
          this.data.href = res.retData.url;
        }
      });
    },*/
    showTop() {
      this.isShowTop = window.scrollY > 100;
    }
  }
};
</script>
