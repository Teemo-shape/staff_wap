<template>
    <div class="register">
        <yd-layout>
            <yd-navbar :title="mytit">
                <router-link to="/" slot="left">
                    <yd-navbar-back-icon></yd-navbar-back-icon>
                </router-link>
            </yd-navbar>
            <div class="container">
              <!-- 邮箱/手机号验证 -->
                <div class="mod1"  v-show="mod1">
                    <div class="user">
                    <p class="name">帐号</p>
                    <yd-input v-model="user" max="30" :placeholder="tip" :regex="type==1?'mobile':'email'"></yd-input>
                    </div>
                    <!-- <div class="user mgt50" v-show="idShow">
                    <p class="name">身份证号码</p>
                    <yd-input v-model="idNumber" max="30" placeholder="请输入身份证号码"></yd-input>
                    </div> -->
                    <p class="tip mgt24">忘记{{way1}}的员工可使用<a @click="chg(way2)">{{way2}}申请</a></p>

                    <yd-button size="large" :disabled="disabled" class="next-btn" type="danger" @click.native="validate()">{{btnTxt}}</yd-button>
                    <p class="tip red mgt24" v-show="noUser">{{ifuser}}</p>
                    <yd-button size="large" class="mgt20" type="hollow" @click.native="$router.push({path:'/'})" v-show="back">返回首页</yd-button>
                </div>
              <!-- 发送到验证码验证 -->
                <div class="mod2" v-show="mod2">
                  <div v-if="isSecond">
                    <yd-cell-group class="imgcodeBox">
                      <yd-cell-item style="padding-left:0;">
                      <yd-input slot="left" v-model.trim="imgcode" max="4" placeholder="请输入验证码"></yd-input>
                      <img slot="right" :src="codeSrc" alt="验证码" @click="getCode">
                          </yd-cell-item>
                    </yd-cell-group>
                    <p class="tip">请输入图片的验证码</p>
                  </div>
                    <yd-cell-group class="mgt50">
                    <yd-cell-item>
                        <input type="text" slot="right" placeholder="请输入验证码" v-model="code" @blur="checkCode">
                        <yd-sendcode slot="right"
                                    v-model="start"
                                    @click.native="sendCode"
                                    type="danger"
                                    init-str="获取验证码"
                                    run-str="{%s}秒"
                                    reset-str="再次获取"
                        ></yd-sendcode>
                    </yd-cell-item>
                    </yd-cell-group>
                    <p class="tip">请输入{{user}}收到的验证码</p>
                    <yd-button size="large" :disabled="dis1" class="mgt150" type="danger" @click.native="mod2=false;mod3=true">下一步</yd-button>
                </div>
              <!-- 重新修改密码 -->
                <div class="mod3" v-show="mod3">
                    <p class="accout-name">您的账号为：{{user}}</p>
                    <h1 class="set-pas">请设置登录密码</h1>
                    <div class="user">
                        <p class="name">新密码</p>
                        <yd-input type="password" v-model="pwd" max="20" placeholder="请输入密码"></yd-input>
                    </div>
                    <div class="user mgt24">
                        <p class="name">再次输入</p>
                        <yd-input type="password" v-model="repwd" max="20" placeholder="请再次输入相同的密码"></yd-input>
                    </div>
                    <p class="tip mgt20">密码长度8~16位，数字、字母、字符至少包含两种</p>
                    <yd-button size="large" class="next-btn" type="danger" @click.native="ok()" :disabled="dis2">确定</yd-button>
                </div>
            </div>
        </yd-layout>
    </div>
            <!-- <div class="getidcode">
                <input type="text" placeholder="请输入验证码" class="identifycode">
                <button @click="send" class="getcode">
                            <span v-if="sendMsgDisabled">{{time+'s'+"后再次获取"}}</span>
                            <span v-if="!sendMsgDisabled">获取验证码</span>
                </button>
            </div>
            <yd-button size="large" :disabled="dis1" class="mgt150 cng" type="danger" @click.native="togo()">下一步</yd-button> -->
</template>

<script>

export default {
    data() {
      return {
        show: true,
        user:'',
        idNumber: '',
        idShow:false,
        noUser:false,
        tip: '请输入TCL员工邮箱',
        way1:'邮箱',
        way2:'手机号',
        btnTxt:'点击完成验证',
        back:false,
        mytit:'身份验证',
        mod1:true,
        mod2:false,
        mod3:false,
        start:false,
        code:'',
        dis1:true,
        pwd:'',
        repwd:'',
        type:2,
        ifuser:'',
        uuid:'',
        role:"",
        codeSrc:'',
        isSecond:false,
        imgcode:'',
      }
    },
    computed:{
      disabled:function(){
        //return this.idShow==false?this.user=='':this.user==''||this.idNumber==''
        return this.user==''
      },
      dis2:function(){
        //return this.idShow==false?this.user=='':this.user==''||this.idNumber==''
        return this.pwd==''||this.repwd==''
      }
    },
    created() {
        if(this.$route.params.role === 1){
          this.tip = '请输入TCL员工邮箱'
          this.way1='邮箱'
          this.way2='手机号'
          this.type=2
        }else if(this.$route.params.role == 2){
          this.tip = '请输入TCL员工手机号'
          this.way1='手机号'
          this.way2='邮箱'
          this.type=1
        }
    },
    methods: {
      chg(t){
        switch(t){
          case '手机号':
          this.type=1
          this.tip= '请输入手机号码'
          this.way1='手机号';
          this.way2='邮箱'
          this.idShow = false
          break
          case '邮箱':
          this.type=2
          this.tip= '请输入邮箱号码'
          this.way1='邮箱';
          this.way2='手机号'
          this.idShow = false
          break
        }
      },
      validate() {
        this.btnTxt='帐号验证中...'
        var that = this

        this.$http.post('/login/staff/checkMailOrPhoneExistPsw',{username:this.user,type:this.type},function(res){
          that.btnTxt='重新验证'
          that.back=true

          if(res.code==0){//验证通过，跳转下一步
            that.noUser = false
            that.mod1=false
            that.mod2=true
            that.mytit = '设置密码'
          }else{//验证未通过
            that.noUser = true
            that.ifuser = res.msg
          }
        })
      },
      sendCode() {
        // this.$dialog.loading.open('发送中...');
        if(this.isSecond && this.imgcode.length<4){
            this.$dialog.toast({
                mes: '请输入四位验证码！',
                timeout: 1500,
                icon: 'error'
            });
          }
        var params = {
          key:this.uuid,
          userName:this.user,
          type:this.type,//1为手机号，2为邮箱
          fromType:3,//1验证账号，2邮箱申请时绑定手机号，3找回密码
          noStaff:true,
          inputCode:this.imgcode,
          inputCodeKey:this.uuid
        }, that = this
        this.$http.get('/login/staff/sendMsgToPhoneOrEmail',params,function(res){
            if(res.code==0){
              setTimeout(() => {
                  that.start = true;
                  that.$dialog.loading.close();
                  that.$dialog.toast({
                      mes: '已发送',
                      icon: 'success',
                      timeout: 1500
                  });
              }, 1000);
            }else{
              that.getCode();
              that.isSecond = true;
              that.$dialog.toast({
                  mes: res.msg,
                  timeout: 3000
              });
            }
        })
      },
        // data() {
        //     return {
        //         time: 120, // 发送验证码倒计时
        //         sendMsgDisabled: false
        //     }
        // },
        // methods: {
        //     send() {
        //         let me = this;
        //         me.sendMsgDisabled = true;
        //         let interval = window.setInterval(function() {
        //             if ((me.time--) <= 0) {
        //                 me.time = 120;
        //                 me.sendMsgDisabled = false;
        //                 window.clearInterval(interval);
        //             }
        //         }, 1000);
        //     },
        //     togo() {
        //          this.$router.push({path:"resetNextPassword"})
        //     }
        // },
        getCode() { //获取图片验证码
            this.uuid = this.$utils.uuid()
            this.codeSrc = '/rest/login/staff/getImageValidateCode?img-key='+this.uuid
        },
      checkCode(){
          if (this.code.length < 6) return false;
          var params = {
              key: this.uuid,
              userName: this.user,
              inputCode: this.code,
              fromType: 3,
              noStaff: true
          },
         that = this;
        this.$http.get('/login/staff/checkValidateCode',params,function(res){
            if(res.code==0){
              that.dis1 = false
            }else{
              that.$dialog.toast({
                  mes: '请输入正确的验证码',
                  timeout: 1500,
                  icon: 'error',
                  callback: () => {
                      that.dis1 = true
                  }
              })
            }
        })
      },
      ok(){
        var that = this,
        reg=/^(?![^a-zA-Z]+$)(?!\D+$).{8,12}$/;
        if(!reg.test(this.pwd)){
            that.mytit="设置密码"
          this.$dialog.toast({
              mes: '密码格式不正确~',
              timeout: 1500,
              icon: 'error'
          })
          return false
        }else if(this.pwd!=this.repwd){
          this.$dialog.toast({
              mes: '两次输入密码不一致',
              timeout: 1500,
              icon: 'error',
              callback: () => {
                  that.pwd2 = ''
              }
          })
          return false
        }

        var params={
          username:that.user,
          type:that.type,
          password:that.pwd
        };
        this.$http.get('/login/staff/savePassword',params,function(res){
          if(res.code==0){

            var params = {
              loginName: that.$utils.base64encode(that.$utils.base64encode(that.$utils.createId())+that.$utils.base64encode(String(that.user).trim())+that.$utils.base64encode(that.$utils.createId())),
              pwd: that.$utils.base64encode(that.$utils.base64encode(that.$utils.createId())+that.$utils.base64encode(String(that.pwd))+that.$utils.base64encode(that.$utils.createId()))}

            that.$http.post('/login/staff/login', JSON.stringify(params), function (resData) {
                if(resData.code == '0'){
                  that.$utils.setCookie('wap_staff_token',resData.token);
                  that.$router.push({path:"resetSuccess"})
                }
              });

          }
        })


      }
        // var params={
        //   username:this.user,
        //   type:this.type,
        //   password:this.pwd
        // };
        // this.$http.get('/login/staff/savePassword',params,function(res){
        //   if(res.code==0){
        //     that.$dialog.toast({
        //         mes: '密码保存成功',
        //         timeout: 1500,
        //         icon: 'success',
        //         callback: () => {
        //             //that.$router.push({path:'personal',query:{type:that.type}})
        //             that.$router.push({name:'account-personal',params:{type:that.type,user:that.user,pwd:that.pwd}})
        //         }
        //     })
        //   }
        // })

    }
}
</script>

<style scoped>

</style>
