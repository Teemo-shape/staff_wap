<template>
  <div class="P5 P5-1">
    <yd-navbar title="P5全部评测">
      <router-link to="/P5" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="content">
        <ul>
          <li v-for="o in commlist">
            <img :src="o.operImg">
            <strong>{{o.operName}}</strong>
            <div>{{o.contents}}</div>
            <img :src="m.imgUrl" alt="" v-for="m in o.commentImgs">
            <p>{{o.floorNum}}{{o.opeTime}}</p>
          </li>
        </ul>
        <div class="btns">
          <a href="" class="btn">取消</a>
          <a href="" class="btn">发布</a>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      commlist:[]
    }
  },
  mounted() {
    //做分页
    this.getList()
  },
  methods: {
    getList(){
      this.$http.get('/activity/comments/getList', {
        activityName:'P5',
        isPage:1,
        current:1,
        size:10
      }, res => {
        if (res && res.data.records.length > 0) {
          this.commlist = res.data.records
        }
      })
    }
  },
  head() {
    return {
      title: 'P5全部评测'
    }
  }
}
</script>
