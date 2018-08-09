<template>
  <div class="reset-password">
    <yd-layout>
      <yd-navbar title="身份认证">
        <router-link to="/" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <div class="container">
        <yd-radio-group v-model="role" color="#F00">
          <yd-radio val="1">邮箱找回(仅限用邮箱申请的用户)</yd-radio>
          <yd-radio val="2">手机号找回（仅限用手机号申请的用户)</yd-radio>
        </yd-radio-group>
        <yd-button size="large" class="next-btn" type="danger" @click.native="goNext()">下一步</yd-button>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  export default {
    data() {
        return {
          role: 1
        }
    },
    methods: {
      goNext() {
            this.$router.push({name:'account-vaildate',params:{role:this.role}})
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">

</style>
