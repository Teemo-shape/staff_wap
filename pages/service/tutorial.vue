<template>
  <div class="teach">
    <yd-navbar title="产品教程">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="service-top">
      <div class="don">产品说明书</div>
      <div class="select">
        <ul>
          <li v-for="(item,index) in list" :key='index'>
            <a :href="item.href">
              <div><img :src="item.src" /></div>
              <p>{{item.name}}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <div class="don wei">软件/驱动下载</div>
      <ul>
        <li class="don" v-for="(item,index) in href" :key='index'>
          <span class="icon-file"><img src="/img/softicon.png" /></span>
          <span class="fl mid">{{item.name}}
            <span class="version">{{item.v}}</span>
          </span>
          <a class="icon-down" v-if="flag" :href="item.url"><img src="/img/download.png"></a>
          <a class="icon-down" v-if="!flag" @click="to"><img src="/img/download.png"></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  layout:'empty',
  head() {
    return {
      title: 'TCL官网-产品教程',
    }
  },
  data() {
    return {
      flag: true,
      href: [{ name: 'TCL家庭云(电脑端)', url: 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/driver/TCLFamilyCloud.zip', v: '版本：v1.0  　大小：18MB' },
      { name: 'TCL家庭云(手机端)', url: 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/driver/TCLFamilyCloud-android1.0.zip', v: '版本：v1.0  　大小：3.6MB' },
      { name: 'TCL多屏互动4.0', url: 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/driver/duopinghudong4.apk', v: '版本：v4.0  　大小：38M' },
      { name: 'TCL多屏互动2.0', url: 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/driver/duopinghudong2.apk', v: '版本：v2.0  　大小：3.7MB' },
      { name: 'TCL智能传屏', url: 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/driver/TCLsmartcp.apk', v: '版本：V0.9.6.1  　大小：2.3M' }
      ],
      list: [{ src: '/img/tv.png', name: '电视', href: '/service/download?name=电视' },
      { src: '/img/kt.png', name: '空调', href: '/service/download?name=空调&c=c6f99ee6861840228a5332e908f5e62d' },
      { src: '/img/xiyiji.png', name: '洗衣机', href: '/service/download?name=洗衣机&c=d4dfb5d297444b93949b17be2c57718a' },
      { src: '/img/bx.png', name: '冰箱', href: '/service/download?name=冰箱&c=5fd13102f48a49ca9767161ae9756e25' }
      ]
    }
  },
  mounted() {
    if (navigator.userAgent.indexOf("Version") > -1) {
      this.flag = false
    }
  },
  methods: {
    to(url) {
      this.$dialog.alert({ mes: "该浏览器不支持下载，请更换浏览器" })
    }
  }
}
</script>
 