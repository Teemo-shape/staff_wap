<template>
  <div class="my-info">
    <yd-navbar title="我的资料">
      <router-link to="/my" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>

    <div class="yd-cell-box item">
        <yd-cell-group>
          <div class="yd-cell-item" arrow>
            <div class="yd-cell-left">
              <span class="cell-icon"></span>
              <span>头像</span>
            </div>
            <div class="yd-cell-right">
              <span><img :src="face" @click="$refs['imgFile'].click()"><input id="imgFile" ref="imgFile" type="file" class="hidden" @change="uploadFace"></span>
            </div>
          </div>
          <a  href="/my/updatenickname" class="yd-cell-item" arrow>
            <div class="yd-cell-left"><span slot="left">昵称</span></div>
            <div class="yd-cell-right yd-cell-arrow"> <span slot="right">{{info.nickName}}</span></div>
          </a>
        </yd-cell-group>
        <yd-cell-group>
          <a  href="/my/modifyname" class="yd-cell-item" arrow>
            <div class="yd-cell-left"><span slot="left">姓名</span></div>
            <div class="yd-cell-right yd-cell-arrow"> <span slot="right">{{info.realName}}</span></div>
          </a>
          <div class="yd-cell-item">
            <div class="yd-cell-left">
              <span>性别</span>
            </div>
            <div class="yd-cell-right yd-cell-arrow">
              <select class="sex" name="sex" v-model="info.sex" @change="updateSex">
                <option value="0">男</option>
                <option value="1">女</option>
                <option value="2">保密</option>
              </select>
              <span v-if="info.sex==0">男</span>
              <span v-else-if="info.sex==1">女</span>
              <span v-else-if="info.sex==2">保密</span>
            </div>
          </div>
            <div class="yd-cell-item">
              <div class="yd-cell-left">
                <span class="cell-icon"></span>
                <span>生日</span>
              </div>
              <div class="yd-cell-right yd-cell-arrow">
                <span class="birthday-txt"><span>{{info.birthday}}</span><input class="birthday" type="date" v-model="info.birthday" @change="updateBirthdat" /></span>
              </div>
            </div>
            <a href="/my/bindPhone" class="yd-cell-item">
              <div class="yd-cell-left">
                <span class="cell-icon"></span>
                <span>手机号</span>
              </div>
              <div class="yd-cell-right yd-cell-arrow">
                <span>{{info.bindPhone||'未绑定'}}</span>
              </div>
            </a>
            <a href="/my/bindEmail" class="yd-cell-item">
              <div class="yd-cell-left">
                <span class="cell-icon"></span>
                <span>员工邮箱</span>
              </div>
              <div class="yd-cell-right yd-cell-arrow">
                <span>{{info.bindMail||'未绑定'}}</span>
              </div>
            </a>
            <a href="/my/modifycompany" class="yd-cell-item">
              <div class="yd-cell-left">
                <span class="cell-icon"></span>
                <span>公司名称</span>
              </div>
              <div class="yd-cell-right yd-cell-arrow">
                <span>{{info.companyName}}</span>
              </div>
            </a>
          </yd-cell-group>
        <yd-cell-group>
          <a href="/my/manager?from=uc" class="yd-cell-item">
            <div class="yd-cell-left">
              <span class="cell-icon"></span>
              <span>收货地址</span>
            </div>
            <div class="yd-cell-right yd-cell-arrow"></div>
          </a>
          <a href="/account/resetPassword" class="yd-cell-item">
            <div class="yd-cell-left">
              <span class="cell-icon"></span>
              <span>修改密码</span>
            </div>
            <div class="yd-cell-right yd-cell-arrow"></div>
          </a>
        </yd-cell-group>
    </div>
    <yd-button size="large" type="danger" @click.native="logout">退出登录</yd-button>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: 'T严选商城-个人资料',
    }
  },
  data() {
    return {
      info: {},
      face: '/img/default.png',
      maxsize: 300 * 1024,
      minsize: 1024,
    }
  },
  mounted() {
    this.getInfo()
    this.getSize()
  },
  methods: {
    getInfo() {
      var _this = this
      this.$http.get('/usercenter/tclcustomer/userInfo', {}, res => {
        if (res.data) {
          this.info = res.data
          if (res.data.customerImgUrl) {
            var img = new Image();
            img.onload = function() {
              _this.face = res.data.customerImgUrl
            };
            img.src = res.data.customerImgUrl;
          };
        }
      });
    },
    logout() {
      this.$http.get('/tclcustomer/logout', null, res => {
        this.$utils.delCookie('wap_staff_token');
        this.$utils.delCookie('user');
        this.$utils.delCookie('orderPay');
        this.$dialog.alert({ mes: '您已经安全退出' })
        setTimeout(()=>{
          window.location.href='/account/login'
        },1000)
      });
    },
    uploadFace() {
      this.$http.upload('/usercenter/customercomplex/uploadImage', { uploadID: 'imgFile', maxsize: this.maxsize, minsize: this.minsize, notRest: true }, res => {
        if (res.code == 0) {
          this.face = res.data.remotePath
          this.updateFace(this.face)
        } else {
          this.$dialog.alert({ mes: '图像上传失败，请稍候再试' })
        }
      })
    },
    updateFace(imageUrl) {
      this.$http.post('/usercenter/customercomplex/updateImage', { img: imageUrl }, r => {
        if (r.code == '0') {
          this.$dialog.alert({ mes: '修改图像成功' })
        } else {
          this.$dialog.alert({ mes: '修改图像失败，请稍后再试' })
        }
      });
    },
    updateBirthdat() {
      this.$http.post('/usercenter/customercomplex/doModifyCustomerInfoKuyu', { birthday: this.info.birthday, customerUuid: this.info.customerUuid }, res => {
        if (res.code == 0) {
          this.$dialog.alert({ mes: '修改成功' })
        } else {
          this.$dialog.alert({ mes: '修改失败' })
        }
      })
    },
    getSize() {
      this.$http.get('/fileupload/imageFileUploadConfig', {}, res => {
        if (res.code == 0) {
          this.maxsize = res.retData.maxByte
          this.minsize = res.retData.minByte
        }
      })
    },
    updateSex(){
      this.$http.post('/usercenter/customercomplex/doModifyCustomerInfoKuyu', { sex: this.info.sex, customerUuid: this.info.customerUuid }, res => {
        if (res.code == 0) {
          this.$dialog.alert({ mes: '修改成功' })
        } else {
          this.$dialog.alert({ mes: '修改失败' })
        }
      })
    }
  }
}
</script>
<style>
  .yd-cell{
    padding:0 0.5rem;
  }
  .birthday,.sex{
     opacity: 0;
     position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    display: inline-block;
  }
  .birthday-txt{
    position: relative;
    text-align: right;
  }
  .birthday-txt span{
     display:inline-block;
     height:100%;
  }
</style>

