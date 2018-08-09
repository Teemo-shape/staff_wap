<template>
  <div class="download">
    <yd-navbar :title="title">
      <router-link to="/service/tutorial" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="cd">
      <input type="text" v-model="input" @keyup="match" class="inp" placeholder="请输入产品型号" />
      <ul v-show="flag">
        <li v-for="(item,key) in downList" :key='key' @click="chooseName(item)">
          {{item.name}}
        </li>
      </ul>
    </div>
    <yd-cell-group>
      <yd-cell-item arrow v-if="showTv">
        <span slot="left">尺寸</span>
        <select slot="right" v-model="uuidTv1" @change="change" :class="{select:uuidTv1}">
          <option value="">请选择尺寸</option>
          <option v-for="(item,i) in sizeList" :key='i' :value="item.uuid">{{item.categoryName}}</option>
        </select>
      </yd-cell-item>
      <yd-cell-item arrow>
        <span slot="left">系列</span>
        <select slot="right" v-model="uuidTv2" @change="change1" :class="{select:uuidTv2}">
          <option value="">请选择系列</option>
          <option v-for="(item,i) in sizeList1" :key='i' :value="item.uuid">{{item.categoryName}}</option>
        </select>
      </yd-cell-item>
      <yd-cell-item arrow type="label">
        <span slot="left" selected="true" disabled="true">型号</span>
        <select slot="right" v-model="uuidTv3" @change="change2" :class="{select:uuidTv3}">
          <option value="">请选择型号</option>
          <option v-for="(item,i) in sizeList2" :key='i' :value="item.uuid">{{item.name}}</option>
        </select>
      </yd-cell-item>
    </yd-cell-group>
    <div class="mid">
      <yd-button class="pre" type="primary" @click.native="preView">预览</yd-button>
      <!--<yd-button  type="danger" bgcolor="#ff4545" v-if="showDown" color="white" >下载</yd-button>-->
      <yd-button type="danger" v-if="show" @click.native="noDown">下载</yd-button>
      <!--<a href="http://s0.mall.tcl.com/group1/M00/03/67/Ckgblllne1WABn-5ABrFxQUWSr4431.pdf" download="w3logo">2222</a>-->
    </div>
  </div>
</template>

<script>
export default {
  layout:'empty',
  head() {
    return {
      title: 'TCL官网-产品说明书',
    }
  },
  data() {
    return {
      input1: '', showTv: false, input: '', title: '', showDown: true, sizeList: [], sizeList1: [], sizeList2: [], uuidTv1: '',
      uuidTv2: '', uuidTv3: '', flag: false, show: false, downList: [], pdf: ''
    }
  },
  mounted() {
    this.title = this.$route.query.name
    this.categoryId = this.$route.query.c ? this.$route.query.c : ''
    if (this.title == "电视") {
      this.showTv = true
      this.getTv()
    } else {
      this.getData(this.categoryId)
    }
    if (!navigator.userAgent.indexOf("iPhone") > -1) {
      this.show = true
    }
  },
  methods: {
    getTv() {
      this.$http.post('/servicecenter/getTVVersions', {}, res => {
        this.sizeList = res.retData.subCotentCategorys
      })
    },
    getData() {
      this.$http.get('/servicecenter/subcategoryname', { categoryId: this.categoryId }, res => {
        this.sizeList1 = []
        this.sizeList1 = res
      })
    },
    match() {
      if (this.input == "") {
        this.flag = false
        return false
      } else {
        this.flag = true
        setTimeout(() => {
          this.$http.post('/servicecenter/matchSpecification', { productVersion: this.input, cateName: this.title, callback: 1 }, res => {
            if (res.code == 1) {
              this.downList = [{ name: '未找到此型号' }]
              return false
            }
            this.downList = res.retData
          })
        }, 100)
      }

    },
    noDown() {
      if (this.uuidTv3 == "") {
        this.$dialog.alert({ mes: "请选择完整您所需要下载的产品型号" })
        return false
      }
      else {
        window.open(this.pdf)
      }
    },
    change() {
      this.sizeList1 = []
      this.sizeList2 = []
      this.uuidTv2 = ''
      this.uuidTv3 = ''
      this.sizeList.map(o => {
        if (this.uuidTv1 == o.uuid) {
          this.sizeList1 = o.subCotentCategorys
        }
      })
    },
    change1() {
      this.uuidTv3 = ''
      this.sizeList2 = []
      this.$http.get('/servicecenter/productversion', { subCategoryId: this.uuidTv2 }, res => {
        this.sizeList2 = res
      })
    },
    change2() {
      if (this.uuidTv3) {
        this.$http.get('/servicecenter/downservice', { versionId: this.uuidTv3 }, res => {
          this.pdf = res[0].url
        })
      }

    },
    preView() {
      if (this.uuidTv3 == "") {
        this.$dialog.alert({ mes: "请选择完整您所需要搜索的产品型号" })
        return false
      } else {
        window.open(this.pdf)
      }
    },
    chooseName(i) {
      window.open(i.url)
      this.input = ''
      this.flag = false
    }
  }
}
</script>