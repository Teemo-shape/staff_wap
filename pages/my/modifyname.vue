<template>
  <div class="form_content">
    <yd-navbar title="修改姓名">
        <span @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </span>
    </yd-navbar>
    <div class="form">
      <div class="form_item">
        <input type="text" class="ipt_txt" v-model="userinfo.realName" placeholder="请输入姓名">
      </div>
      <p class="label_tip">姓名仅支持4-20个字符，可由中英文、数字及下划线组成。</p>
      <div class="btn_submit" @click="saveForm">保存</div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        userinfo:{}
      }
    },
    mounted() {
      this.getInfo()
    },
    methods:{
      getInfo() {
        var _this = this
        this.$http.get('/usercenter/tclcustomer/userInfo', {}, res => {
          if (res.data) {
            _this.userinfo = res.data;
          }
        });
      },
      saveForm(){
        let  that=this;
        if(!this.userinfo.realName){
          this.$dialog.toast({
            mes: '请输入姓名',
            timeout: 1500,
            });
          return
        }
        let reg = /^[\u4e00-\u9fa50-9a-zA-Z_\-]{4,20}$/;
        if(!reg.test(this.userinfo.realName)){
          this.$dialog.toast({
            mes: '请输入合法姓名',
            timeout: 1500,
            });
          return
        }
        this.$http.post('/usercenter/customercomplex/doModifyCustomerInfoKuyu',that.userinfo,
          (res)=> {
            if (res.code == 0) {
              this.$dialog.toast({
                mes: '修改成功',
                timeout: 1500,
                icon: 'success',
                callback:()=>{
                  location.href='/my/info'
                }
              });
            }
          })
      }
    }
  }
</script>
<style lang="less">
  .form_content{
    .form{
      padding: 0 0.6rem;
      margin-top: .6rem;
    }
    .label_tip{
      font-size: .55rem;
      color: #999;
      margin-top: .3rem;
    }
    input{
      width: 100%;
      border: 1px solid #999;
      height: 1.87rem;
      line-height: 1.87rem;
      border-radius: 0;
      vertical-align: middle;
      padding-left: .2rem;
    }
    .btn_submit{
      margin-top: .8rem;
      height: 1.87rem;
      line-height: 1.87rem;
      background-color:#FF4545;
      color: #fff;
      font-size: .68rem;
      text-align: center;
    }
  }
</style>
