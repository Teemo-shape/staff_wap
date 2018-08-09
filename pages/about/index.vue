<template>
  <div class="about">
    <yd-navbar title="关于TCL">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>

    <div class="cell">
      <div class="yd-grids-2">
        <a :href="'/group/'+menu[n]" target="_blank" class="yd-grids-item" v-for="n in 8" :key="n">
          <div class="yd-grids-txt">
            <span>
              <img :src="'/img/a'+n+'.png'">
            </span>
          </div>
        </a>
      </div>
    </div>
    <footer class="footer">
      <p class="conact">服务热线：4008123456
        <a href="tel:4008123456">
          <span class="iky-tell"></span>
        </a>关注我们
        <a href="http://weibo.com/tcljituan?topnav=1&wvr=5&topsug=1" target="_blank">
          <span class="iky-weibo"></span>
        </a>
        <!--<span class="iky-webchat-o"></span>-->
      </p>
      <p class="lang">
        <span class="active">中文</span>
        <span>
          <a href="http://news.tcl.com/MobileEn.php">English</a>
        </span>
      </p>
      <div class="copy-right">
        <span class="iky-tcl-logo"></span>
        <p>&copy; 2010-2016 TCL CORPORATION All Rights Reserved. </p>
        <p> TCL集团股份有限公司版权所有 粤ICP备05040863号 </p>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menu: [
        '',
        'companyInfo/index',
        'societyDuty/index',
        'investors/index',
        'news/index',
        'recruitment/index',
        'companyInfo/userProvision',
        'companyInfo/privacyProtection',
        'companyInfo/legalNotices',
      ]
    }
  },
  head() {
    return {
      title: 'TCL官网-关于TCL',
    }
  }
}
</script>
