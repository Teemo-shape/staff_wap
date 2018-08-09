<template>
  <div class="problemDetail">
    <yd-navbar title="常见问题">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="yd-tab">
      <ul class="yd-tab-nav">
        <li :class="item.active?'yd-tab-nav-item yd-tab-active':'yd-tab-nav-item'" v-for="(item,i) in dataList" :key="i" @click="change(item)">
          <a href="javascript:;">{{item.categoryName}}</a>
        </li>
      </ul>
    </div>
    <div class="detail_pro">
      <div class="detail_pro_buttons">
        <button :class="{'btnActive':item.btnActive}" v-for="(item,i) in buttonList" :key="i" @click="changeTwo(item)">{{item.contentTitle}}</button>
      </div>
      <div class="detail_pro_content" v-html="content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout:'empty',
  head() {
    return {
      title: 'TCL官网-常见问题',
    }
  },
  data() {
    return {
      dataList: [], buttonList: [], content: '',
      uuid: '',
    }
  },
  created() {
    this.uuid = this.$route.query.uuid;
    this.getData()
  },
  methods: {
    getData() {
      this.$http.get('/servicecenter/getCommonProblems', {}, res => {
        if (res.code == '0') {
          this.dataList = res.retData.subCotentCategorys;
          this.resetTabs()
          //默认加载需要一条数据
          // this.buttonList = res.retData.subCotentCategorys[0].contentList;
          this.resetButtons()
          // let content = res.retData.subCotentCategorys[0].contentList[0].introduction;
          // let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/mg;
          // this.content = content.replace(reg, '').replace(/&nbsp;/gm, '')
        }
      })
    },
    resetTabs() {
      this.dataList.map((x, i) => {
        if (x.uuid == this.uuid) {
          x.active = true;
          this.buttonList = x.contentList;
          this.content = x.contentList && x.contentList.length > 0 ? x.contentList[0].introduction : '';
          // let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/mg;
          this.content = this.content;//.replace(reg, '').replace(/&nbsp;/gm, '')
        } else {
          x.active = false;
        }
      })
    },
    resetButtons() {
      this.buttonList.map((x, i) => {
        if (i == '0') {
          x.btnActive = true
        } else {
          x.btnActive = false;
        }
      })
    },
    change(item) {
      this.buttonList = item.contentList
      this.resetButtons()
      let content = item.contentList && item.contentList.length > 0 ? item.contentList[0].introduction : ''
      // let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/mg;
      this.content = content;//.replace(reg, '').replace(/&nbsp;/gm, '')
      this.dataList.map(x => x.active = item.uuid == x.uuid)
    },
    changeTwo(item) {
      let content = item.introduction
      // let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/mg;
      this.content = content;//.replace(reg, '').replace(/&nbsp;/gm, '')
      this.buttonList.map(x => x.btnActive = item.uuid == x.uuid)
    },
  },
}
</script>
