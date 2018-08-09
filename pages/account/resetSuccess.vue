<template>
  <div class="reset-success">
    <yd-layout>
      <yd-navbar title="">
        <router-link to="/" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <div class="inner">
        <p><i class="icon iconfont-tcl icon-chenggong_qingtishipx"></i>恭喜您，密码找回成功！</p>
        <div class="btn-inline clearfix">
          <yd-button class="fl btn-my" type="hollow" @click.native="$router.push({path:'/my'})">进入我的</yd-button>
          <span>|</span>
          <yd-button class="fr btn-my" type="hollow" @click.native="goHome()">进入首页</yd-button>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  export default {
    data() {
        return {
          role: 1,
          pwd1: '',
          pwd2: ''
        }
    },
    methods: {
      // gohome() {
      //   this.$router.push({path:"/"})
      // },
      goHome(){
        location.href='/'
      }

    }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>
