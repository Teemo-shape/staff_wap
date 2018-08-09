<template>
  <div class="searchResult">
    <yd-navbar title="服务进度查询">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="from">
      <p>
        <input v-model="phone" ref="phone" :class="{'errTips': isPhone}" type="text" required regex="mobile" placeholder="请输入手机号码" />
        <span v-model="isPhone">{{checkPhone}}</span>
      </p>
      <p>
        <input v-model="vcode" ref="vcode" class="vcode" :class="{'errTips': isVcode}" type="text" required regex="/\w+/" placeholder="请输入验证码" />
        <img :src="vcodeimg" class="vcodeimg" @click="getvcode" />
        <span v-show="isVcode">{{checkvcode}}</span>
      </p>
      <button class="blueButton" @click="clickHander">查询</button>
    </div>
    <div class="searchNum" v-show="searchNum" v-html="searchNum"></div>
    <div class="searchList">
      <div class="item" v-for="(item, index) in searchList" :key="index">
        <header>
          <yd-flexbox class="row">
            <div style="margin-right:.5rem;">
              <i class="yline"></i>
              <span class="name">
                服务单号
              </span>
            </div>
            <yd-flexbox-item>{{item.case_code}}</yd-flexbox-item>
            <div @click="hideList(index)">
              <span :class="{'blue':item.status.indexOf('已完成') > -1,'red':item.status.indexOf('处理中') > -1}">
                {{item.status | st}}
              </span>
              <i class="icon font32" :class="{'iky-arrow-down': index<1, 'iky-arrow-right': index>0}" ref="abc"></i>
            </div>
          </yd-flexbox>
        </header>
        <ul ref="index" v-show="index<1">
          <li>
            <label>姓名</label>
            <span>{{item.customername}}</span>
          </li>
          <li>
            <label>联系电话</label>
            <span>{{item.customertel.split('/')[0]}}</span>
          </li>
          <li>
            <label>服务类型</label>
            <span>{{item.demandbig}}-{{item.productbig}}</span>
          </li>
          <li>
            <label>受理时间</label>
            <span>{{item.createtime}}</span>
          </li>
          <li v-show="item.status.indexOf('已完成') > -1">
            <label>完成时间</label>
            <span>{{item.servicetime}}</span>
          </li>
          <!-- <li>
            <label>当前状态</label>
            <span :class="{'blue':item.status.indexOf('已完成') > -1,'red':item.status.indexOf('处理中') > -1}">{{item.status | st}}</span>
          </li> -->
          <!--  <li>
            <label>产品类型</label>
            <span>{{item.productbig}}</span>
          </li> -->
          <li>
            <label>产品型号</label>
            <span>{{item.protypename}}</span>
          </li>
          <li v-if="item.status.indexOf('已完成') > -1" style="color:#666;">
            服务已完成, 请您对本次服务进行评价
            <a href="javascript:;" class="button" v-if="item.custassess>0">已评价</a>
            <a href="javascript:;" @click="custassess(item)" class="button btnred" v-else>去评价</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
const api = {
  search: '/servicecenter/serviceDemandDealProcessKuyu'
}
export default {
  layout: 'empty',
  head() {
    return {
      title: 'TCL官网-服务进度查询',
    }
  },
  data() {
    return {
      phone: '', isPhone: false, isVcode: false, checkPhone: '', checkvcode: '', vcode: '', result: '', random: Math.random(),
      vcodeimg: '/rest/getCustomerRegCode?img-key=',
      searchNum: '', searchList: [], m: '', token: ''
    }
  },
  mounted() {
    this.token = this.$utils.getCookie('wap_staff_token')
    this.getvcode();
  },
  filters: {
    isComment(name) {
      return (name == 0 ? '<a href="###">去评价</a>' : '<a href="###">已评价</a>')
    },
    st(name) {
      if (name.indexOf('已完成') > -1) {
        return '已完成'
      } else if (name.indexOf('处理中') > -1) {
        return '服务中'
      } else {
        return name
      }
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    getvcode() {
      this.random = Math.random();
      this.vcodeimg = '/rest/getCustomerRegCode?img-key=' + this.random;
    },
    hideList(index) {

      var ul = this.$refs.index[index]
      var m = getComputedStyle(ul, null)
      if (m.display == 'block') {
        ul.style.display = 'none'
        this.$refs.abc[index].classList.add('iky-arrow-right')
        this.$refs.abc[index].classList.remove('iky-arrow-down')
      } else {
        ul.style.display = 'block'
        this.$refs.abc[index].classList.remove('iky-arrow-right')
        this.$refs.abc[index].classList.add('iky-arrow-down')
      }
    },
    custassess(item) {
      var url = 'http://hktest.koyoo.cn/api/npsnaire.php?srctype=1&case_code=' + item.case_code;
      if (location.host == 'm.tcl.com') {
        url = 'http://hk2.koyoo.cn/api/npsnaire.php?srctype=1&case_code=' + item.case_code;
      }
      window.location.href = url;
    },
    clickHander() {
      let phone = this.phone;
      let vcode = this.vcode;
      var regphone = /^(1[3|4|5|7|8][0-9]\d{8})$/;

      if (phone) {
        if (regphone.test(phone)) {
          this.isPhone = false; this.checkPhone = ''
        } else {
          this.isPhone = true; this.checkPhone = '手机格式不正确'
        };
      } else {
        //  this.checkPhone = '手机号码不能为空'
        this.isPhone = true;
      }
      this.isVcode = !vcode
      if (!this.isPhone && !this.isVcode) {
        this.$http.post(api.search, { captchakey: this.random, captchadata: this.vcode, mobile: this.phone }, res => {
          if (res.code == 0) {
            this.getvcode();
            if(res.data.serviceDemandModelList && res.data.serviceDemandModelList.length>0){
                this.searchNum = '查询到<i style="color:#ff4545">' + res.data.serviceDemandModelList.length + '</i>个服务单号';
                this.searchList = res.data.serviceDemandModelList;
            }else{
                this.searchNum = res.msg
                this.searchList = [];
            }
          } else {
            switch (res.code) {
              case "-3":
                this.getvcode();
                this.checkvcode = res.msg
                this.isVcode = true;
                break;
            }
          }

        })
      }

    }
  }
}
</script>
