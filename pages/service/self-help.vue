<template>
  <div class="problemDetail self-help">
    <yd-navbar title="自助检测">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
      <router-link to="/service/search" slot="right">
        <img class="search-icon" src="/img/search.png" alt="">
      </router-link>
    </yd-navbar>
    <div class="yd-tab">
      <ul class="yd-tab-nav">
        <li :class="item.active?'yd-tab-nav-item yd-tab-active':'yd-tab-nav-item'" v-for="(item,i) in categoryList" :key="i" @click="change(item)">
          <div>
            <img :src="item.imgUrl" alt="">
          </div>
          <a href="javascript:;">{{item.title}}</a>
        </li>
      </ul>
    </div>
    <div class="detail_pro">
      <div class="detail_pro_buttons">
        <button :class="{'btnActive':item.btnActive}" v-for="(item,i) in tagList" :key="i" @click="changeTwo(item)">{{item.title}}</button>
      </div>
      <!-- 列表 -->
      <div class="detail_pro_content"  v-show="refresh">
        <div class="content_item" v-for="(item,index) in dataList" :key="index">
          <!-- 主列表 -->
          <div class="content_mainItem" v-if="isOldList">
            <div class="content_item_arrow">
              <img src="/img/arrow.png" alt="">
            </div>
            <div class="content_item_title">
              <p @click="getChoice(item)">
                {{item.title}}
              </p>
            </div>
            <div class="content_item_video" @click="playVideo(item.videoUrl)" v-show="item.videoUrl">
              <img src="/img/video.png" alt="">
            </div>
          </div>
          <!-- 新数据 -->
          <div class="content_mainItem" v-else>
            <div class="content_item_arrow">
              <img src="/img/arrow.png" alt="">
            </div>
            <div class="content_item_title">
              <p>
                {{item.title}}
                <span v-show="item.isGoBefore&&!showResults" @click="goBefore(item,index)">&nbsp;&nbsp;[修改]</span>
              </p>
            </div>
            <div class="content_item_video" @click="playVideo(item.videoUrl)" v-show="item.videoUrl&&!showResults">
              <img src="/img/video.png" alt="">
            </div>
          </div>
          <div class="content_subItem">
            <ul>
              <li v-for="(val,idx) in item.children" :key="idx" v-show="val.isClick">
                <span @click="getChildren(val,index)">
                  {{(idx+1)+' . '+val.title}}
                </span>
                <div v-show="val.videoUrl&&!showResults" @click="playVideo(val.videoUrl)">
                  <img src="/img/video.png" alt="">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <p class="cutLine" v-show="showResults"></p>
    <div>
      <div class="results" v-show="showResults">
        <b>自检结果</b>
        <p v-show="resutlsData.videoUrl" @click="playVideo(resutlsData.videoUrl)">
          <span>查看视频教程</span>
          <span>
            <img src="/img/video.png" alt="">
          </span>
        </p>
      </div>
      <div class="resutls_content" v-show="showResults">
        <p>
          {{resutlsData.title}}
        </p>
        <div class="resutls_footer">
          <div class="help_again" v-show="resutlsData.isRecheck" @click="$router.go(0)">重新自检</div>
          <div class="baoxiu" v-show="resutlsData.isCommit" @click="$router.push({path:'/service/repair-install'})">在线报修</div>
        </div>
      </div>
    </div>
    <!-- <video id="video" ref="video" v-show="isPlay" :src="src" playsinline="true">
    </video> -->
    <player @changState="changState" v-show="isPlay" :isPlay="true" :videoSrc="src"></player>
  </div>
</template>

<script>
import player from "~/components/player";
let loadMore = null;
export default {
  layout: "empty",
  components: {
    player
  },
  head() {
    return {
      title: "TCL官网-自助检测"
    };
  },
  data() {
    return {
      categoryList: [
        // { title: "电视", imgUrl: "/img/tv.png", active: true },
        // { title: "空调", imgUrl: "/img/kt.png", active: false },
        // { title: "洗衣机", imgUrl: "/img/xiyiji.png", active: false },
        // { title: "冰箱", imgUrl: "/img/bx.png", active: false }
      ],
      dataList: [],
      tagList: [],
      children: [],
      isPlay: false,
      src: "",
      pageNo: 1,
      pageSize: 10,
      pageCount: 0,
      // title: "",
      type: 1, //1=品类，2=标签，3=问题，4=选项，5=结论
      labelUuid: "", //标签uuid
      categoryUuid: "", //品类uuid
      showResults: false,
      resutlsData: {},
      pUuid: "",
      isOldList: true,
      refresh: true
    };
  },
  mounted() {
    loadMore = this.loadMore;
    window.addEventListener("scroll", loadMore, false);
    this.getData();
  },

  watch: {
    pageNo(val) {
      this.getProblem();
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", loadMore, false);
  },
  methods: {
    playVideo(src) {
      this.src = src;
      this.isPlay = true;
      // this.$refs["video"].webkitEnterFullScreen();
      // console.log(this.src);
    },
    changState(v) {
      this.isPlay = v; //移除modal
      this.src = ""; //置空视频src
    },
    getData(categoryUuid) {
      this.tagList = [];
      this.loadEnd = false;
      this.$http.post(
        "/selfcheck/serviceqa/getIndexData",
        {
          pageNo: 1,
          pageSize: this.pageSize,
          categoryUuid: categoryUuid ? categoryUuid : ""
        },
        res => {
          if (res.code == 0) {
            this.loadEnd = true;
            var data = [];
            if (res.data.categoryList && res.data.categoryList.length > 0) {
              this.categoryList = res.data.categoryList;
              this.categoryUuid = categoryUuid
                ? categoryUuid
                : this.categoryList[0].uuid;
              this.resetTabs();
            }
            if (
              res.data.questionPage &&
              res.data.questionPage.recordList.length > 0
            ) {
              data = res.data.questionPage.recordList;
              var totalNum = res.data.questionPage.totalCount;
              this.dataList = this.dataList.concat(data);
              this.pageCount = Math.ceil(totalNum / 10);
            }
            if (res.data.tagList && res.data.tagList.length > 0) {
              this.tagList = res.data.tagList;
              this.labelUuid = this.tagList[0].uuid;
              //消除pageNo大于1时，带来的页面混乱
              if (this.labelUuid && this.pageNo > 1) {
                this.dataList = [];
                this.pageNo = 1;
              }
            }
            this.resetTag();
          }
        }
      );
    },

    getProblem() {
      this.$http.post(
        "/selfcheck/serviceqa/list",
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          parentUuid: this.labelUuid,
          type: 3
        },
        res => {
          if (res.code == 0) {
            var data = [];
            var totalNum = res.data.totalCount;
            this.pageCount = Math.ceil(totalNum / 10);
            data = res.data.recordList;
            this.dataList = this.dataList.concat(data);
          }
        }
      );
    },
    //点击主列表问题
    getChoice(item) {
      window.removeEventListener("scroll", loadMore, false);
      this.dataList = [];
      this.isOldList = false;
      this.dataList.push(item);
      this.$http.post(
        "/selfcheck/serviceqa/getByCondition",
        {
          parentUuid: item.uuid
        },
        res => {
          if (res.code == 0) {
            if (res.data.length > 0) {
              res.data.map(x => {
                if (x.type == 4) {
                  x.isClick = true; //用于点击选项之后保留 当前选项
                  x.canClick = true; //当前选项是否可以点击，点击过后不能点击
                  this.dataList[0].children = res.data;
                  this.refresh = false;
                  this.refresh = true;
                }
              });
            }else{
              this.showResults = true;
              this.resutlsData = { title: "未找到相关答案，请在线报修" };
            }
          }
        }
      );
    },
    //获取下个问题及选项
    getChildren(item, index) {
      if (!item.canClick) {
        return false;
      }
      this.dataList.splice(index + 1);
      this.dataList.map((x, i) => {
        if (index == i) {
          x.children.map(y => {
            if (y.uuid == item.uuid) {
              // x.children = x.children.splice(i, 1);
              y.isClick = true;
              y.canClick = false;
            } else {
              y.isClick = false;
            }
          });
        }
        //是否显示修改
        if (x.uuid == item.parentUuid) {
          x.isGoBefore = true;
        } else {
          x.isGoBefore = false;
        }
      });
      this.$http.post(
        "/selfcheck/serviceqa/getChildren",
        { uuid: item.uuid },
        res => {
          if (res.code == 0) {
            if (res.data.length > 0) {
              if (res.data[0].type == 5) {
                this.showResults = true;
                this.resutlsData = res.data[0];
              } else {
                res.data[0].children.map(
                  z => ((z.isClick = true), (z.canClick = true))
                );
                this.dataList.push(res.data[0]);
                this.pUuid = res.data[0].uuid; //获取当前问题的uuid，用于返回上一级请求
              }
            } else {
              //无结果
              this.dataList.map(x => (x.isGoBefore = false));
              this.showResults = true;
              this.resutlsData = { title: "未找到相关答案，请在线报修" };
              this.refresh = false;
              this.refresh = true;
            }
          }
        }
      );
    },
    // 回到上一级
    goBefore(item, index) {
      this.dataList.splice(index);
      if (index > 0) {
        this.dataList[index - 1].isGoBefore = true;
      }
      this.$http.post(
        "/selfcheck/serviceqa/getParent",
        {
          uuid: this.pUuid
        },
        res => {
          if (res.code == 0) {
            res.data.children.map(
              x => ((x.isClick = true), (x.canClick = true))
            );
            this.dataList.push(res.data);
          }
        }
      );
      this.pUuid = item.uuid;
    },
    loadMore() {
      let start =
        window.scrollY + document.body.clientHeight >=
        document.body.scrollHeight - 100;
      if (start && this.loadEnd && this.pageNo < this.pageCount) {
        this.pageNo++;
      }
    },
    resetTabs() {
      this.categoryList.map(x => {
        if (x.uuid == this.categoryUuid) {
          x.active = true;
        } else {
          x.active = false;
        }
      });
    },
    resetTag() {
      this.tagList.map((x, i) => {
        if (i == "0") {
          x.btnActive = true;
        } else {
          x.btnActive = false;
        }
      });
    },
    change(item) {
      this.isOldList = true;
      this.children = [];
      this.dataList = []; //此处数据置空，不在getData中置空
      this.pUuid = "";
      this.categoryUuid = item.categoryUuid;
      this.getData(this.categoryUuid);
      this.categoryList.map(x => (x.active = x.uuid == item.uuid));
      this.showResults = false;
      window.addEventListener("scroll", loadMore, false);
    },
    changeTwo(item) {
      this.isOldList = true;
      this.dataList = [];
      this.children = [];
      this.pUuid = "";
      this.showResults = false;
      this.labelUuid = item.uuid;
      this.pageNo == 1 && this.getProblem();
      this.pageNo = 1;
      this.tagList.map(x => (x.btnActive = item.uuid == x.uuid));
      window.addEventListener("scroll", loadMore, false);
    }
  }
};
</script>
