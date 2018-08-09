<template>
<div class="register">
  <yd-layout>
    <yd-navbar title="身份验证">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>

 

   
   
    <div class="container">
      <div class="user">
        <p class="name">帐号</p>
        <yd-input v-model="userMail" v-if="mailApply"  placeholder="请输入TCL员工邮箱"></yd-input>
        <yd-input v-model="userPhone" v-if="!mailApply" placeholder="请输入TCL员工手机号"></yd-input>
      </div>
      <p class="tip mgt24" v-if="validState === '0'">忘记工号的员工可使用<a @click="emailApply()">邮箱申请</a>或<a @click="phoneApply()">手机号申请</a></p>
 
      <!-- <div class="user mgt50" v-if="!mailApply">
        <p class="name">身份证号码</p>
        <yd-input v-model="idNumber"  placeholder="请输入身份证号码"></yd-input>
      </div> -->
     

    <!-- 验证前按钮情况 -->
     <div class="valid-state" v-if="validState === '0'">
        <yd-button size="large" v-if="disabled" disabled class="next-btn" type="danger">点击完成验证</yd-button>
        <yd-button size="large" v-if="!disabled && mailApply" class="next-btn" type="danger" @click.native="validMail()">点击完成验证</yd-button>
        <yd-button size="large" v-if="!disabled && !mailApply" class="next-btn" type="danger" @click.native="validPhone()">点击完成验证</yd-button>
     </div>

     <!-- 验证中按钮情况 -->
     <div class="valid-state" v-if="validState === '1'">
       <yd-button size="large"  class="next-btn" type="danger">帐号验证中...</yd-button>
     </div>

    <!-- 验证失败后按钮情况 -->
     <div class="valid-state" v-if="validState === '2'">
        <p class="tip red mgt24" v-if="mailApply">该邮箱未在T严选备案，请确认邮箱是否输入正确或使用其他方式验证。</p>
        <p class="tip red mgt24" v-if="!mailApply">该手机未在T严选备案，请确认手机是否输入正确或使用其他方式验证。</p>
       <yd-button size="large" v-if="mailApply" class="next-btn" type="danger" @click.native="validMail()">重新验证</yd-button>
       <yd-button size="large" v-if="!mailApply" class="next-btn" type="danger" @click.native="validPhone()">重新验证</yd-button>
       <yd-button size="large" class="mgt20" type="hollow" @click.native="$router.push({path:'/'})">返回首页</yd-button>
     </div>


    
    </div>
  </yd-layout>
</div>
</template>

<script>

  export default {
    data() {
      return {
        routerState: this.$route.query.routerState,// 重置密码/账号申请
        mailApply: this.$route.query.mailApply,// 验证方式--邮箱或者手机号码
        userMail:'',  //用户输入的邮箱
        userPhone:'',  //用户输入的手机号码
        disabled: true,  //"点击完成验证" 按钮是否可点击
        validState:'0', // 0 验证前 --1 验证中--2 验证失败后
      }
    },
    methods: {
      showAgree() {
        this.show1 = true;
      },
      phoneApply() {   
        this.$router.push({path:'/user/register', query:{ 'mailApply':false,'routerState':this.routerState}});
      },
      emailApply() {
        this.$router.push({path:'/user/register', query:{ 'mailApply':true,'routerState':this.routerState }});
      },
      validMail(){  //验证邮箱
         
         let regEmail=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱
         if(regEmail.test(this.userMail)){
           this.validState = "1";

           if(this.routerState==="apply"){
              this.$router.push({path:'/user/personal', query:{ 'mailApply':this.mailApply }});

           }else{
              this.$router.push({path:'/user/resetNextPassword', query:{ 'mailApply':this.mailApply }});

           }





         }else{
           this.$dialog.toast({
              mes: '账号只能是TCL邮箱',
              timeout: 1000
            });   
            this.validState = "0";
            this.disabled = true ; 
           }
      },
      validPhone(){ //验证手机号码
        
        let regPhone = /^1[3456789]\d{9}$/; // 手机号
         if(regPhone.test(this.userPhone)){
           this.validState = "1";


          if(this.routerState==="apply"){
              this.$router.push({path:'/user/personal', query:{ 'mailApply':this.mailApply }});

           }else{
              this.$router.push({path:'/user/resetNextPassword', query:{ 'mailApply':this.mailApply }});

           }

          
           
         }else{
           this.$dialog.toast({
              mes: '账号只能是手机号码',
              timeout: 1000
            });   
            this.validState = "0";
            this.disabled = true ; 
        }
      }




    },
    computed: {
      resetInfo: function() {
        const { userMail, userPhone } = this
        return { userMail, userPhone }
      }
     },
    watch: {
        resetInfo: {
          handler: function(val) {
            if(val.userMail!= "" || val.userPhone!="" ){
              this.disabled = false  
            
            }else{
               this.disabled = true  
            }
        },
        deep: true
        }
    }
  
  }

</script>

<style lang="less" rel="stylesheet/less">

</style>
