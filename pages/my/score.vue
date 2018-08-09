<template>
  <div class="score">
    <yd-navbar title="我的积分">
      <router-link to="/my" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>

    <div class="yd-cell-box">
      <div class="yd-cell">
        <!---->
        <div class="yd-cell-item">
          <div class="yd-cell-left">
            <span class="cell-icon"></span>
            <span>会员等级:
              <span class="cr">{{level}}</span>
            </span>
          </div>
          <div class="yd-cell-right"></div>
        </div>
        <div class="yd-cell-item">
          <div class="yd-cell-left">
            <span class="cell-icon"></span>
            <span>可用积分
              <span class="cr">{{integral}}</span>分</span>
          </div>
          <div class="yd-cell-right">
            <span>
              <button class="yd-btn yd-btn-hollow">
                <a href="http://hy.tcl.com" target="_blank">兑换积分</a>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="con">
      <div class="list" v-for="(item,index) in data" :key="index">
        <p class="title">{{item.sourceName}}</p>
        <p> {{item.sourceDescription}}</p>
        <p>{{item.billDate}}</p>
        <p class="core">{{item.type==0?'+'+item.inteValue:'-'+item.inteValue}}分</p>
      </div>
    </div>
  </div>
</template>
<script>
let loadMore = null;
export default {
  head() {
    return {
      title: 'TCL官网-我的积分',
    }
  },
  data() {
    return {
      page: 1, pageCount: 0, pageSize: 5, data: [], empty: false, level: 0, integral: 0
    }
  },
  watch: {
    page(val) {
      this.getData()
    }
  },
  mounted() {
    loadMore = this.loadMore
    window.addEventListener('scroll', loadMore, false)
    this.getData()
    this.queryJifen()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', loadMore, false)
  },
  methods: {
    getData() {
      this.loadEnd = false

      this.$http.get('/usercenter/tclcustomer/queryIntegralDetailListKuyu/' + this.page + '/' + this.pageSize, {}, res => {
        this.loadEnd = true
        if (res.totalNum == 0) this.empty = true
        if (res.totalNum) {
          this.pageCount = Math.ceil(res.totalNum / this.pageSize);
        };

        this.data = this.data.concat(res.data)
      })
    },
    queryJifen() {
      this.$http.post('/usercenter/tclcustomer/getIntegralFromMassMember', {}, res => {
        this.integral = res.integral
        this.level = res.level
      })
    },
    loadMore() {
      let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 100
      if (start && this.loadEnd && this.page < this.pageCount) {
        this.page++
      }
    },
  },
}
</script>

