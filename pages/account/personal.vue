<template>
  <div class="personal">
    <yd-layout v-show="show">
      <yd-navbar title="个人信息">
        <router-link to="/" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <div class="container">
        <div class="user">
          <p class="name"><span class="red">*</span>真实姓名</p>
          <yd-input v-model.trim="realName" max="20" placeholder="请输入真实姓名"></yd-input>
        </div>
        <div class="user mgt20">
          <p class="name"><span class="red">*</span>手机号码</p>
          <yd-input v-model.trim="tel" regex="mobile" max="11" placeholder="请输入手机号码"></yd-input>
        </div>
        <div class="user mgt20">
          <p class="name"><span class="red">*</span>公司名称</p>
          <yd-input v-model.trim="companyName" max="20" placeholder="请输入公司名称"></yd-input>
        </div>
        <div class="user mgt20">
          <p class="name"><span class="red">*</span>部门名称</p>
          <yd-input v-model.trim="departmentName" max="20" placeholder="请输入部门名称"></yd-input>
        </div>
        <yd-button size="large" class="mgt150" type="danger" @click.native="ok()" :disabled="disabled">确定</yd-button>
      </div>
    </yd-layout>
    <div class="reset-success" v-show="!show">
      <yd-navbar title="">
        <router-link to="/" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <div class="inner">

        <p><i class="icon iconfont-tcl icon-chenggong_qingtishipx"></i>恭喜您，帐号申请成功</p>
        <div class="btn-inline clearfix">
          <yd-button class="fl btn-my" type="hollow" @click.native="$router.push({path:'/my'})">进入我的</yd-button>
          <span>|</span>
          <yd-button class="fr btn-my" type="hollow" @click.native="$router.push({path:'/'})">进入首页</yd-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        realName:'',
        tel:'',
        companyName: '',
        departmentName: '',
        show:true,
        type:this.$route.params.type
      }
    },
    computed:{
      disabled:function(){
        var flag = this.realName==''||this.companyName==''||this.departmentName=='';
        return  this.type==1?flag:(flag || this.tel=='')
      }
    },
    created(){
      console.log(this.$route.params.type);
    },
    methods: {
      ok() {
        var that = this,
          params = {
            type:this.type,//1手机号，2邮箱
            username:this.$utils.base64encode(this.$utils.base64encode(this.$utils.createId())+this.$utils.base64encode(String(this.$route.params.user))+this.$utils.base64encode(this.$utils.createId())),
            realName:this.realName,
            password:this.$utils.base64encode(this.$utils.base64encode(this.$utils.createId())+this.$utils.base64encode(String(this.$route.params.pwd))+this.$utils.base64encode(this.$utils.createId())),
            mobile:this.tel,//类型为邮箱时必填
            companyName:this.companyName,
            departmentName:this.departmentName
          }
        this.$http.post('/login/staff/applyAccountAndModifyCustomerInfo',JSON.stringify(params),function(res){
          if(res.code==0){
            that.$dialog.toast({
              mes: '保存成功',
              icon: 'success',
              timeout: 1500,
              callback: () => {
                that.show=false
              }
            })
          }else{
            that.$dialog.toast({
              mes: res.msg,
              icon: 'error',
              timeout: 1500
            })
          }
        })
      }
    }
  }
</script>
