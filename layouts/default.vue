<template>
  <div class="__main">
    <!-- 顶通广告 -->
    <div class="_7th">
      <a :href="data.href" target="_blank"> <img :src="data.src"> </a>
    </div>
    <nuxt/>
    <nav :class="isShowTop?'kf-up in':'kf-up'" v-show="$route.path.indexOf('/service')<0">
      <a href="javascript:void(0);" class="iky-kefu" onclick="NTKF.im_openInPageChat('kf_9428_1525949700591')"></a>
      <a href="javascript:;" class="iky-arrow-up" onclick="document.documentElement.scrollTop = document.body.scrollTop =0;"></a>
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return { data: {}, isShowTop: false };
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
    //返利网
    var __token = this.$utils.parseQuery("ihome-token");
//    var __fanliCookie = this.$utils.parseQuery("fanliCookie");
//    __fanliCookie && this.$utils.setCookie("fanliCookie", __fanliCookie);
    __token && this.$utils.setCookie("wap_staff_token", __token);
    window.addEventListener("scroll", () => this.showTop(), false);
  },
  mounted() {
//    this.getTopAdv();
 //   this.$http.fanli();
  },
  methods: {
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
