<template>
  <div class="login">
    <yd-layout>
      <div class="logo">
        <img src="/img/login/logo1X.png">
      </div>
      <p class="title">您好，欢迎来到T严选！</p>
      <div class="user">
        <yd-input v-model="user" max="30" placeholder="请输入TCL员工手机号／邮箱／工号"></yd-input>
      </div>
      <div class="password">
        <yd-input type="password" v-model.trim="password" placeholder="请输入密码"></yd-input>
      </div>
      <div>
        <yd-cell-group class="imgcodeBox">
          <yd-cell-item style="padding-left:0;">
          <yd-input slot="left" v-model.trim="imgcode" max="4" placeholder="请输入验证码"></yd-input>
          <img slot="right" :src="codeSrc" alt="验证码" @click="getCode">

              </yd-cell-item>
        </yd-cell-group>
      </div>
      <yd-button size="large" class="login-btn" type="danger" @click.native="login">登录</yd-button>
      <yd-flexbox class="login-bottom">
        <yd-flexbox-item><a href="/account/resetPassword">忘记密码></a></yd-flexbox-item>
        <yd-flexbox-item class="text-right"><a href="/account/reg">帐号申请></a></yd-flexbox-item>
      </yd-flexbox>
    </yd-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user:'',
      password:'',
      captchakey:'',
      codeSrc:'',
      imgcode:'',
      rand:'',
      errCd:true
      //disabled: true
    }
  },
  mounted(){
    this.getCode();
  },
  methods: {
    getCode() { //获取图片验证码
        this.rand = this.$utils.uuid()
        this.codeSrc = '/rest/login/staff/getImageValidateCode?img-key='+this.rand
    },
    login() {
        if(this.user==''||this.password==''){
            this.$dialog.toast({
                mes: '请输入账号/密码！',
                timeout: 1500,
                icon: 'error'
            });
            return false
        }else if(this.imgcode.length<4){
            this.$dialog.toast({
                mes: '请输入四位验证码！',
                timeout: 1500,
                icon: 'error'
            });
            return false
        }else{
            this.$http.get('/login/staff/checkImageValidateCode', {'img-key':this.rand,captchadata:this.imgcode},res =>{
                if(res.code != 0){
                    this.$dialog.toast({
                        mes: '请输入正确的验证码',
                        timeout: 1500,
                        icon: 'error',callback: () => {
                            this.getCode()
                        }
                    });
                    return false
                }
            })
        }

        var params = {
            loginName: this.$utils.base64encode(this.$utils.base64encode(this.$utils.createId())+this.$utils.base64encode(String(this.user).trim())+this.$utils.base64encode(this.$utils.createId())),
            pwd: this.$utils.base64encode(this.$utils.base64encode(this.$utils.createId())+this.$utils.base64encode(String(this.password))+this.$utils.base64encode(this.$utils.createId())),
            isWeixin: this.$utils.iswx() ? 1 : 0//true在微信浏览器，false就不在
        }
        this.$http.post('/login/staff/login', JSON.stringify(params), (res)=> {
            if(res.code == '0'){
                this.$dialog.toast({
                    mes: '登录成功',
                    timeout: 1500,
                    icon: 'success',callback: () => {
                        this.$utils.setCookie('wap_staff_token',res.token);
                        window.location.href='/'
                    }
                });
            }
            else if (res.code == '-5') {
                this.$dialog.toast({
                    mes: '验证码错误',
                    timeout: 1500,
                    icon: 'error',callback: () => {
                        this.getCode()
                        this.imgcode = ''
                    }
                });
            }else if (res.code == '112') {
                this.$dialog.toast({
                    mes: '该用户不存在',
                    timeout: 1500,callback: () => {
                        this.getCode()
                        this.user = ''
                        this.password = ''
                        this.imgcode = ''
                    }
                });
            }else if (res.code == '-8') {
                this.$dialog.toast({
                    mes: '员工不在职',
                    timeout: 1500,callback: () => {
                        this.getCode()
                        this.user = ''
                        this.password = ''
                        this.imgcode = ''
                    }
                });
            }else{
                this.$dialog.toast({
                    mes: '非员工账号或密码不正确',
                    timeout: 1500,
                    icon: 'error',callback: () => {
                        this.getCode()
                        // that.user = ''
                        // that.password = ''
                        this.imgcode = ''
                    }
                })
            }
        });

    }
  }
}
</script>
