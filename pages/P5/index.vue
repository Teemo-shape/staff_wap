<template>
  <div :class="show==true?'P5 P5-1':'P5'">
    <yd-navbar title="P5评测有礼活动">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div class="content">
      <h2 class="title" v-show="!show"><img src="/img/P5/title.png"></h2>
      <div class="btns">
        <a href="/P5/comments" class="btn">查看评测</a>
        <a href="/P5/join" class="btn">参加活动</a>
      </div>
      <p class="ckxz"><span @click="show=true;countdown()" v-show="!show">活动细则&gt;&gt;</span></p>
      <div class="ruleCon" v-show="show">
        <h4 class="tit">活动规则<span class="iky-close" @click="show=false;"></span></h4>
        <div class="txtWrap">
            <div class="txt">
                    <h5 class="btn">活动时间</h5>
                    <p>2018年3月15日-4月30日</p>
                    <h5 class="btn">第一阶段</h5>
                    <p>第一阶段：评测有礼活动，2018年3月15日-4月15日</p>
                    <ol class="decimal">
                      <li>凡在线下实体店或官网购买P5系列电视的用户即有资格参与，注册登录官网后对P5电视进行评测；</li>
                      <li>评测要求为围绕产品外观、使用感受、购物体验等方面发布不少于100字的文字，并上传发票照片（发票用于官方核对参与资格，不对外显示）和不少于3张电视照片。</li>
                      <li>参与评测即可获得奖品：
                          <ol>
                            <li>前100名参与评论活动即可价值397元天籁K歌大礼包（话筒一个+天籁K歌软件会员一年）；</li>
                            <li>101-300名获得三个月企鹅影院会员卡；</li>
                            <li>300名后获得1个月企鹅影院会员卡；</li>
                          </ol>
                      </li>
                      <li>获奖名单将在活动结束后7个工作日内在TCL官方商城公布，并以短信通知获奖者，请已参与用户密切留意官网动态。</li>
                    </ol>
                    <h5 class="btn">第二阶段</h5>
                    <p>第二阶段：评测达人大比拼，活动时间：2018年4月2日-30日</p>
                    <ol class="decimal">
                        <li>从3月15-31日评论有礼活动中精选30名最走心的使用评测，在“TCL官方商城”公众号发起大比拼活动</li>
                        <li>入选者通过转发活动推文呼吁亲友参与投票，活动结束后按照投票数排名分配奖品（投票数少于100票不享受奖品）</li>
                        <li>奖品设置：
                          <p>一等奖（第1名）：免单（按发票金额返现）</p>
                          <p>二等奖（第2-3名）：阿尔法机器人</p>
                          <p>三等奖（第4-8名）：TCL官方商城500元优惠券（全年全场无门槛）</p>
                          <p>四等奖（第9-15名）：TCL铁粉定制精美大礼包（含双肩包、雨伞、T恤）</p>
                          <p>五等奖（第16-30名）：天籁K歌话筒</p>
                        </li>
                    </ol>
                    <p>注意：</p>
                    <ol class="decimal">
                        <li>活动期内，每位购买P5电视新品的用户只有一次评测机会；</li>
                        <li>如评测内容中含不雅用语或敏感词汇，TCL官方商城将删除违规评测内容。</li>
                    </ol>
            </div>
          </div>
          <div class="btm">
            <a href="#" :class="timer<=0?'btn active':'btn'">参加活动<span v-if="timer!=0">({{timer}}s)</span></a>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show:false,
      timer:5
    }
  },
  created(){
    //是否参加过活动
    this.joinState()
  },
  head() {
    return {
      title: 'P5评测有礼活动'
    }
  },
  methods:{
    countdown(){
      var _this = this,timer = this.timer;
      setInterval(function(){
        if(timer<=0) return
        timer--;
        _this.timer = timer
      },1000)
    },
    joinState(){
      this.$http.get('/activity/comments/getJoinState', {
        activityName:'P5',
        noRest:true
      }, res => {

      })
    }
  }
}
</script>
