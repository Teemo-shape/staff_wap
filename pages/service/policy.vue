<template>
  <div class="policy">
    <yd-navbar title="产品服务政策">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="service-top">
      <div class="don">服务政策</div>
      <div class="select">
        <ul>
          <li v-for="(item,index) in policy" :key='index'>
            <a :href="'/service/policy-detail?id='+item.uuid">
              <div><img :src="item.iconPath" :alt="item.contentTitle" /></div>
              <p>{{item.contentTitle}}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <div class="don title">收费标准</div>
      <ul>
        <li class="don" v-for="(item,index) in standard" :key='index'>
          <a :href="'/service/policy-detail?id='+item.uuid">{{item.contentTitle}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  layout:'empty',
  head() {
    return {
      title: 'TCL官网-产品服务政策',
    }
  },
  data() {
    return {
      standard: [], policy: []
    }
  },
  mounted() {
    this.getPolicy()
    this.getStandard()
  },
  methods: {
    getPolicy() {
      this.$http.get('/servicecenter/getPolicy', { terminalType: '02' }, res => {
        this.policy = res
      })
    },
    getStandard() {
      this.$http.get('/servicecenter/getStandard', { terminalType: '02' }, res => {
        this.standard = res
      })
    },
    getContent(uuid, type) {
      this.$http.get('/servicecenter/getContent', { contentId: uuid }, res => {

      })
    }
  }
}
</script>