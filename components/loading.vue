<template lang="html">
    <div class="sync-loding"  v-show="loading">
      <div class="ldbox">
        <span class="loading"></span>
        <span class="text">加载中...</span>
      </div>
    </div>
</template>
<script>
export default {
  name: 'nuxt-loading',
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>