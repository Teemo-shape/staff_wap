<template>
  <div class="policy">
    <yd-navbar :title="title">
      <router-link to="/service/policy" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="policy-con" v-html="content"> </div>
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
      title: '', content: ''
    }
  },
  mounted() {
    this.getContent()
  },
  methods: {
    getContent() {
      let contentId = this.$route.query.id
      this.$http.get('/servicecenter/getContent', { contentId: contentId }, res => {
        this.title = res.retData.categoryName
        // let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/mg;
        // let content = res.retData.introduction
        // this.content = content.replace(reg,'')
        this.content = res.retData.introduction
      })
    }
  }
}
</script>