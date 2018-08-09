<template>
  <div class="error">
    <yd-navbar title="服务异常">
    </yd-navbar>
    <div class="error-con">
      <p>{{params.message}}</p>
      <p>错误代码:{{params.code}}</p>
    </div>
    <yd-button size="large" type="hollow" class="refresh" @click.native="refresh">刷新页面</yd-button>
  </div>
</template>
<script>
export default {
  layout: 'empty',
  data() {
    return {
      params: {
        code: 9999,
        message: '服务开了下小差,很抱歉给您造成不便...',
        from: typeof window !== 'undefined' ? window.location.href : '/'
      }
    }
  },
  methods: {
    refresh() {
      window.location.href = this.params.from
    }
  },
  mounted() {
    let q = this.$route.query
    this.params.code = q.code || 9999
    this.params.from = q.from || '/'
  }
}
</script>