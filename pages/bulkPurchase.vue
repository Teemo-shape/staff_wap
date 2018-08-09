<template>
  <div class="bulk-purchase">
    <yd-navbar title="TCL大宗采购业务">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="banner">
      <img src="/img/b_pzpic.jpg" alt="">
    </div>
    <div class="con">
      <h3>TCL大宗采购业务</h3>
      <p class="txt">
        我们为企事业单位、批量采购用户提供一对一服务窗口，包括售前咨询、采购下单、备货与订购、物流配送及售后服务，都由专人为企业客户提供全程关怀，让专业采购变得更加简单、便捷，全面满足您的采购需求。
      </p>
      <h2>请填写您的采购需求</h2>
      <div class="group">
        <input type="text" v-model="name" placeholder="请输入联系人（最多12个字符）" maxlength="12">
      </div>
      <div class="group">
        <input type="text" v-model="phone" placeholder="请输入手机号码/座机" maxlength="11">
        <p class="tip"></p>
      </div>
      <div class="group">
        <input type="text" v-model="email" placeholder="请输入邮箱" maxlength="50">
        <p class="tip"></p>
      </div>
      <div class="group">
        <input type="text" v-model="company" placeholder="请输入公司名称" maxlength="50">
        <p class="tip"></p>
      </div>
      <div class="group">
        <span class="iky-arrow-down"></span>
        <input type="text" placeholder="所在地址" v-model="address" maxlength="50" @click="addressV=true">
        <cityselect v-model="addressV" :done="resultCtiy" provance="" city="" area=""></cityselect>
        <p class="tip"></p>
      </div>
      <div class="group area">
        <span>需求留言</span>
        <textarea placeholder="请在此留下您的需求" v-model="message" maxlength="500" @keydown="change"></textarea>
        <p class="tip"></p>
      </div>
      <p class="tip">还可以输入
        <span class="txt-count">{{count}}</span>个字符</p>
      <div class="group">
        <input type="button" class="yd-btn yd-btn-danger" @click="save" value="提交需求">
      </div>
      <div class="link">
        <h2>联系方式</h2>
        <div class="tel">
          <span class="iky-mobile"></span>
          <p style="margin-top: .8rem">传真：0752-2385649</p>
          <p></p>
        </div>
        <div class="email">
          <span class="iky-email"></span>
          <p>4007123456@tcl.com</p>
          <p>我们会在第一时间回复您</p>
        </div>
      </div>
      <div class="advantage">
        <h2>企业客户优势</h2>
        <div class="item">
          <span class="iky-square-line"></span>
          <h2>品质保障</h2>
          <p>TCL工厂直供，原装正品</p>
        </div>
        <div class="item">
          <span class="iky-delivery"></span>
          <h2>全国物流覆盖</h2>
          <p>全国省市物流无差别覆盖快捷 安全 高效送达</p>
        </div>
        <div class="item">
          <span class="iky-faq-line"></span>
          <h2>售后无忧</h2>
          <p>全国联保7X24小时在线服务专人协调处理便捷无忧</p>
        </div>
        <div class="item">
          <span class="iky-coupons-line"></span>
          <h2>最新优惠价</h2>
          <p>产品调价及时通知为您提供最新优惠价</p>
        </div>
        <div class="item">
          <span class="iky-3"></span>
          <h2>3大特色</h2>
          <p>产品调价及时通知为您提供最新优惠价</p>
        </div>
        <div class="item">
          <span class="iky-address-line"></span>
          <h2>全方位服务</h2>
          <p>专人对接咨询 提供解决方案签订 订单全名跟踪及时上门安装调试</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { CitySelect } from '~/components/cityselect';
export default {
  layout: 'tabbar',
  components: { 'cityselect': CitySelect, },
  data() {
    return {
      count: 500,
      name: '',
      phone: '',
      address: '',
      email: '',
      company: '',
      message: '',
      addressV: false,
    }
  },
  methods: {
    resultCtiy(ret) {
      this.address = ret.provance.name + '/' + ret.city.name + '/' + ret.area.name + '/' + ret.region.name;
    },
    save() {
      let reg = [
        { obj: this.name, errTip: '请输入联系人(最多12个字符)', pattern: /\S{1,12}$/ },
        { obj: this.phone, errTip: '请输入正确手机号码或座机', pattern: /^1[3|4|5|7|8|9][0-9]{9}$/, pattern1: /^0\d{2,3}-?\d{7,8}$/ },
        { obj: this.email, errTip: '请输入正确的邮箱', pattern: /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/ },
        { obj: this.address, errTip: '请选择所在地址', pattern: /^\S{1,50}$/ },
        { obj: this.company, errTip: '请输入公司名称', pattern: /^\S{1,50}$/ },
        { obj: this.message, errTip: '请输入您的需求,500字符内', pattern: /\S{1,500}$/ },
      ]
      let valide = true
      reg.reverse()
      reg.map((x) => {
        let v = x.pattern1 ? x.pattern.test(x.obj) || x.pattern1.test(x.obj) : x.pattern.test(x.obj)
        if (!v) {
          valide = v
          this.$dialog.alert({ mes: x.errTip })
          return false
        }
      })
      if (!valide) { return false }
      let params = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        email: this.email,
        company: this.company,
        message: this.message,
      }
      this.$http.post('/bulkpurchase/savemsg', params, res => {
        if (res.status && res.status == 'success') {
          this.$dialog.alert({ mes: res.msg })
          this.name = ''
          this.phone = ''
          this.address = ''
          this.email = ''
          this.company = ''
          this.message = ''
          this.ranNum = ''
        } else {
          this.$dialog.alert({ mes: '信息提交失败，请稍后重试！' })
        };
      })
    },
    change() {
      this.count = 500 - this.message.length
    }
  },
  head() {
    return {
      title: '大宗采购',
    }
  }
}
</script>