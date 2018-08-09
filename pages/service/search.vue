<template>
  <div class="problemDetail self-help">
    <yd-navbar title="搜索结果">
      <router-link to="/service/self-help" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="search_box">
      <div class="search_input">
        <input v-model="searchContent" type="text" placeholder="请输入关键词搜索">
        <a href="javascript:void(0);" @click="search">
          <img src="/img/search.png" alt="">
        </a>
      </div>
      <div class="search_result" v-show="resutls">
        <p>
          搜索 “
          <span>{{content}}</span>
          ”，共搜索到
          <span>{{totalCount}}条</span>
          结果
        </p>
      </div>
    </div>
    <div class="detail_pro">
      <div class="detail_pro_buttons" v-show="refresh">
        <button :class="{'btnActive':item.btnActive}" v-for="(item,i) in buttonList" :key="i" @click="changeTwo(item)">{{item.categoryName+' ('+item.num+')'}}</button>
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
    <player @changState="changState" v-show="isPlay" :isPlay="true" :videoSrc="src"></player>
  </div>
</template>

<script>
import player from "~/components/player";
let loadMore = null;
export default {
  layout: "empty",
  components: { player },
  head() {
    return {
      title: "TCL官网-搜索结果"
    };
  },
  data() {
    return {
      dataList: [],
      buttonList: [],
      children: [],
      src: "",
      searchContent: "",
      content: "",
      isPlay: false,
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      pageCount: 0,
      resutls: false,
      categoryUuid: "",
      refresh: true,
      showResults: false,
      resutlsData: {},
      pUuid: "",
      isOldList: true
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    loadMore = this.loadMore;
    window.addEventListener("scroll", loadMore, false);
  },
  watch: {
    pageNo(val) {
      this.searchResults();
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
      this.isPlay = v;
      this.src = ""; //置空视频src
    },
    search() {
      this.dataList = [];
      this.showResults = false;
      this.isOldList = true;
      this.pageNo == 1&& this.searchResults();
      this.pageNo = 1;
      // this.searchResults();
    },
    searchResults() {
      if (!this.searchContent) {
        this.$dialog.alert({
          mes: "请输入搜索内容"
        });
        return false;
      }
      this.loadEnd = false;
      this.$http.post(
        "/selfcheck/serviceqa/list",
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          title: this.searchContent,
          categoryUuid: this.categoryUuid,
          type: 3
        },
        res => {
          if (res.code == 0) {
            this.getCategoryNum();
            this.loadEnd = true;
            // this.dataList = [];
            var data = [];
            // this.totalCount = res.data.totalCount;
            this.pageCount = Math.ceil(res.data.totalCount / 10);
            this.resutls = true;
            this.content = this.searchContent;
            if (res.data.recordList.length > 0) {
              data = res.data.recordList;
              this.dataList = this.dataList.concat(data);
            }
          }
        }
      );
    },
    getCategoryNum() {
      this.$http.post(
        "/selfcheck/serviceqa/getCategoryNum",
        {
          title: this.searchContent
        },
        res => {
          if (res.code == 0) {
            this.buttonList = [];
            this.totalCount = 0;
            this.buttonList = res.data;
            this.buttonList.map(
              x => (x.btnActive = this.categoryUuid == x.categoryUuid)
            );
            this.buttonList.map(x => (this.totalCount += x.num));
            // this.categoryUuid = this.buttonList[0].categoryUuid;
            // this.resetTag();
          }
        }
      );
    },
    getData() {
      this.$http.post(
        "/selfcheck/serviceqa/getCategoryNum",
        {
          title: this.searchContent
        },
        res => {
          if (res.code == 0) {
            this.buttonList = [];
            this.buttonList = res.data;
            this.buttonList.map(x => x.num=0);
            this.categoryUuid = this.buttonList[0].categoryUuid;
            this.resetTag();
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
                  x.canClick = true;
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
    resetTag() {
      this.buttonList.map((x, i) => {
        if (i == 0) {
          x.btnActive = true;
        } else {
          x.btnActive = false;
        }
      });
    },
    changeTwo(item) {
      this.buttonList.map(
        x => (x.btnActive = item.categoryUuid == x.categoryUuid)
      );
      this.refresh = false;
      this.refresh = true;
      this.isOldList = true;
      this.categoryUuid = item.categoryUuid;
      window.addEventListener("scroll", loadMore, false);
      this.search()
    },
    loadMore() {
      let start =
        window.scrollY + document.body.clientHeight >=
        document.body.scrollHeight - 100;
      if (start && this.loadEnd && this.pageNo < this.pageCount) {
        this.pageNo++;
      }
    }
  }
};
</script>
