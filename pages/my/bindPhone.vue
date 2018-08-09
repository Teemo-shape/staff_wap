<template>
  <div>
    <yd-navbar title="修改/绑定手机">
        <span @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </span>
    </yd-navbar>
    <div class="bind_content">
      <div>
        <img class="bind_img" src="/img/bindTel.png">
        <div class="bind_txt" v-if="hasbind">
          <p class="bind_title">你已绑定手机：</p>
          <p class="bind_email">{{userinfo.bindPhone}}</p>
        </div>
        <div class="bind_txt" v-else>
          <p class="bind_title">当前未绑定手机</p>
        </div>
        <div v-show="step1" class="btn btn_upate" @click="sendEmainCode">更换绑定手机</div>
        <div class="step2_veryfy" v-show="step2">
          <p class="bind_label">验证码发送至手机：<span>{{userinfo.bindPhone}}</span></p>
          <p class="bind_label">请输入收到的验证码</p>
          <div>
            <input type="text" class="ipt_txt" v-model="validcode">
            <span class="btn btn_veryfy" @click="veryfyCode">确定</span>
          </div>
        </div>
        <div class="step3_confirm" v-show="step3">
          <p class="bind_label" id="bind_tip">验证通过！请输入您要绑定的手机：</p>
          <div class="form_item large_ipt">
            <input type="text" class="ipt_txt" v-model="newPhone" placeholder="请输入新手机">
          </div>
          <yd-cell-item class="form_item">
            <yd-input slot="left" type="text" class="ipt_txt" v-model="newVeryCode" placeholder="请输入验证码"/>
            <yd-sendcode class="btn btn_veryfy" slot="right"
                         v-model="start1"
                         @click.native="sendCode"
                         type="warning"
                         init-str="获取验证码"></yd-sendcode>
            <!--<span slot="right" class="btn btn_veryfy" @click="veryfyCode">确定</span>-->
          </yd-cell-item>
          <div class="btn_confrimBind" @click="confirmBind">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        userinfo:{},
        hasbind:false,
        validcode:'',
        newPhone:'',
        newVeryCode:'',
        step1:false,
        step2:false,
        step3:false,
        start1:false,
        errorCode:{
          101: '用户名为空',
          102: 'token为空',
          104: '用户名不存在',
          103: 'token验证失败',
          15: '应用编号格式错误',
          21: '应该编号未在TCL注册',
          31:'检查应用编号异常',
          45:'无效值',
          141:'身份未验证或超时',
          4:'手机或手机已经被绑定过',
          5:'验证码错误次数超过上限',
          10:'已经通过验证手机只能换绑',
          123:'验证码错误',
          '-1':'换绑失败'
        }
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        var _this = this
        this.$http.get('/usercenter/tclcustomer/userInfo', {}, res => {
          if (res.data) {
            this.userinfo = res.data;
            if(res.data.bindMail){
              _this.step1=true;
              _this.hasbind=true;
            }
            else{
              _this.hasbind=false;
              _this.step1=false;
              _this.step2=false;
              _this.step3=true;
              document.getElementById('bind_tip').innerHTML='请输入您要绑定的手机';
            }
          }
        });
      },
      sendEmainCode(){
        let  that=this;
        this.$http.post('/usercenter/customer/sendValidcodeToOld',
          {
            username:that.userinfo.bindPhone,
            type:2
          },(res)=>{
            if(res.status==1){
              that.step1=false;
              that.step2=true
            }
            else{
              that.$dialog.toast({
                mes: res.msg,
                timeout: 1500,
                icon: 'success'})
            }
          }
        )
      },
      //第二步验证验证码
      veryfyCode(){
        let that=this;
        this.$http.post('/usercenter/customer/checkValidcode',
          {
            username:that.userinfo.bindMail,
            type:2,
            validcode:that.validcode
          },(res)=>{
            if(res.status==1){
              that.step1=false;
              that.step2=false;
              that.step3=true;
            }
            else{
              that.$dialog.toast({
                mes: res.msg,
                timeout: 1500,
                icon: 'success'})
            }
          }
        )
      },
      //更换时发送验证码
      sendCode(){
        let that=this;
        var regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!that.newPhone){
          that.$dialog.toast({
            mes: '请输入手机',
            timeout: 1500,
            icon: 'error'});
          return
        }
        if(!regemail.test(that.newPhone)){
          that.$dialog.toast({
            mes: '请输入正确的手机',
            timeout: 1500,
            icon: 'error'});
          return
        }
        this.$dialog.loading.open('发送中...');
        setTimeout(() => {
          this.start1 = true;
          this.$dialog.loading.close();
          this.$http.post('/usercenter/customer/sendVerifycodeToNew',
            {
              bindValue:that.newPhone,
              type:2,
            },(res)=>{
              if(res.status==1){
                this.$dialog.toast({
                  mes: '已发送',
                  icon: 'success',
                  timeout: 1500
                });
              }
              else{
                that.$dialog.toast({
                  mes: res.msg,
                  timeout: 1500,
                  icon: 'error'})
              }
            }
          )
        }, 1000);
      },
      confirmBind(){
        let that=this;
        if(!that.newVeryCode){
          this.$dialog.toast({
            mes: '请输入验证码',
            timeout: 1500,
            icon: 'error'})
          return
        }
        this.$http.post('/usercenter/customer/changeBind',
          {
            username:that.userinfo.bindMail,
            bindValue:that.newPhone,
            type:2,
            validcode:that.newVeryCode
          },
          (res)=>{
            if(res.code == 0){
              this.$dialog.toast({
                mes: '绑定成功',
                timeout: 1500,
                icon: 'success',
                callback:()=>{
                  location.href="/my/info"
                }
              })
            }
            else{
              this.$dialog.toast({
                mes: that.errorCode[res.code],
                timeout: 1500,
                icon: 'error'})
            }
          })
      }
    }
  }
</script>
<style lang="less">
  .bind_content{
    padding:0 .64rem;
    .bind_img{
      height:6rem;
      width:6rem;
      margin:0 auto;
      margin-top: 1.28rem;
    }
    .bind_txt{
      text-align: center;
      .bind_title{
        margin-top: .63rem;
        font-size: .72rem;
        color:#999;
      }
      .bind_email{
        height: .8rem;
        font-size: .72rem;
        color: #151515;
        margin-top: .3rem;
      }
    }
    .bind_label{
      margin: .1rem;
      font-size: .7rem;
      color:#999;
      line-height:1.3rem;
    }
    .btn{
      height: 1.87rem;
      line-height: 1.87rem;
      background-color:#FF4545;
      color: #fff;
      font-size: .68rem;
      text-align: center;
    }
    .btn_upate{
      margin-top:3rem;
    }
    .step2_veryfy,.step3_confirm{
      input{
        border: 1px solid #999;
        height: 1.87rem;
        line-height: 1.87rem;
        border-radius: 0;
        vertical-align: middle;
        padding-left: .2rem;
      }
      .btn_veryfy{
        display: inline-block;
        width: 5.3rem;
        vertical-align: middle;
        margin-left: .5rem;
      }
    }
    .step3_confirm {
      margin-top: 3.155rem;
      .yd-cell-right,.yd-cell-left{
        padding: 0;
      }
      .yd-cell-left{
        width: 70%;
      }
      .form_item{
        margin-top: .36rem;
        padding-left: 0;
      }
      .yd-btn{
        border-radius: 0;
      }
      .btn_confrimBind{
        margin-top: .8rem;
        height: 1.87rem;
        line-height: 1.87rem;
        background-color:#FF4545;
        color: #fff;
        font-size: .68rem;
        text-align: center;
      }
      .large_ipt {
        input{
          width: 100%;
        }
      }
    }
  }
</style>
