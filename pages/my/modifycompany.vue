<template>
  <div class="form_content">
    <yd-navbar title="修改公司名">
        <span @click="$router.go(-1)" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </span>
    </yd-navbar>
    <div class="form">

      <div class="form_item">
        <p>公司名称</p>
        <input type="text" class="ipt_txt" v-model="userinfo.companyName" placeholder="请输入公司名">
      </div>

      <div class="form_item">
        <p>部门名称</p>
        <input type="text" class="ipt_txt" v-model="userinfo.departmentName" placeholder="请输入部门">
      </div>

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
        if(!this.userinfo.companyName){
          this.$dialog.toast({
            mes: '请输入公司名称',
            timeout: 1500,
            icon: 'error'});
          return
        }
        if(!this.userinfo.departmentName){
          this.$dialog.toast({
            mes: '请输入部门名称',
            timeout: 1500,
            icon: 'error'});
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
      .form_item{
        margin-bottom: .6rem;
      }
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
