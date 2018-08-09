<script src="../../plugins/http.js"></script>
<template>
  <div class="my-index">
    <yd-navbar title="个人中心">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="infoBox">
      <div class="avatar_name">
        <a :href="link"><img :src="face"><span>{{nickName}}</span></a>
      </div>
      <a href="/my/info" class="InfoSet">帐户设置&gt;</a>
      <!--<a href="" class="msg"><i class="icon iconfont-tcl icon-xiaoxipx"></i></a>-->
    </div>
    <yd-grids-group :rows="3" class="list">
      <yd-grids-item v-for="(item,index) in list" :key="index" :link="item.path">
        <span slot="icon" :class="'icon iconfont-tcl '+item.icon">
        </span>
        <span slot="text">{{item.title}}</span>
      </yd-grids-item>
    </yd-grids-group>
    <div class="questions"><a href="/my/question"><img src="/img/question.png" alt="T严选介绍与疑问"></a></div>
    <div class="orderTit">我的订单 <a href="/my/orders?state=0">全部<i class="icon iconfont-tcl icon-jiantou"></i></a></div>
    <yd-grids-group :rows="4" class="list">
      <yd-grids-item v-for="(item,index) in orderList" :key="index" :link="'/my/orders?state='+item.path">
        <span slot="icon" class="orderItem">
          <i v-show="item.order>0">{{item.order}}</i>
          <img :src="'/img/'+item.icon+'.png'" alt="">
        </span>
        <span slot="text">{{item.title}}</span>
      </yd-grids-item>
    </yd-grids-group>
    <div class="yd-cell-box menu">
      <div class="yd-cell">
        <a class="yd-cell-item" v-for="(item,index) in menu" :key="index" :href="item.path">
          <div class="yd-cell-left">
            <span>{{item.title}}</span>
          </div>
          <i class="icon iconfont-tcl icon-jiantou"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    layout: 'tabbar',
    head() {
      return {
        title: 'T严选商城-个人中心'
      }
    },
    data() {
      return {
        list: [
          { title: '收货地址', icon: 'icon-dizhi', path: '/my/manager?from=uc'},
          { title: '收藏夹', icon: 'icon-shoucangjia', path: '/my/collection'},
          { title: '足迹', icon: 'icon-zuji', path: '/my/footprint'},
        ],
        orderList: [
          { title: '待支付', icon: 'orderItem2', path: '1', order: 2 },
          { title: '待发货', icon: 'orderItem3', path: '4', order: 0 },
          { title: '待收货', icon: 'orderItem1', path: '6', order: 0 },
          { title: '待评价', icon: 'orderItem4', path: '11', order: 0 }
        ],
        menu: [
          { title: '退货 / 售后',  path: '/my/refund'},
          { title: '我的评价', path: '/my/comments' },
        ],
        nickName: '点击登录',
        link:'/account/login',
        face:''
      }
    },
    mounted() {
      if (this.$utils.getCookie('wap_staff_token')) {
        this.getInfo()
        this.getOrder()
      }
    },
    methods: {
      getInfo() {
        this.$http.get('/usercenter/tclcustomer/userInfo', { ranNum: Math.random() }, res => {
          if (res.code == 0) {
            this.nickName = res.data.nickName || res.data.customerName
            this.link = '/my/info'
            this.face = res.data.customerImgUrl?res.data.customerImgUrl:'/img/default.png'
          } else if (res.code == 403) {
            // window.location.href = '/user/login.html?backurl=' + decodeURIComponent(window.location.href)
          }
        });
      },
      getOrder() {
        this.$http.post('/usercenter/order/query/queryAllStatusOrderCountKuyu', { auth: 1 }, res => {
          if (res.code == 0) {
            this.orderList[0].order = res.data.waitpay
            this.orderList[1].order = res.data.waitship
            this.orderList[2].order = res.data.shipping
            this.orderList[3].order = res.data.waitcomment
          }
        });
      }
    }
  }
</script>
