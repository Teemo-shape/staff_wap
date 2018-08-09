<template>
  <div class="login register">
    <yd-layout>
      <div class="logo">
        <img src="/img/login/logo1X.png">
      </div>
      <p class="title">您好，欢迎来到T严选！</p>
      <div class="user">
        <p class="name">TCL员工手机号／邮箱</p>
        <yd-input v-model="user"  placeholder="请输入用户名"></yd-input>
      </div>
      <div class="password">
        <yd-input type="password" v-model="password" placeholder="请输入密码"></yd-input>
        <p class="password-error red"></p>
      </div>
      <yd-button size="large" class="login-btn" v-if="disabled" type="danger" disabled @click.native="login">登录</yd-button>
      <yd-button size="large" class="login-btn" v-else type="danger" @click.native="login">登录</yd-button>
      <yd-flexbox class="login-bottom">
        <yd-flexbox-item><a href="/user/resetPassword">忘记密码></a></yd-flexbox-item>
        <yd-flexbox-item class="text-right"><a @click="showAgree()">帐号申请></a></yd-flexbox-item>
      </yd-flexbox>
    </yd-layout>



     <!-- 服务协议 -->
     <yd-popup v-model="show1" position="bottom" height="60%">
      <div class="modal">
        <div class="title clearfix">
          <h4>T严选员工内购注册服务及协议</h4>
          <span class="close" @click="show1=false">x</span>
        </div>
        <div class="content">
          <p>
            TCL即 the creative life 三个英文单词首字母的缩写，意为创意感动生活。公司创立于1981年，前身为中国首批13家合资企业之一——TTK家庭电器（惠州）有限公司，从事录音磁带的生产制造，后来拓展到电话、电视、 手机、冰箱、洗衣机、空调、小家电、液晶面板等领域。集团现有7.5万名员工，23个研发机构，21个制造基地，在80多个国家和地区设有销售机 构，业务遍及全球160多个国家和地区。
          </p>
        </div>
        <yd-button size="large" class="btn-bottom" type="danger" @click.native="goNext()">同意</yd-button>
      </div>
    </yd-popup>




    
  </div>
</template>
<script>
import http from '~/plugins/http';
export default {
  data() {
    return {
      show1: false,
      user:'',
      password:'',
      disabled: true
    }
  },
  methods: {
    login() {

    let reg = /^1[3456789]\d{9}$/; // 手机号
    let regemail=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱
    
    if(reg.test(this.user) || regemail.test(this.user)){

/*
       let params = {
        loginName: this.user,
        pwd: this.password
      };

      this.$http.get('/login/staff/login', params, res => {
         console.log(res);
      });

*/






       /* this.$dialog.toast({
          mes: '成功',
          timeout: 1000
        }); */

    }else{

         this.$dialog.toast({
            mes: '账号只能是TCL员工手机号／邮箱',
            timeout: 1000
          });   
          this.disabled = true 
    }

     

      
    },
    showAgree(){
      this.show1 = !this.show1;
    },
    goNext(){
      this.$router.push({path:'/user/register', query:{ 'mailApply':true, 'routerState': 'apply'}});
    }
  },
  computed: {

      loginInfo: function() {
        const { user, password } = this
        return { user, password }
      }
  },
  watch: {
    loginInfo: {
      handler: function(val) {
        
        if(val.user!="" && val.password!="" ){
          this.disabled = false  
        
        }else{
           this.disabled = true  
        }
      
     
    },
    deep: true
    }
  }
  /*,
  async asyncData(context) {

  }*/
}
</script>
