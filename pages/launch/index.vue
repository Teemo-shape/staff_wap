<template>
  <div class="launch">
    <yd-navbar title="TCL2018春季发布会">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
      <yd-slider autoplay="3000" style="min-height:8rem;">
        <yd-slider-item v-for="(o,i) in bannerlist" :key="i">
          <a :href="o.link">
            <img :src="o.url" :alt="o.name">
          </a>
        </yd-slider-item>
      </yd-slider>
    <div class="content">
      <h3 class="modTit"><img src="/img/videoTit.png"></h3>
      <div class="videos">
        <ul id="_width">
          <li v-for="(o,i) in videolist" :key="i" @click="show=true;videoform=o">
            <div class="img"><img :src="o.icon" class="icon"><img src="/img/play.png" class="play"></div>
            <span>{{o.name}}</span>
          </li>
        </ul>
      </div>

      <yd-popup v-model="show" position="center" width="70%">
          <video :src="videoform.url" :poster="videoform.icon" width="100%" controls="controls"></video>
      </yd-popup>
      <h3 class="modTit"><img src="/img/newsTit.png"></h3>
      <ul class="news">
          <!-- <li><a href="/group/news/newsDetails?id=2021&type=4"><p class="img"><img src="http://s0.mall.tcl.com/group1/M00/04/18/CkgbllqfkbKAQsUIAABfccTErsM923.fid"></p><strong>风冷+全面战略升级致敬新时代 TCL冰箱新品重磅发布</strong><span>1520265600</span></a></li> -->
          <li v-for="(o,i) in newslist" :key="i">
            <a :href="'/group/news/newsDetails?id='+o.id+'&type=4'"><p class="img"><img :src="o.pic"></p><strong>{{o.shorttitle}}</strong><span>{{o.issueTime}}</span></a>
          </li>
      </ul>
      <a href="/group/news/index" class="more"><img src="/img/more.png"></a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      videolist:[],
      bannerlist:[],
      newslist:[],
      _width:'5rem',
      show:false,
      videoform:{}
    }
  },
  mounted() {
    this.getBanner()
    this.getNews()
    this.getVideo()
  },
  methods: {
      getBanner() {
        this.$http.get('/bannerpic/getBannerPicList', {
          type:9
        }, res => {
          if (res && res.data.length > 0) {
            this.bannerlist = res.data
          }
        })
      },
      getNews() {
        this.$http.post('/group/news/findJsonData', {
          notRest:true,
          type:4,
          pageNumber:1,
          listAccount:8
        }, res => {
              var newsL = res.data
              this.newslist = newsL.slice(0,3);
              this.newslist.forEach((o) => {
                o.issueTime = this.$utils.formatDate(o.issueTime);
              })
        })
      },
      getVideo() {
        this.$http.get('/bannerpic/getBannerPicList', {
          type:8
        }, res => {
          if (res && res.data.length > 0) {
            this.videolist = res.data;
            document.getElementById('_width').style.width = 6.4*res.data.length+'rem'
          }
        })
      }
  },
  head() {
    return {
      title: 'TCL2018春季发布会',
    }
  }
}
</script>
