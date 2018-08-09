<template>
  <div class="productDetail">
    <div id="productDetailModel">
      <header>
        <section class="row">
          <div class="col col1 hd-back" @click="back">
            <i class="icon iky-arrow-left font32"></i>
          </div>

           <!-- <h1 class="col col15 hd-title font32">{{data.title}}</h1> -->
          <!--<div class="col col20 hd-cart txrt" @click="openShareModal">-->
              <!--<i class="icon iconfont-tcl icon-fenxiang font36"></i>-->
              <!--<span></span>-->
          <!--</div>-->

        <!--   <div class="col col3">
            <div class="hd-share" @click="showCate">
              <i class="icon iconfont-tcl icon-fenxiang font36"></i>
              <span></span>
            </div>
        </div> -->

          <div class="col col3 txrt fr">
              <div class="hd-cates" @click="openShowMore">
                <i class="icon iconfont-tcl icon-gengduo font36"></i>
                <span></span>
              </div>
          </div>

          <div v-show="showMore" class="more-wrap">
            <i class="san"></i>
          <ul>
            <li><a href="/"><i class="icon iconfont-tcl icon-shouye"></i>首页</a></li>
            <li><a href="/search"><i class="icon iconfont-tcl icon-sousuo"></i>搜索</a></li>
            <li @click="collect" :class="{'red': data.collect}"><i :class="'icon iconfont-tcl'+(data.collect?' icon-yishoucangpx':' icon-weishoucangpx')" ></i>{{data.collect?'已':''}}收藏
            </li>
          </ul>
        </div>

        </section>
      </header>
      <section class="swiper">
        <yd-slider autoplay="3000" class="hb">
          <yd-slider-item v-for="(n,index) in swiperSlides" :key="index">
            <a href="javascript:;">
              <img :src="n" @click="open(index)">
            </a>
          </yd-slider-item>
        </yd-slider>
        <!-- <imgShow :list="swiperSlides"></imgShow> -->
      </section>
      <section class="description">
        <div class="des-content">
          <!-- 价格 -->
          <div class="col col17 priceCon" @click="showPrice">
              <p><em>员工价</em><span class="sale-price font36 red f-bold " v-html="data.staffPrice"></span>
                  <!-- <span class="base-price font24 gray lineThrough" v-html="data.basePrice"></span> -->
                  <span class="base-price font24 gray lineThrough" v-html="data.basePrice"></span></p>
              <p><em>亲友价</em><span class="frined-price" v-html="data.friendPrice"></span></p>
              <i class="font24 icon iky-arrow-right"></i>
          </div>
            <yd-popup v-model="priceDesc" position="bottom" height="overflow:hidden;z-index:2000;" class="priceDesc">
                <div class="modal">
                    <div class="title">
                        <h4>价格说明</h4>
                        <span class="close" @click="priceDesc=false">x</span>
                    </div>
                    <div class="content">
                        <h5>员工价</h5>
                        <p>对内部员工的一项特殊优惠福利，同样的产品可以以最低的价格购买，但有购买数量限制。</p>
                        <h5>亲友价</h5>
                        <p>对内部员工亲友的特殊优惠福利，同样的产品可以以低于市场价的价格购买，但价格高于员工价，没有购买数量限制。</p>
                    </div>
                </div>
            </yd-popup>
          <!-- 商品名称 + 收藏 -->
          <div class="font28 c33 pro-name row">
            <div class="col col20 name">{{data.title}}</div>
            <div class="col col4">
              <div class="share-icon" :class="{'red': data.collect}" @click="collect">
                 <i :class="'icon iconfont-tcl font44 '+(data.collect?'icon-yishoucangpx':'icon-weishoucangpx')"></i>
                 <p class="font18">{{data.collect?'已':''}}收藏</p>
              </div>
            </div>
          </div>

          <!-- 商品简介 -->
          <p class="des-info font24" v-html="data.decInfo"></p>
          <div class="good-price row" v-if="!data.promotionUuid">
           <!--  <div class="col jf">
             <span class="blue font26">赠送{{data.jf}}积分</span>
           </div> -->

          </div>

          <!-- 秒杀活动 -->
          <div class="good-price sekillPrice row" v-else>
            <div class="col col24">
              <span class="sale-price font36 red" v-html="seckillData.salePrice"></span>
              <span class="base-price font28 gray lineThrough" v-html="seckillData.basePrice"></span>
              <span class="font22 gray size"> 仅剩{{seckillData.size}}件</span>
            </div>
            <div class="col col24">
              <p class="seckillTime font24 ">
                秒杀时间: {{seckillData.time}}
              </p>
            </div>
            <div class="col col24">
              <p class="reduceTime font24 ">
                剩余时间: {{seckillData.reduceTime}}
              </p>
              <span class="blue font26">赠送{{data.jf}}积分</span>
            </div>
          </div>


          <div>
            <span>{{data.activeStatusTitle}}</span>
            <yd-countdown :time="activeStatus.time" :m="activeStatus.time" :callback="countdown" timetype="second"></yd-countdown>
            <p v-show="data.activeStatusTitle">发货时间：付款后
              <span class="red">7</span>天内</p>
          </div>
          <div class="presales" v-show="data.preSale.firstCost-0 >0">
            <p>定金：
              <span>￥{{data.preSale.firstCost}}元</span>
            </p>
            <p>预付首款优惠金额：
              <span>￥{{data.preSale.promotionCost}}元</span>
            </p>
            <p>付定金剩余：
              <span>{{data.preSale.endTime}}</span>
            </p>
            <p>尾款截止时间：
              <span>{{data.preSale.endPayEndTime}}</span>
            </p>
            <p>发货时间：
              <span>付尾款后{{data.preSale.sendGoodsTime}}天内</span>
            </p>
          </div>
         <!--  <div class="express font24">
           快递 {{data.express}}
         </div> -->
        </div>
      </section>

      <!-- 优惠券 -->
      <!--  <section class="couponDetail" v-show="!data.promotionUuid">
         <div class="row row-fff">
           <div class="col col4 font24">
             <strong>优惠券</strong>
           </div>
           <div class="col col20" @click="openCouponModal">
             <div class="col col23">
                <button class="btnred btn120">领取优惠券</button>
             </div>
             <div class="col couponIcon col1">
               <i class="font24 icon iky-arrow-right"></i>
             </div>
           </div>
         </div>
       </section> -->

      <!-- 促銷 -->
      <!--<section class="promotion pro-promotion">-->
        <!--<div class="row row-fff">-->
          <!--<div class="col col4 font24 c99">-->
            <!--<strong>促销</strong>-->
          <!--</div>-->

           <!--<div class="col col20" @click="openCouponModal">-->

              <!--<div class="col col23 red font24">-->
                <!--<span class="full-cut">满减</span>-->
                <!--<span>TV满减优惠  满1000减100  满...</span>-->
             <!--</div>-->
             <!--<div class="col couponIcon col1">-->
              <!--<i class="font24 icon iky-arrow-right"></i>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</section>-->

      <!-- <section class="promotion" v-show="!data.promotionUuid" >
        <div class="row" v-show="(promotion.name || promotion.list.length >0 || promotion.giftList.length>0)">
          <div class="col col4 font24">
            <strong>促销</strong>
          </div>
          <div class="col col19">
            <div class="promotion-content">
              <p v-show="promotion.name">
                <button class="btnred btn60">{{promotion.type}}</button>
                <span class="font24"> {{promotion.name}}</span>
              </p>
              <p :class="{second: promotion.name && index >0}" v-for="(item, index) in promotion.list" :key="index">
                <button class="btnred btn60">{{item.type}}</button>
                <span class="font24"> {{item.name}}</span>
              </p>
              <p :class="{second: promotion.name && promotion.list.length>0 }" v-for="(item, index) in promotion.giftList" :key="index">
                <button class="btnred btn60" v-show="item.productName">赠品</button>
                <span class="font24"> {{item.productName}}</span>
              </p>
            </div>
          </div>
          <div class="col col1 promotionIcon" v-show="(promotion.list.length > 0 || promotion.giftList.length> 0)" @click="showMorePromotions((promotion.name && promotion.list.length>0) || (promotion.name && promotion.giftList.length>0))">
            <span>
              <i class="font24 icon " ref="promotionIcon" :class="{'iky-arrow-right': (promotion.name && promotion.list.length> 0) || (promotion.name && promotion.giftList.length>0)}"></i>
            </span>
          </div>
        </div>
      </section> -->



     <!--已选-->
      <section class="selectSize">
        <div class="row">
          <div class="col col4 font24">
            <strong>{{colorSizeData.displayName ? colorSizeData.displayName :'尺寸' }}</strong>
          </div>
          <div class="col col20" @click="openColorSizeModal">
            <div class="col col23 font24 c33">{{colorSizeData.default}}</div>
            <div class="col couponIcon col1">
              <i class="font24 icon iky-arrow-right"></i>
            </div>
          </div>
        </div>
      </section>


      <!--运费-->
      <section class="transFare">
        <div class="row">
          <div class="col col4 font24">
            <strong>运费</strong>
          </div>
          <div class="col col20">
            <div class="col col23 font24 c33">免费包邮</div>
             <div class="col couponIcon col1">
              <i class="font24 icon iky-arrow-right"></i>
            </div>
          </div>
          <!--<div class="col col20" @click="openPostageModal">-->
            <!--<div class="col col23 font24 c33">-->
              <!--{{ postage.postageList[postage.nowPostage].postage}}-->
              <!--<span class="red">{{postage.postageList[postage.nowPostage].money}}</span>-->
             <!--</div>-->
            <!-- <div class="col couponIcon col1">
              <i class="font24 icon iky-arrow-right"></i>
            </div> -->
          <!--</div>-->
        </div>
      </section>
        <!--
         <section class="server-info">
             <ul class="row">
                <li class="col s-in ">
                  <i class="icon font24 iky-xuanze"></i>包邮(部分地区除外)</li>
                <li class="col s-in c2">
                  <i class="icon font24 iky-xuanze"></i>7天退换货</li>
                <li class="col s-in c3">
                  <i class="icon font24 iky-xuanze"></i>积分抵扣</li>
                <li class="col s-in ">
                  <i class="icon font24 iky-xuanze"></i>全国联保</li>
            </ul>
          </section>
          -->


      <!--说明-->
      <section class="serverInfo">
        <div class="row row-fff">
          <div class="col col4 font24">
            <strong>说明</strong>
          </div>
          <div class="col col20" @click="openExplainModal">
            <div class="col col23 font24 c99">
              <div class="col col20 font20 c99">
                <span v-for="(item,index) in explain" :key="index">{{ item.title }} | </span>
              </div>
            </div>
            <div class="col col1 couponIcon server">
              <i class="font24 icon iky-arrow-right"></i>
            </div>
          </div>
        </div>
     </section>



      <!-- 送至 -->
     <!--  <section class="selectAddress ">
       <div class="row">
         <div class="col col4 font24">
           <strong>送至</strong>
         </div>
         <div class="col col16 font24 c33" :d="addressParams.localaddress">
           <span slot="right" type="text" ref="menuItem" @click.stop="modeCity = true" readonly class="cell-input">{{modeCityValue}}</span>
           <cityselect v-model="modeCity" :done="resultCity" provance="" city="" area=""></cityselect>
         </div>
         <div class="col col3 font24  txrt" :class="{red: data.canBuy, gray:!data.canBuy}">{{data.canBuy ? '有货' : '无货'}}</div>
         <div class="col col1 couponIcon">
           <i class="font24 icon iky-arrow-right"></i>
         </div>
       </div>
     </section> -->

      <!-- 评价 -->
      <section class="commentTitle">
        <div class="row">
          <div class="col col13 font24">评价({{comments.size}})</div>
          <div class="col col10 font24 red txrt pr4" v-if="comments&&comments.size>0">
            <a rel='nofollow' :href="`/${_category}/comments/${queryParam.uuid}?buyNum=${cart.size}&attrId=${data.skuNo}&recommender=${queryParam.tkcid}&canBuy=${data.canBuy}&type=${(data.preSale.state||data.promotionUuid)}`">好评度{{(comments.averagescore/5).toFixed(2)*100}}%</a>
          </div>
          <div class="col col10 font24 red txrt pr4" v-else>
            暂无评论数据!
          </div>
          <div class="col col1 couponIcon" v-show="comments.size>0">
            <i class="font24 icon iky-arrow-right"></i>
          </div>
        </div>
      </section>

      <section class="comment comment1">
        <div class="row" v-show="comments.size">
          <div class="comms">
            <div class="header row">
              <ul class="col col16">
                <li>
                  <img class="tx" :src="(comments.good.customerImageUrl ? comments.good.customerImageUrl : 'http://m.tcl.com/res/img/default.png')" />
                </li>
                <li>
                 <p class="font28 customerName">{{comments.good.firstShopComment.customerName||'TCL用户'}}
                    <span class="v">{{comments.good.firstShopComment.version}}</span>
                  </p>
                </li>
                <li>
                  <p class="star">
                    <span class="yd-rate" style="font-size: .65rem; color: rgb(204, 204, 204);">
                      <a href="javascript:;" :class="{'rate-active': item<=comments.good.star}" style=" padding-right: 0.06rem;" v-for="(item,n) in 5" :key="n"></a>
                    </span>
                  </p>
                </li>
              </ul>
              <!-- <div class="col col8 font24 gray time">{{comments.good.firstShopComment.appTime}}</div> -->
            </div>


            <!--  评论文字 -->
            <div class="commsCbox">
              <p class="font24 comcc">{{comments.good.firstShopComment.comments | formatxss}}</p>
              <div>
                <p class="gray font24 addTime" v-show="comments.good.afterShopComment.day">用户{{comments.good.afterShopComment.day}}追评</p>
                <p class="font26 superaddition">{{comments.good.afterShopComment.comments | formatxss}}</p>
                <p class="imgcont">
                </p>
              </div>
            </div>
            <!--  评论图片 -->
            <div class="commsPics">
              <!--<yd-lightbox-img v-for="item in list" :src="item.src"></yd-lightbox-img>-->

              <img v-for="(o,index) in comments.good.firstShowImgs" :key="o.id" :src="o.imgUrl ? o.imgUrl : ''" />
            </div>


             <div class="col col24 font24 gray commet-time txrt" >
               {{comments.good.firstShopComment.appTime}}
             </div>
          </div>
        </div>
      </section>

      <!--<p id="look" class="look">继续下滑，查看图文详情</p>-->
      <!-- 产品详情-规格参数-服务政策-常见问题  -->
      <section class="presentation">
        <tabSlide :tabtitles="tabs" :current-page="1" :description="description" :description2="description2" :description3="description3" :description4="description4">
        </tabSlide>
      </section>

      <section class="seoinfo hidden">
        <p v-for="(x,i) in proInfoText" :key="i">{{x.attributeName}}:{{x.attributeValue}}</p>
      </section>
    </div>
    <!--<yd-popup v-model="modal" class="modal" position="bottom" height="auto" v-show="refresh">-->
      <!--<span @click.stop="modalClose" class="iky-close yd-close"></span>-->
      <!--<div class="ul-wrap">-->
        <!--<ul class="couponul" v-if="couponList&&couponList.length>0">-->
          <!--<li class="row" v-for="(item,index) in couponList" :key="index">-->
            <!--<div class="col c1 col7">-->
              <!--<i class="font36">¥</i>-->
              <!--<small class="font58">{{item.denomination}}</small>-->
              <!--<span class="font24">-->
                <!--满{{item.couCondition}}可用-->
              <!--</span>-->
            <!--</div>-->
            <!--<div class="col c2 col12">-->
              <!--<p class="gray">备注:{{couponListUseType[item.raleType]}}</p>-->
              <!--<p class="ccc time font22">-->
                <!--{{item.startTime.split(" ")[0]+'至'+item.endTime.split(" ")[0]}}-->
              <!--</p>-->
            <!--</div>-->
            <!--<div class="col c3 col5">-->
              <!--<button style="background:#ef4f4f; color:#fff; padding:.1rem .3rem" @click="downLoadCoupon(item)" class="font24">领取</button>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<div v-else>-->
          <!--<div class="empty">-->
            <!--<img src="/img/emptyCart.png">-->
            <!--<p>优惠券列表是空的哦～</p>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</yd-popup>-->







    <!-- 分享弹窗 -->
    <yd-popup v-model="shareModal" class="shareModal" position="bottom" height="auto" width="16rem">
       <section>

           <div class="share-title c33">分享
              <span class="iky-close share-close" @click.stop="shareModalClose"></span>
           </div>
           <div class="share-way social-share"
               data-initialized="true"
               :data-url="shareUrl"
               :data-title="shareTitle"
               :data-image="shareImg"
               :data-description="shareDesc"
           >
            <div class="row">
               <div class="col col8">

                 <img class="icon-img" src="/img/wechat-firend.png">
                 <p>微信好友</p>

               </div>
               <div class="col col8" >
               <img class="icon-img" src="/img/friend-circle.png">
               <p>微信朋友圈</p>
               </div>
               <div class="col col8" >
                <a :href="shareQQConfig" target="_blank">
                 <img class="icon-img" src="/img/QQ-firend.png">
                 <p>QQ好友</p>
                </a>
               </div>

            </div>
            <div class="row">
               <div class="col col8">
                 <a :href="shareQQZoneConfig" target="_blank">
                   <img class="icon-img" src="/img/QQ-zone.png">
                   <p>QQ空间</p>
                 </a>
               </div>
               <div class="col col8">
                 <a href="#" class="social-share icon-weibo" >
                   <img class="icon-img" src="/img/sina-web.png">
                   <p>新浪微博</p>
                 </a>
               </div>
              <!--  <div class="col col6">
                <img class="icon-img" src="/img/copy-link.png">
                <p>复制链接</p>
              </div>
              <div class="col col6">
                <img class="icon-img" src="/img/code.png">
                <p>二维码</p>
              </div> -->
               <div class="col col8">
                 <img class="icon-img" src="/img/msg.png">
                 <p>短信</p>
               </div>
            </div>


           </div>

       </section>
    </yd-popup>



     <!-- 说明弹窗 -->
    <yd-popup v-model="explainModal" class="explainModal" position="bottom" height="auto" width="16rem">
         <section>
            <div class="explain-title c33">说明
              <span class="iky-close explain-close" @click.stop="explainModalClose"></span>
            </div>
            <ul class="explain-list">
              <li v-for="item in explain">
                <div>
                  <img src="/img/explain-icon.png">
                  <span class="font26 c33">{{item.title}}</span>
                </div>
                <p class="gray font20">{{item.detail}}</p>
              </li>
            </ul>
         </section>
    </yd-popup>









    <!-- 已选弹窗 -->
    <yd-popup v-model="colorSizeModal" class="colorSizeModal" position="bottom" height="auto" width="16rem">
      <!-- 头部 -->
      <section class="row head">
        <div class="col col6">
          <a href="javascript:;">
            <img :src="swiperSlides[0]">
          </a>
        </div>
        <div class="col col16 font24 price-wrap">
          <!-- <div class=" hd-title font24">{{data.title}}</div> -->
          <div class="staff-price">
            <span class="pr4">员工价</span>
            <span class="red pr4" v-html="data.staffPrice"></span>
            <span class="gray lineThrough" v-html="data.basePrice"></span>
          </div>

          <div class="rela-price">
            <span class="pr4">亲友价</span>
            <span class="pr4" v-html="data.friendPrice"></span>
          </div>

          <div class="stock c99">库存{{data.stock}}件</div>

        </div>

        <div class="col col2 txrt">
           <span  @click.stop="modalSizeClose" class="iky-close font32 c99" style="display:inline-block;margin-top: 1rem;"></span>
        </div>

      </section>

      <div class="scroll-box">
        <div class="productInfoChose">
          <section class="colorSizeChose" v-show="colorSizeData.displayName">
            <div class="displayName font28">
              {{colorSizeData.displayName}}:
            </div>
            <div class="resultlist cell">
              <a :href="`/${type}/${item.uuid}`" v-for="(item,index) in colorSizeData.resultlist" :key="index">
                <button class="btn120 font22 btnred" v-if="item.uuid == queryParam.uuid">{{item.displayName}}</button>
                <button class="btn120 font22" v-else>{{item.displayName}}</button>
              </a>
            </div>
          </section>
          <section class="colorSizeChose" v-show="suitList.length>0">
            <div class="displayName cell font28">
              套餐:
            </div>
            <div class="resultlist cell">
              <a @click="choseSuit(item.key, item.value)" v-for="(item,index) in suitDic" :key="index">
                <button class="btn120 font22 btnred" v-if="item.default">{{item.key}}</button>
                <button class="btn120 font22" v-else>{{item.key}}</button>
              </a>
            </div>
          </section>
          <section class="colorSizeChose carSiseChose" v-if="!data.promotionUuid">
            <div class="displayName cell font28">
              数量:
            </div>
            <div class="resultlist cell">
              <button class="cartSpinner">
                <span class="yd-spinner">
                  <a href="javascript:;" class="reduce" v-bind:class="{ notAllowedLeft: cart.left }" @click="reduce"></a>
                  <input readonly max="999" type="text" :value="cart.size" placeholder="" class="spinner-input">
                  <a class="add" v-bind:class="{ notAllowedRight: cart.right }" href="javascript:;" @click="add"></a>
                </span>
              </button>
            </div>
          </section>
        </div>
        <section v-show="suitSingle._keyName" class="suitItemBody">
          <div class="suitItem">
            <div class="head row">
              <div class="col col7 font28">{{ suitSingle._keyName }}</div>
              <div class="col col17 font28">总价:
                <span class="sale-price font28 red" v-html="suitSingle.totalAmount"></span>
                <span class="base-price font28 gray lineThrough" v-html="suitSingle.costAmount"></span>
              </div>
            </div>
            <ul class="table-item" v-for="(ele, i) in suitSingle.suitProductRellist" v-if="ele.productUuid !=queryParam.uuid " :key="i">
              <li>
                <i class="iky-plus font24"></i>
              </li>
              <li class="img">
                <img :src="(ele.productSkuListModel ? ele.productSkuListModel.smallImg : '')" alt="">
              </li>
              <li class="price">
                <p class="font26">{{(ele.productSkuListModel ? ele.productSkuListModel.productName : '')}}</p>
                <p class="font28  red" v-html="(ele.productSkuListModel ? ele.productSkuListModel.price : '')"></p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </yd-popup>

    <!-- 分类菜单 -->
    <!--<yd-popup v-model="v_category" position="bottom" class="v_category">-->
      <!--<div class="title">分类-->
        <!--<span class="iky-close" @click="v_category=false"></span>-->
      <!--</div>-->
      <!--<div class="yd-grids-3">-->
        <!--<a class="yd-grids-item" v-for="(item,index) in category" :href="item.path" @click.native="v_category=false" :key="index">-->
          <!--<div class="yd-grids-icon"><span :class="item.icon"></span></div>-->
          <!--<h2 class="yd-grids-txt">{{item.title}}</h2>-->
        <!--</a>-->
      <!--</div>-->

      <!--<div class="line"></div>-->
      <!--<div class="yd-grids-3">-->
        <!--<a :href="item.path" class="yd-grids-item" v-for="(item,index) in other" :key="index" rel='nofollow'>-->
          <!--<div class="yd-grids-icon"><span :class="item.icon"></span></div>-->
          <!--<h2 class="yd-grids-txt">{{item.title}}</h2>-->
        <!--</a>-->
      <!--</div>-->
    <!--</yd-popup>-->

    <!-- 是否已下架 -->
    <!-- <div class="goods-off font24">非常抱歉，该商品已下架！</div> -->

    <!-- 导航栏 -->
    <footer>
      <div class="row footer_bar">
        <div class="col col4 ">
         <div class="share-icon" @click="sharefunc">
           <i class="icon iconfont-tcl icon-kefu11 font44"></i>
           <span class="font18">客服</span>
         </div>
       </div>
        <div class="col col4 line" @click="$router.push({'path':'/cart'})">
          <div class="share-icon">
            <i class="icon iconfont-tcl icon-gouwuche2 font44"></i>
            <span class="font18">购物车</span>
          </div>
        </div>
       <!--  <div class="col col4 line">
       <div class="share-icon" :class="{'red': data.collect}" @click="collect">
         <i class="icon iky-collection font44"></i>
         <span class="font18">收藏</span>
       </div>
             </div> -->
       <!--   <div class="col col3">
            <div class="share-icon">
             <i class="icon iconfont-tcl icon-kefu font44"></i>
             <span class="font20">客服</span>
           </div>
        </div> -->
      <!--    <div class="col col4">
          <div class="share-icon" @click="intoCart">
           <i class="icon iconfont-tcl icon-gouwuche font44"></i>
           <span class="font20">购物车</span>
         </div>
      </div> -->

        <div class="col col8 addToCart font32" :class="{gray: data.isGray}" v-show="data.isShowCartButton" @click="addCart">加入购物车</div>
        <div class="col font32 buy" :class="{gray: data.isGray, col8:!data.isShowCartButton, col8:data.isShowCartButton}" @click="submit">{{data.submitName}}</div>
      </div>
    </footer>


   <!--  <div style="height:2.7rem;">
      </div> -->
    <db11></db11>
    <imgBig :list="swiperSlides" ref="imgShow"></imgBig>
  </div>
</template>
<script>
import db11 from '~/components/db11';
import { CitySelect } from '~/components/cityselect';
import { ImgBig } from '~/components/imgBig';
import { tabSlide } from '~/components/tabSlide';
import http from '~/plugins/http';
import utils from '~/plugins/utils';



var globalMap = new Map();
var isload = typeof window === 'undefined'
const intPub = function(num) {
  if (Number.isInteger(num)) {
    return num + '<small class=sm>.00</small>';
  } else {
    num = (num - 0).toFixed(2);
    var index = String(num).indexOf('.');
    var p1 = String(num).substring(0, index);
    var p2 = String(num).substring(index);
    return p1 + `<small class=sm>${p2}</small>`
  }
}

function getParams(goodsName) {
  var types = [{
    name: '洗衣机',
    params: {
      wuliu: "c6055e457f7b484cbf49abe087c6f8da",
      qianshou: "d07ace1eff21407aaf7e26855bb190a5",
      anzhuang: "d911c31011544233ac11da69f577e767",
      fapiao: "1caeb4e0a6514ce5a6b490e895a82ffc",
      shouhou: "ee6b1942dedf4f58bba9351705a893ed",
      zhifu: "3565e84ad66e4e6aad96c7fc1d8e7651",
      contentId: 'f81f3607e4f3456090ba8bcca85951d8'
    }
  }, {
    name: ',健康电器,小家电,扫地机器人,空气净化器,净水机,除湿机,厨房电器',
    params: {
      wuliu: "7df0a31cfee643cdae0122533bd9dfa5",
      qianshou: "868f19d29dfb4d7fba5b29f12dc94a90",
      anzhuang: "4e1302f534e74c58b23fc1deb3836959",
      fapiao: "4805dae2dd5741cbb39b9a570695df03",
      shouhou: "b1ce1f4e4dfe4410aab0223dd3fdc9f2",
      contentId: '2e7bd73263294306aa854567ab788db3'
    }
  }, {
    name: ',3800,5800,6800,7800,8800,9700,9500,电视周边,大家电,电视,',
    params: {
      wuliu: "67c2a427179a4ae5b5b9d775f5ef1e87",
      qianshou: "f9b7a60bbb3f4d4393b080ed23077b7e",
      anzhuang: "7029eb4ecb6e4fa9bbc74c1dbf9b51ab",
      fapiao: "ecb70381b5104769a8bf9e2840f161e2",
      shouhou: "ebc2914cf7834e708d957d56686d3b56",
      contentId: 'fa94bfe2696c4fffa06c3c51587fbf14'
    }
  }, {
    name: '手机,智能穿戴,平板电脑,么么哒手机,TCL手机,手机周边,自拍杆,耳机,充电宝,',
    params: {
      wuliu: "73092ec2f8d547cea24beccbab328e5f",
      qianshou: "b12eb7a493a549c89d561d5dd9e6717f",
      xiazai: "0ae01a49a8c848599b90de3a8f546328",
      fapiao: "b4cb311cc2ea459099e4fe293abce84b",
      shouhou: "a5382bbf78244f44b5b8dc6bbe73d47f",
      contentId: '65e88cd1af33419d81c97ff2262139c4'
    }
  }, {
    name: ',空调,定频,变频,',
    params: {
      wuliu: "39fa90a897314c578b6c936bce45bcda",
      qianshou: "7ffc8648bdbd4e43ad25c0e5f2676cbc",
      anzhuang: "73319ec6d8a84aaab2dd3e95c9b0a70e",
      fapiao: "d5aa8863992b4eebb36799760922ce3b",
      shouhou: "9b25d3ec43ab4a64aaebcc92aea54d72",
      contentId: '81cc9db61f764c9a9060f7c92a1dbd19'
    }
  }, {
    name: '冰箱',
    params: {
      wuliu: "fb449767614943bc8958bf8a15900901",
      qianshou: "567f4b296244499da5d429b270fd857e",
      anzhuang: "21bee1417cf74e7483aacc9437629354",
      fapiao: "c13466f785034eb4a0cee26820b69a28",
      shouhou: "7931d94c47474935b64d2eb99921942e",
      zhifu: "b6aac52200604bac83552a31c2f98937",
      contentId: 'b7f47f7938bc4e3a8bdc35d1db66cbdb'
    }
  }];
  let params = types.filter((value) => {
    return value.name.indexOf(goodsName) > -1
  });
  return params[0] && params[0].params || null
};
const api = {
  getProduct: '/front/product/toProductKuyu',  //获取商品详情
  getCouponList: '/front/product/getProductDetailExtraInfo/getCouponList', //优惠券列表
  hasProduct: '/front/product/hasProduct',// 检查库存
  seckill: '/front/product/toLimitProductKuyu', //秒杀
  getColorSize: '/front/product/babyset', //获取颜色尺寸
  getSuit: '/front/product/getSuitMainByRegion',  //获取套餐
  buy: '/front/product/addProductToCart', //  普通下单
  hasLimitProduct: '/front/product/hasLimitProduct',  //秒杀库存
  checkLimitBuy: '/cart/checkLimitBuy',         //检测是否可以秒杀
  suitOder: '/front/product/addSuitProductToCartKuyu', //套餐下单
  getStorePromotion: '/front/product/getStorePromotion', // 促销
  getComments: '/front/product/showProductComments', // 评论
  getComClassify: '/front/product/getProductCommentCounts', //评论分类
  getServicePolicies: '/front/product/getServicePolicies', //服务
  getCommonProblems: '/front/product/getCommonProblems',  //常见问题
  downLoadCoupon: '/cart/downLoadCoupon',        //领取优惠券
  yuyue: '/front/product/addProductToOrder',              //预约
  presale: '/front/product/presaleProductToOrder',     //预定
  cancelFavorite: '/front/product/cancelFavorite', //取消收藏
  collectProduct: '/front/product/collectProduct', //收藏
  checkFavourState: '/front/product/getProductFavourState', //检查收藏状态
  ad: '/front/product/getAdByProductCategoryUuid',
  getProInfo: '/productAttr/getAttributes', //取商品文字信息
  getCategory: 'servicecenter/getSecondParentCategory' //根据uuid 取类别
}
var _local = utils.getCookie('location');
var location = (_local && _local.indexOf('{"provinceId') > 0) ? JSON.parse(_local) : { provinceId: '05', cityId: 154, areaUuid: 15845, region: 1385, localaddress: "广东省 深圳市 南山区 西丽街道" }
let fixedTab = null
export default {
  name: 'productDetail',
  components: { 'db11':db11,'cityselect': CitySelect, 'imgBig': ImgBig,'tabSlide': tabSlide },
  data() {
    return {
      myshow:false,
        priceDesc:false,
        mystock:0,
      commlist:[],
      shareQQConfig:'',
      shareQQZoneConfig:'',
      scorePercent:0,
      shareUrl:'www.tcl.com',
      shareTitle:'分享标题(可选)',
      shareImg:'https://sfault-avatar.b0.upaiyun.com/178/679/1786791455-573bf02014d62_huge256',
      shareDesc:'默认分享理由',
      showMore:false,
      postage:{
        nowPostage:0,
        postageList:[
        {
          'postage':'快递 免邮',
          'money':null,
        },
        ]
      },
      explain:[
        {
          'title':'正品保障',
          'detail':'保障正品，保障品质。让您购物无忧！保障正品，保障品质。让您购物无忧！',
        },
        {
          'title':'支持7天无理由退货',
          'detail':'保障正品，保障品质。让您购物无忧！保障正品，保障品质。让您购物无忧！',
        },
        {
          'title':'上门安装',
          'detail':'保障正品，保障品质。让您购物无忧！保障正品，保障品质。让您购物无忧！',
        },
        {
          'title':'24小时发货',
          'detail':'保障正品，保障品质。让您购物无忧！保障正品，保障品质。让您购物无忧！',
        }
        ],
      stock: 9999, isGoodsReady: true, buySuiteMes: '',//套餐购买提示
      type: '', v_category: false, refresh: true,
      couponListUseType: { //1全部2关联商品3关联分类
        '1': '全场通用',
        '2': '仅可购买优惠券指定品类商品',
        '3': '仅可购买优惠券指定单品'
      },
      category: [
        { title: '电视', icon: 'tv', path: '/tv' },
        { title: '手机', icon: 'mobile', path: '/mobile' },
        { title: '冰箱', icon: 'fridge', path: '/refrigerator' },
        { title: '空调', icon: 'air-conditioner', path: '/air' },
        { title: '洗衣机', icon: 'washer', path: '/washer' },
        { title: '健康电器', icon: 'health', path: '/homeappliance' },
        { title: '其它', icon: 'health', path: '/test' },
      ],
      other: [
        { title: '关于TCL', icon: 'about', path: '/about' },
        { title: '铁粉社区', icon: 'bbs', path: 'http://fans.tcl.com/' },
        { title: '积分商城', icon: 'jf-shop', path: 'http://hy.tcl.com/' },
        { title: '经销商之家', icon: 'dealer', path: 'http://m.tcl.com/tcldealer/dealer/toLogin' },
        { title: '员工内购', icon: 'emp-buy', path: 'http://www.pengpengmall.com/' },
      ],
      title: '', proInfoText: [],
      swiperOption: { autoplay: 3500, setWrapperSize: true, autoplayDisableOnInteraction: false, pagination: '.swiper-pagination', paginationClickable: true, mousewheelControl: true, observeParents: true, },
      tabs: ['产品详情', '规格参数', '服务政策', '常见问题'],
      swiperSlides: [], couponList: [], suitList: [], suitSingle: {}, suitDic: [{ key: '标准', default: true, value: -1 }], orderType: { key: '标准', value: -1 }, colorSizeData: { default: '' },
      chKeys: { 1: '一', 2: '二', 3: '三', 4: '四', 5: '伍', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十' }, cart: { size: 1, left: false, right: false },
      modeCity: false,
      modeCityValue: location.localaddress,
      modal: false, shareModal: false, colorSizeModal: false, time: 5, timerrr: null,postageModal:false,explainModal:false,
      canBuyFlag:true,
      data: {
        title: '加载中...',
        decInfo: '', //商品描述
        salePrice: '', //显示的价格
        basePrice: '', //划线价格
        express: '0.0', //快递费
        jf: '',   // 积分
        region: '', areaUuid: '', skuNo: '', parentSkuNo: '', promotionUuid: false, storeUuid: '', submitName: '立即购买',
        canBuy: true,
        activeStatus: '',    //抢购状态
        activeStatusTitle: '', // 抢购状态名
        reserveOrderId: '',   //抢购ID
        isShowCartButton: true,  //显示购物车按钮
        isGray: false,  //显示灰色
        preSale: { firstCost: 0, promotionCost: '', endTime: '', endPayEndTime: '', sendGoodsTime: '', }, //预定
        collect: false, categoryUuid: '',
      },
      seckillData: { time: '', size: '', salePrice: '', basePrice: '', reduceTime: '', },
      addressParams: location,
      promotion: { data: { 1: "满减", 4: "满赠", 5: "打折", 6: "满折", 7: "买减", }, type: '活动', name: '', list: [], giftList: [], },
      comments: {
        size: 0, list: [],
        good: {
          firstShopComment: { customerName: '', version: '', appTime: '', comments: '', },
          afterShopComment: { day: '', comments: '', },
          afterShowImgs: [],
          firstShowImgs:[],
          customerImageUrl: 'http://m.tcl.com/res/img/default.png', star: 0,
        }, wm: {}, averagescore: ''
      },
      queryParam: { uuid: '', terminal: '02' },
      description: '', description2: '', description3: '', description4: '',
      activeStatus: {
        'status1': { name: '等待预约', st: '预约开始剩余时间：', },
        'status2': { name: '立即预约', st: '预约剩余时间：', },
        'status3': { name: '等待抢购', st: '抢购活动开始剩余时间：', },
        'status4': { name: '立即抢购', st: '抢购活动剩余时间：', },
        'status5': { name: '等待抢购', st: '抢购活动开始剩余时间：', },
        time: 0,
      },
      _category: ''
    }
  },
  created() {

    var uuid = this.$route.params.detail;
    var tkcid = this.$route.query.tkcid || '';

    this._category = this.$route.params.goods || 'other'
    this.queryParam.uuid = uuid;
    this.queryParam.tkcid = tkcid;
    // if (uuid) {
    // this.getData(uuid);
    //}
  },
  filters: {
    formatxss(dom) {
      if (isload) return;
      var d = document.createElement('div')
      dom = dom && dom != undefined ? dom.replace(/\s+/ig, '') : '';
      d.innerHTML = dom
      return d.innerText;
    }
  },
  destroyed() {
    window.removeEventListener('scroll', fixedTab, false);
  },
  mounted() {
    var query = this.$route.query;
    var tkcid = query.tkcid || '';
    if (tkcid) this.$utils.setCookie('tkcid', tkcid)
    fixedTab = this.fixedTab
    //const top = this.scrollView == window ? document.body.scrollTop : this.scrollView.scrollTop;
    window.addEventListener('scroll', fixedTab, false);
    var user = this.$utils.getCookie('user');
    if (user) {
      user = JSON.parse(user);
    } else {
      user = {};
    }
    window.NTKF_PARAM = {
      siteid: "kf_9428", //企业ID，为固定值，必填
      settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
      uid: user.customerUuid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
      uname: user.customerName, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
      isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
      userlevel: user.level, //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
      itemid: this.queryParam.uuid, //(必填)商品ID
      itemparam: "wap_Product" //(选填)itemparam为商品接口扩展字段,例如 pc/Product  pc/Promotion/促销id/促销商品skuno
    }

    if (typeof window !== 'undefined') {
      (this.stock == 0) && this.$dialog.alert({ mes: '此商品库存不足，暂时无法购买' });
      (!this.isGoodsReady) && this.$dialog.alert({ mes: '此商品正在准备中，敬请期待...', callback: () => { this.$router.push({ path: '/' }) } });
      if (this.buySuiteMes) {
        this.buySuiteMes == 1 ? this.$router.push({ path: '/cart' }) :
          (this.buySuiteMes == -1 ? this.$dialog.alert({ mes: '未登录无法直接购买套餐商品', callback: () => {
            var obj = this.$http.isUniFunc();
            !obj.isUni && (window.location.href = '/user/login.html?backurl=' + encodeURIComponent(window.location.href))
            obj.isUni && (window.location.href = obj.host + '/proxy/login?from=' + encodeURIComponent(window.location.href))
            } }) : this.$dialog.alert({ mes: this.buySuiteMes, callback: () => { this.$router.push({ path: '/' }) } }))
      }
    }
    return true
  },
  watch: {
    stock(v) {
      v <= 0 && (this.$dialog.alert({ mes: '此商品库存不足!' }))
    },
    /* modal: function() {
        if (!this.modal) {
            document.getElementsByTagName('body')[0].style.position = "relative"
        }
    },
    colorSizeModal: function() {
        if (!this.colorSizeModal) {
            document.getElementsByTagName('body')[0].style.position = "relative"
        }
    }, */
  },
  methods: {
      showPrice(){
        this.priceDesc = true
      },
    open(index){
      // for(let [index,item] of this.swiperSlides.entries()){
      //   if(item.id == id){
      //     this.$refs.imgShow.showCom(index);
      //   }
      // }
      this.$refs.imgShow.showCom(index);
    },
    chosePostage(index) {
      this.postage.nowPostage = index;
      this.postageModalClose();

    },
    fixedTab() {
      let p = document.getElementsByClassName('tab-container')[0]
      var obj = document.getElementsByClassName("tab-title-container")[0];
      obj.className = window.scrollY - p.offsetTop > 0 ? "tab-title-container fixed" : 'tab-title-container'
    },
    // showCate() {
    //   this.v_category = !this.v_category
    // },
    getCouponList(storeUuid) {  //优惠券列表
      let params = {
        storeUuid: storeUuid,
        productUuid: this.queryParam.uuid,
        regionId: this.data.region,
        terminalType: '02'
      };
      this.$http.get(api.getCouponList, params, res => {

        if (res.code == 0 && res.data.length > 0) {
          this.couponList = res.data;
        }
        // document.getElementsByTagName('body')[0].style.position = "relative"
        this.refresh = false
        this.refresh = true
      })

    },
    downLoadCoupon(item) { //领取优惠券
      let params = {
        couponTypeUuid: item.uuid,
        terminalType: '02'
      }
      // document.getElementsByTagName('body')[0].style.position = "relative"
      let callback = () => {
        this.$http.get(api.downLoadCoupon, params, res => {
          if (res.code == '0') {
            this.$dialog.alert({ mes: '领取成功！' });
          } else if (res.code == '-3') {
            this.$dialog.alert({ mes: '已超过限领数量！' });
          }
          else {
            this.$dialog.alert({ mes: '已经领过或者会员积分不够' });
          }
        })
      }
      if (item.convertIntegral && item.convertIntegral > 0) {
        this.$dialog.confirm({
          mes: '领取该优惠券，需抵扣积分值' + item.convertIntegral,
          opts: callback
        })
        return false
      }
      callback()
    },
    getColorSize() {  //颜色尺寸
      let params = {
        productUuid: this.queryParam.uuid,
        terminalType: '02',
      };
      this.$http.get(api.getColorSize, params, res => {
        res.displayName = res.displayName ? res.displayName.slice(2) : res.displayName;
        this.colorSizeData = res;
        if (!res.resultlist || res.resultlist.length < 1) {
          this.colorSizeData['default'] = '默认';
        } else {
          res.resultlist.forEach((item, index, arr) => {
            if (item.uuid == params.productUuid) {
              this.colorSizeData['default'] = item.displayName;
            }
          });
        }
        if (!this.orderType.type) {
          this.orderType = { key: '标准', value: -1 }
        }
      })
    },
    getSuit() {//套餐
      this.suitDic = [{ key: '标准', default: true, value: -1 }];
      this.getColorSize();
      this.orderType = { key: '标准', value: -1 };
      let params = {
        productUuid: this.queryParam.uuid,
        regionId: this.data.region ? this.data.region : this.addressParams.region,
        terminalType: '02'
      };
      let suitChild = {};
      this.$http.get(api.getSuit, params, res => {
        res.retData.forEach((item, index, arr) => {
          item.suitProductRellist.forEach((ele, index, arr) => {
            suitChild[ele.parentSkuNo] = ele.parentSkuNo;
            if (ele.productSkuListModel) {
              ele.productSkuListModel.price = '¥' + intPub(ele.productSkuListModel.price);
            }
            if (ele.isSuitMain == 1) {
              item.SuitMainID = ele.productUuid;
              item.SuitMainSkuNo = ele.parentSkuNo;
            }
          });

          if (arr.length > 10) {
            this.suitDic.push({ key: '套餐' + (index + 1),'suitChild': suitChild, default: false, index, type: 'suit', suitUuid: item.uuid, mainProductUuid: item.SuitMainID, mainSkuNo: item.SuitMainSkuNo });
            item._keyName = '套餐' + (index + 1);
          } else {
            this.suitDic.push({ key: '套餐' + this.chKeys[index + 1], 'suitChild': suitChild,default: false, value: index, type: 'suit', suitUuid: item.uuid, mainProductUuid: item.SuitMainID, mainSkuNo: item.SuitMainSkuNo });
            item._keyName = '套餐' + this.chKeys[index + 1];
          }
          function aabb(arr) {
            const temp = new Map();
            return arr.filter((a) => !temp.has(a.value) && temp.set(a.value, a))
          }
          this.suitDic = aabb(this.suitDic)
          if (item.costAmount > item.totalAmount) {
            item.totalAmount = '¥' + intPub(item.totalAmount);
            item.costAmount = '¥' + intPub(item.costAmount);
          } else {
            item.totalAmount = '¥' + intPub(item.totalAmount);
            item.costAmount = '';
          }

        })
        this.suitList = res.retData;
      })
    },
    choseSuit(key, value) {  //选择套餐
      this.suitDic.forEach((item, index, arr) => {
        item.default = false;
        if (item.key == key) {
          item.default = true;
          this.orderType = item;
        }
      })
      if (value >= 0) { //套餐
        this.suitSingle = this.suitList[value];
      } else {
        this.suitSingle = {};
      }

      if (this.suitList[value]) {
        this.colorSizeData['default'] = this.suitList[value]._keyName;
      } else {
        //this.colorSizeData['default'] = '默认';
        if (this.colorSizeData.resultlist.length < 1) {
          this.colorSizeData['default'] = '默认';
        } else {
          this.colorSizeData.resultlist.forEach((item, index, arr) => {
            if (item.uuid == this.queryParam.uuid) {
              this.colorSizeData['default'] = item.displayName;
            }
          });
        }
      };
      if (this.orderType.type == 'suit'){
        var suit = this.suitDic.filter(x=>x.default==true)[0]
        var suitKeys = Object.keys(suit.suitChild)
        for(var i=0;i<suitKeys.length;i++){
          this.hasSuitProduct(suitKeys[i]);
        }

        var _this = this;
        setTimeout(function(){
          if(!_this.canBuyFlag){
            _this.data.canBuy = false;
            _this.data.isGray = true;
          }else{
            _this.data.canBuy = true;
            _this.data.isGray = false;
          }
        },100)

      }else{
        this.hasProduct()
      }
    },
    openCouponModal() {
      if (this.data.storeUuid) {
        // document.getElementsByTagName('body')[0].style.position = "fixed"
        this.modal = true;
        this.getCouponList(this.data.storeUuid)
      }
    },
    openColorSizeModal() {
      this.colorSizeModal = true;
      // document.getElementsByTagName('body')[0].style.position = "fixed";
    },
    modalClose(e) {
      // document.getElementsByTagName('body')[0].style.position = "relative"
      this.modal = false;
    },
    modalSizeClose(e) {
      this.colorSizeModal = false;
      // document.getElementsByTagName('body')[0].style.position = "relative"
    },
    sharefunc(e) {
      NTKF.im_openInPageChat('kf_9428_1525949700591')

     /* this.shareModal = true;*/
    },
    shareModalClose() {
      this.shareModal = false;
    },

    openShowMore(){
      this.showMore =!this.showMore;
    },
    openShareModal(){
     this.shareModal = true;
    },
    postageModalClose() {
      this.postageModal = false;
    },
    openPostageModal(){
     this.postageModal = true;
    },
    explainModalClose() {
      this.explainModal = false;
    },
    openExplainModal(){
     this.explainModal = true;
    },
    hasSuitProduct(parentSkuNo) {    //查库存
      let params = {
        region: this.addressParams.region,
        areaUuid: this.addressParams.areaUuid,
        skuNo: this.data.skuNo,
        parentSkuNo: parentSkuNo,
        buyNum: this.cart.size,
        terminalType: '02',
        reservePromotionUuid: this.data.preSale ? this.data.preSale.uuid : '',
      };

      this.$http.get(api.hasProduct, params, res => {
        var data = res.retData;
        if (this.orderType.type == 'suit') {
          if (this.suitSingle && this.suitSingle.stock && this.cart.size <= this.suitSingle.stock && data.canBuy && data.hasProduct && data.totalNum>0) {
            // this.data.canBuy = true;
            // this.data.isGray = false;
          } else {
            this.cart.size = 1;
            this.data.canBuy = false;
            this.data.isGray = true;
            this.canBuyFlag = false;
            this.stock = this.suitSingle.stock;
          }
        }
      })
    },
    hasProduct(cb) {    //查库存
      let params = {
        region: this.addressParams.region,
        areaUuid: this.addressParams.areaUuid,
        skuNo: this.data.skuNo,
        parentSkuNo: this.data.parentSkuNo,
        buyNum: this.cart.size,
        terminalType: '02',
        reservePromotionUuid: this.data.preSale ? this.data.preSale.uuid : '',
      };

      this.$http.get(api.hasProduct, params, res => {

        var data = res.retData;
        if (data.canBuy && data.hasProduct && this.cart.size <= data.totalNum) {
          this.data.canBuy = true;
          this.data.isGray = false;

          if (this.data.activeStatus == 'status1' || this.data.activeStatus == 'status3') {
            this.data.isGray = true;
          }
        } else {
          // if (data.totalNum <= 0) {
            // this.cart.size = 1;
            // this.data.canBuy = false;
            // this.data.isGray = true;
             this.$dialog.alert({ mes: '库存不足，请减少库存尝试' })
          // } else {
             this.cart.size = data.totalNum
          // }
          this.stock = data.totalNum
            this.mystock = data.totalNum
        }
        if (this.orderType.type == 'suit') {
          if (this.suitSingle && this.suitSingle.stock && this.cart.size <= this.suitSingle.stock && data.canBuy && data.hasProduct && data.totalNum>0) {
            this.data.canBuy = true;
            this.data.isGray = false;
          } else {
           // if (this.suitSingle.stock <= 0) {
              // this.cart.size = 1;
              // this.data.canBuy = false;
              // this.data.isGray = true;
               this.$dialog.alert({ mes: '库存不足，请减少库存尝试' })
          //  } else {
             this.cart.size = this.suitSingle.stock;
        //    }
            this.stock = this.suitSingle.stock
          }
        }


        if (cb) cb();
      })
    },
    hadLimitProduct() { //秒杀查库存
      let params = {
        region: this.addressParams.region,
        areaUuid: this.addressParams.areaUuid,
        provinceId: this.addressParams.provinceId,
        cityId: this.addressParams.cityId,
        skuNo: this.data.skuNo,
        bType: '',
        buyNum: 1,
        promotionUuid: this.data.promotionUuid,
        terminalType: '02',
      };
      this.$http.get(api.hasLimitProduct, params, res => {
        var data = res.retData;
        if (data.canBuy && data.hasProduct) {
          this.data.canBuy = true;
          this.data.isGray = false;
        } else {
          this.data.canBuy = false;
          this.data.isGray = true;
        }
      })

    },
    resultCity(ret) { //地区返回值
      this.canBuyFlag = true;
      this.modeCityValue = ret.provance.name + ' ' + ret.city.name + ' ' + ret.area.name + ' ' + ret.region.name;
      var ids = ret.provance.id + ' ' + ret.city.id + ' ' + ret.area.id + ' ' + ret.region.id;

      this.addressParams.provinceId = ret.provance.id;
      this.addressParams.cityId = ret.city.id;
      this.addressParams.areaUuid = ret.area.id;
      this.addressParams.region = ret.region.id;
      this.addressParams.localaddress = this.modeCityValue;

      var loc = {
        provinceId: ret.provance.id,
        cityId: ret.city.id,
        areaUuid: ret.area.id,
        region: ret.region.id,
        localaddress: this.modeCityValue
      };

      if (this.data.promotionUuid) {
        this.hadLimitProduct();
      } else {
        this.hasProduct();
      }
      this.$utils.setCookie('location', JSON.stringify(loc));

      //预约抢购商品应该不能是套装
      // if (!this.data.activeStatus) {
      if (this.orderType.type == 'suit') {
        this.getSuit();
      }
    },
    add() { // 商品加
      if (!this.data.canBuy) {
        return;
      }
      this.cart.size = this.cart.size >= 999 ? 999 : this.cart.size + 1;
      if (this.cart.size >= 999) {
        this.cart.right = true
      } else {
        this.cart.left = false;
      }

      this.cart.size > 1 ? (this.cart.left = false) : (this.cart.left = true);
      this.hasProduct();         //查库存

    },
    reduce() { //商品减
      if (!this.data.canBuy) {
        return;
      }
      this.cart.size = this.cart.size <= 1 ? 1 : this.cart.size - 1;
      if (this.cart.size <= 1) {
        this.cart.left = true
      } else {
        this.cart.left = false;
      }
      this.cart.size < 999 ? (this.cart.right = false) : (this.cart.right = true);

      this.hasProduct();         //查库存
    },
    intoCart() { //去购物车页面
      this.$router.push({ path: '/cart' })
    },
    back() {
      this.$router.back();
    },
    addSuccess() {
      this.$dialog.toast({
        mes: '成功加入购物车',
        timeout: 1000,
        icon: 'success'
      });
    },
    addCart() { // 添加到购物车
      // this.$dialog.alert({mes: '消息一出，休想滚动屏幕[移动终端]！'});
      // return false;
      typeof (_smq) == 'object' && _smq.push(['custom', 'wap', 'add']);

      //壁合检测
//      typeof (beheActiveEvent) == 'function' && beheActiveEvent({at:"buy",src:"1697009386",cid:"",sid:"27295.25155",orderid:"",cost:""})

      if (this.data.canBuy) {
        if (this.orderType.type == 'suit') { //套餐购买
          this.suitBuy(1, () => {
            this.addSuccess();
            // self.cart.cartSize = self.cart.cartSize + self.cart.size;
          });
        } else { //普通购买
          this.usualBuy(1, () => {
            this.addSuccess();
            // self.cart.cartSize = self.cart.cartSize + self.cart.size;
          });
        }
      }
    },
    submit() {
      if (!this.data.canBuy) return;
      // document.getElementsByTagName('body')[0].style.position = "relative"
      typeof (_smq) == 'object' && _smq.push(['custom', 'wap', 'goumai_1']);
      if (this.orderType.type == 'suit') { //套餐购买
        this.suitBuy();
      } else if (this.orderType.type == 'status1') {  //等待预约
        return;
      } else if (this.orderType.type == 'status2') {  //预约
        this.yuyue();
      } else if (this.orderType.type == 'status4') {  //抢购
        if (!this.$utils.getCookie('wap_staff_token')) {
          // window.location.href = process.env.UC + '/proxy/login?from=' + encodeURIComponent(window.location.href)
          var obj = this.$http.isUniFunc();
          !obj.isUni && (window.location.href = '/user/login.html?from=' + encodeURIComponent(window.location.href))
          obj.isUni && (window.location.href = obj.host + '/proxy/login?from=' + encodeURIComponent(window.location.href))
          return false
        }
        if (!this.data.reserveOrderId) {
          this.$dialog.alert({ mes: '您未曾参与过预约活动，不能抢购！' });
        } else {
          this.yuyueOrder();
        }
      } else if (this.orderType.type == 'preSaleType1' || this.orderType.type == 'preSaleType2') {   //1 全款 2首款
        this.presale();
      } else if (this.orderType.type == 'seckill') {
        this.seckillOrder(this.orderType);
      } else if (!this.orderType.type) { //普通购买
        this.usualBuy();
      }
    },
    suitBuy(type, cb) { // 套装下单
      let params = {
        suitUuid: this.orderType.suitUuid,
        buyNum: this.cart.size,
        mainProductUuid: this.orderType.mainProductUuid,
        mainSkuNo: this.orderType.mainSkuNo,
        areaUuid: this.addressParams.areaUuid,
        distributorUuid: '',
        recommender: this.queryParam.tkcid ? this.queryParam.tkcid : '',
        terminalType: '02',
      }
      this.$http.post(api.suitOder, params, res => {
        if (res.code == 0) {
          if (type == 1) {
            if (cb) cb();
          } else {
            this.$router.push({ path: '/order/confirm' })
          }
        } else {
          this.$dialog.alert({ mes: '系统出错' || res.msg })
        }
      })
    },
    usualBuy(type, cb) { //普通下单
      let params = {
        productUuid: this.queryParam.uuid,
        buyNum: this.cart.size,
        attrId: this.data.skuNo,
        recommender: this.queryParam.tkcid ? this.queryParam.tkcid : '',
        terminalType: '02',
      };

      this.$http.get(api.buy, params, res => {
        if (res.code == 0) {
          if (type == 1) {
            if (cb) cb();
          } else {
            this.$router.push({ path: '/order/confirm' })
          }
        } else {
          this.$dialog.alert({ mes: '系统出错' || res.msg })
        }
      })
    },
    showMorePromotions(e) {
      if (!e) return;
      var seconds = document.getElementsByClassName("second");
      if (this.$refs.promotionIcon.className == 'font24 icon  iky-arrow-down') {
        this.$refs.promotionIcon.className = 'font24 icon  iky-arrow-right';
        for (let i = 0; i < seconds.length; i++) {
          seconds[i].style.display = "none";
        }
      } else {
        this.$refs.promotionIcon.className = 'font24 icon  iky-arrow-down';
        for (let i = 0; i < seconds.length; i++) {
          seconds[i].style.display = "block";
        }
      }

    },
    seckillOrder(arg) {
      let params = {
        promotionUuid: arg.value,
        skuNo: arg.skuNo,
        areaUuid: this.addressParams.areaUuid,
        region: this.addressParams.region,
        provinceId: this.addressParams.provinceId,
        cityId: this.addressParams.cityId,
      };
      this.$http.get(api.checkLimitBuy, params, res => {
        if (res.code == 'true') {
          var data = {
            skuNo: params.skuNo,
            promotionUuid: params.promotionUuid,
            areaId: params.areaUuid,
            from: 'seckill'
          };
          this.$utils.setCookie('seckilldata', JSON.stringify(data));
          this.$router.push({ path: '/order/confirm', query: params });
        } else if (res.code == 'only_one') {
          this.$dialog.alert({ mes: '同一个用户只能秒杀一次' });
        } else {
          this.$dialog.alert({ mes: res.msg || res.message });
        }
      });
    },
    countdown() {
      window.location.reload();
    },
    collect() { //收藏
      //collectProduct  //collectProduct
      let params = {
        productUuid: this.queryParam.uuid,
        terminalType: '02'
      };
      if (this.data.collect) {
        this.$http.get(api.cancelFavorite, params, res => {
          if (res == '1' || res == '3') {
            this.data.collect = false;
            this.$dialog.alert({ mes: '已取消收藏' })
          }
        })
      } else {
        this.$http.get(api.collectProduct, params, res => {
          if (res == '1') {
            this.data.collect = true;
            this.$dialog.alert({ mes: '收藏成功' })

          }
        })
      }
    },
    checkFavourState() {
      let params = {
        productUuid: this.queryParam.uuid,
        terminalType: '02'
      };
      this.$http.get(api.checkFavourState, params, res => {
        if (res.code == 0) {
          if (res.retData.favoriteState == '1') {
            this.data.collect = true;
          } else {
            this.data.collect = false;
          }
        }
      })
    },
    yuyue() { //预约
      let params = {
        productUuid: this.queryParam.uuid,
        buyNum: this.cart.size,
        skuNo: this.data.skuNo,
        terminalType: '02'
      };
      this.$http.get(api.yuyue, params, res => {
        if (res.code == '0') {
          var _data = res.retData;
          var reservationdata = {
            skuNo: params.skuNo,
            productId: params.productUuid,
            buyNum: params.buyNum,
            storeNote: _data.submodel.uuid,
            submodelUuid: _data.submodel.uuid,
            rushBuyBeginTime: _data.submodel.rushBuyBeginTime,
            gname: _data.productModel.productMain.productName
          };
          this.$utils.setCookie('reservationdata', JSON.stringify(reservationdata));

          this.$router.push({ path: '/order/reservation', query: reservationdata })

        } else {
          this.$dialog.alert({ mes: '预约失败' });
        };
      });
    },
    yuyueOrder() { //抢购
      let params = {
        productUuid: this.queryParam.uuid,
        reserveOrderId: this.data.reserveOrderId,
        skuNo: this.data.skuNo,
        terminalType: '02'
      };

      this.$http.get(api.yuyue, params, res => {
        if (res.code == '0') {
          this.$router.push({ path: '/order/oreservation', query: params })
        } else {
          this.$dialog.alert({ mes: res.msg || res.message });
        };
      });
    },
    presale() { //预定
      let params = {
        dealerBcustomerUuid: '',
        pIds: this.queryParam.uuid,
        buyNum: this.cart.size,
        attrIds: this.data.skuNo,
        chooseCod: '',
        willType: 2
      };

      this.$http.get(api.presale, params, res => {
        if (res.code == '0') {
          var data = res.retData;
          var presalesdata = {
            pIds: data.pIds,
            attrIds: data.attrIds,
            buyNum: data.buyNum,
            willType: data.willType
          };
          this.$utils.setCookie('presalesdata', JSON.stringify(presalesdata));
          this.$router.push({ path: '/order/confirm', query: params })
        } else {
          this.$dialog.alert({ mes: res.msg || res.message });
        };
      });
    },
    copyLink(event) {
      //       alert('浏览器不支持复制')
      //         function handler (event){
      //            event.clipboardData.setData('text/plain', window.location.href);
      //            event.preventDefault();
      //            document.removeEventListener('copy', handler, true);
      //            alert('复制成功')
      //        }
      //
      //        document.addEventListener('copy', handler, true);
      ////        input.focus()
      ////        input.select()
      ////        input.setSelectionRange(0, input.value.length)
      //        document.execCommand('copy')
    }
  },
  /* validate({ params, query }) { //路由校验
      console.log(params.detail, query)
      // return 1
      // Must be a number
      return ['tv', 'mobile', 'refrigerator', 'washer', 'air', 'homeappliance', 'other', '_nuxt'].indexOf(type) >=0
  }, */
  async asyncData(context) {

    http.context = context
    let token = http.token = utils.getReqCookie(context, 'wap_staff_token')
    let query = context.query
    let params = context.params
    let ouuid = query.uuid
    let uuid = ''
    let type = ''
    if (ouuid && ouuid.length === 32) {
      query = {}
      uuid = ouuid
      type = 'other'
    } else {
      uuid = params.detail
      type = params.goods
    }
    let buySuiteMes = ''

    let suiteParams = {
      suitUuid: query.suitUuid, buyNum: query.buyNum, mainProductUuid: uuid, mainSkuNo: query.mainSkuNo,
      areaUuid: query.areaUuid, distributorUuid: '',
      recommender: utils.getReqCookie(context, 'tkcid'), //推客
      terminalType: '02', activityUuid: query.activityUuid
    }
    // console.log('suiteParams', suiteParams)

    if (query.suitUuid) { //如URL 套餐ID存在直接下单
      if (token) {
        let data = await http.asyncPost(api.suitOder, suiteParams)
        // console.log('data', data)
        if (data.code == 0) {
          buySuiteMes = '1'
        } else {
          buySuiteMes = '套餐商品购买失败'
        }

      } else {
        buySuiteMes = -1
      }
      return { buySuiteMes }
    }



    // console.log(type,uuid.length)
    if (['tv', 'mobile', 'refrigerator', 'washer', 'air', 'homeappliance', 'other', '_nuxt'].indexOf(type) < 0) {
      context.redirect('/404')
    }
    let data = {
      title: '加载中...',
      decInfo: '', //商品描述
      salePrice: '', //显示的价格
      basePrice: '', //划线价格
      express: '0.0', //快递费
      jf: '',   // 积分
      region: '', areaUuid: '', skuNo: '', parentSkuNo: '', promotionUuid: false, storeUuid: '', submitName: '立即购买', canBuy: true,
      activeStatus: '',    //抢购状态
      activeStatusTitle: '', // 抢购状态名
      reserveOrderId: '',   //抢购ID
      isShowCartButton: true,  //显示购物车按钮
      isGray: false,  //显示灰色
      preSale: { firstCost: 0, promotionCost: '', endTime: '', endPayEndTime: '', sendGoodsTime: '', }, //预定
      collect: false, categoryUuid: '',
    }, proInfoText = [], stock = 9999, /*库存*/ isGoodsReady = true,
      swiperSlides = [], colorSizeData = { default: '' }, suitSingle = {}, queryParam = { uuid: uuid, terminal: '02' },
      orderType = { key: '标准', value: -1 }, seckillData = { time: '', size: '', salePrice: '', basePrice: '', reduceTime: '', },
      description = '', description2 = '', description3 = '', description4 = '',
      suitDic = [{ key: '标准', default: true, value: -1 }], suitList = [],
      cart = { size: 1, left: false, right: false },
      chKeys = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '伍', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十' },
      promotion = { data: { 1: "满减", 4: "满赠", 5: "打折", 6: "满折", 7: "买减", }, type: '活动', name: '', list: [], giftList: [], },
      activeStatus = {
        'status1': { name: '等待预约', st: '预约开始剩余时间：', },
        'status2': { name: '立即预约', st: '预约剩余时间：', },
        'status3': { name: '等待抢购', st: '抢购活动开始剩余时间：', },
        'status4': { name: '立即抢购', st: '抢购活动剩余时间：', },
        'status5': { name: '等待抢购', st: '抢购活动开始剩余时间：', }, time: 0,
      },
      couponListUseType = { //1全部2关联商品3关联分类
        '1': '全场通用',
        '2': '仅可购买优惠券指定品类商品',
        '3': '仅可购买优惠券指定单品'
      },
      comments = {
        size: 0, list: [],
        good: {
          firstShopComment: { customerName: '', version: '', appTime: '', comments: '', },
          afterShopComment: { day: '', comments: '', },
          afterShowImgs: [], customerImageUrl: 'http://m.tcl.com/res/img/default.png', star: 0,
        }, wm: {}, averagescore: ''
      };
    let categroys = { 'tv': '电视', 'air': '空调', 'refrigerator': '冰箱', 'washer': '洗衣机', 'homeappliance': '健康电器', 'mobile': '手机', 'other': '电视周边' }
    let typeName = categroys[type] || '电视周边'

    // let location = utils.getReqCookie(context, 'location')
    // location = unescape(location)
    var addressParams = location
    const getCategory = async () => {
      let res = await http.asyncGet(api.getCategory, { productUuid: uuid })
      let _type = res && res.data && res.data.nameEN || 'other'
      if (_type !== type) {
        let q = '?';
        let data = Object.keys(query)
        data && data.map(x => q += `${x}=${query[x]}&`)
        context.redirect(`/${_type}/${uuid}${q == '?' ? '' : q}`)
      }
    }
    await getCategory()
    //初始化商品信息 -o
    const initDetalDescription = (res) => {
      if (!res.productModel || !res.front) {  isGoodsReady = false; return; }
      data['title'] = res.productModel.productMain.productName;  //商品名称

      var tg = res.activeStatus ? '<button class="font26" style="background:#f30; color:#fff; padding:.1rem .3rem; margin-right: .2rem" >预约商品</button>' : (res.preSale ? '<button class="font26" style="background:#f30; color:#fff; padding:.1rem .3rem; margin-right: .2rem" >预定商品</button>' : '');

      data['decInfo'] = tg + res.productModel.productMain.adviceNote; //商品描述
      data.decInfo = data.decInfo.replace(/“/g, '"').replace(/”/g, '"').replace(/: /g, ':').replace(/; /g, ';')
      swiperSlides[0] = res.front.bigPicture;              //商品图片
      res.productModel.productMultiImage.forEach((ele, index, arr) => {
        swiperSlides.push(ele.basicImageUrl)
      })

      data['jf'] = res.front ? parseInt(res.front.priceAndPromotion.price) : 0;  //积分
    }
    //颜色尺寸 -o
    const getColorSize = async () => {
      let res = await http.asyncGet(api.getColorSize, { productUuid: queryParam.uuid, terminalType: '02', })

      res.displayName = res.displayName ? res.displayName.slice(2) : res.displayName;
      colorSizeData = res;
      if (res.resultlist.length < 1) {
        colorSizeData['default'] = '默认';
      } else {
        res.resultlist.forEach((item, index, arr) => {
          if (item.uuid == queryParam.uuid) {
            colorSizeData['default'] = item.displayName;
          }
        });
      }
      if (!orderType.type) {
        orderType = { key: '标准', value: -1 }
      }
    }
    // 服务-o
    const service = async (params) => {
      let res = await http.asyncGet(api.getServicePolicies, params)
      var ele = [] //document.createElement("div");
      res.wuliu && ele.push('<h3>物流配送</h3>' + res.wuliu.replace(/&nbsp;/g, ''))
      res.qianshou && ele.push('<h3>商品签收</h3>' + res.qianshou.replace(/&nbsp;/g, ''))
      res.anzhuang && ele.push('<h3>安装</h3>' + res.anzhuang.replace(/&nbsp;/g, ''))
      res.xiazai && ele.push('<h3>资源下载</h3>' + res.xiazai.replace(/&nbsp;/g, ''))
      res.fapiao && ele.push('<h3>发票</h3>' + res.fapiao.replace(/&nbsp;/g, ''))
      res.shouhou && ele.push('<h3>售后服务</h3>' + res.shouhou.replace(/&nbsp;/g, ''));

      description3 = ele.join();
    }
    //常见问题 -o
    const getCommonProblems = async (params) => {
      let res = await http.asyncGet(api.getCommonProblems, params)
      description4 = res.retData.introduction
    }
    //秒杀 -o
    const seckill = async (promotionUuid, skuNo) => {

      let res = await http.asyncGet(api.seckill, { terminalType: '02', promotionUuid: promotionUuid, skuNo: skuNo })
      // if (!res.font) { isGoodsReady = false; return; }
      initDetalDescription(res);

      var tg = '<button class="font26" style="background:#f30; color:#fff; padding:.1rem .3rem; margin-right: .2rem" >秒杀商品</button>';
      data['decInfo'] = tg + res.productModel.productMain.adviceNote; //商品描述
      data.decInfo = data.decInfo.replace(/“/g, '"').replace(/”/g, '"').replace(/: /g, ':').replace(/; /g, ';')

      seckillData['salePrice'] = '秒杀价: ¥' + intPub(res.front.priceAndPromotion.price);
      seckillData['basePrice'] = '¥' + intPub(res.productSkuPrice);
      seckillData['size'] = res.front.priceAndPromotion.stock;
      seckillData['time'] = res.promotionLimitBuy.beginTime + '至' + res.promotionLimitBuy.endTime + ' ' + res.promotionLimitBuy.description;
      var time = res.remindSeconds, second, minute, hour, day;

      orderType = { key: '秒杀', value: promotionUuid, type: 'seckill', skuNo: skuNo };

      res.front.priceAndPromotion.stock == 0 ? (data['submitName'] = '售馨') : (data['submitName'] = '立即秒杀');

      let params = getParams(res.secondParentCategoryName);
      if (params) {
        await service(params)  //服务
        await getCommonProblems(params); //常见问题
      }
      description = res.productModel.productDescription.description

      description2 = (/<a name="productAttribute"><\/a>(.+)<a name="productAttribute"><\/a>/.test(description)) ? RegExp.$1 : `<div>${description}</div>`

      if (time <= 0) {
        if (res.activeStatus == 'status2') {
          seckillData['reduceTim'] = '活动还没开始！';
        } else {
          seckillData['reduceTim'] = '活动已结束';
        };
      } else {
        let scritp = []
        scritp.push(`<script type="text/javascript">var time = ${time},second, minute, hour, day;`)
        scritp.push("var reduceDom = document.getElementsByClassName('reduceTime')[0];")
        scritp.push('function reduceTime() {')
        scritp.push('second = Math.floor(time % 60);') // 计算秒
        scritp.push('minute = Math.floor((time / 60) % 60);') //计算分
        scritp.push('hour = Math.floor((time / 3600) % 24);') //计算小时
        scritp.push('day = Math.floor((time / 3600) / 24);') //计算天
        scritp.push("reduceDom.innerHTML = '剩余时间：'+day + '天' + hour + '时' + minute + '分' + second + '秒';")
        scritp.push('};var timer = setInterval(function () {if (time <= 0) {clearInterval(timer);window.location.reload();return;};time--;reduceTime();}, 1000);')
        scritp.push('reduceTime();')
        scritp.push('<\/script>')
        description2 += scritp.join('')
      };
    }

    //秒杀查库存-o
    const hadLimitProduct = async () => {
      let params = {
        region: addressParams.region,
        areaUuid: addressParams.areaUuid,
        provinceId: addressParams.provinceId,
        cityId: addressParams.cityId,
        skuNo: data['skuNo'],
        bType: '',
        buyNum: 1,
        promotionUuid: data['promotionUuid'],
        terminalType: '02',
      };
      let res = await http.asyncGet(api.hasLimitProduct, params)
      let _data = res.retData;
      if (_data.canBuy && _data.hasProduct) {
        data.canBuy = true;
        data.isGray = false;
      } else {
        data.canBuy = false;
        data.isGray = true;
      }
    }
    //套餐 -o
    const getSuit = async () => {
      suitDic = [{ key: '标准', default: true, value: -1 }];
      getColorSize();
      orderType = { key: '标准', value: -1 };
      let params = {
        productUuid: queryParam.uuid,
        regionId: data['region'] || addressParams['region'],
        terminalType: '02'
      };
      let res = await http.asyncGet(api.getSuit, params);
      let suitChild = {};
      res && res.retData && res.retData.forEach((item, index, arr) => {
        item.suitProductRellist.forEach((ele, index, arr) => {
         suitChild[ele.parentSkuNo] = ele.parentSkuNo;
          if (ele.productSkuListModel) {
            ele.productSkuListModel.price = '¥' + intPub(ele.productSkuListModel.price);
          }
          if (ele.isSuitMain == 1) {
            item.SuitMainID = ele.productUuid;
            item.SuitMainSkuNo = ele.parentSkuNo;
          }
        });

        if (arr.length > 10) {
          suitDic.push({ key: '套餐' + (index + 1), 'suitChild': suitChild, default: false, index, type: 'suit', suitUuid: item.uuid, mainProductUuid: item.SuitMainID, mainSkuNo: item.SuitMainSkuNo });
          item._keyName = '套餐' + (index + 1);
        } else {
          suitDic.push({ key: '套餐' + chKeys[index + 1],  'suitChild': suitChild, default: false, value: index, type: 'suit', suitUuid: item.uuid, mainProductUuid: item.SuitMainID, mainSkuNo: item.SuitMainSkuNo });
          item._keyName = '套餐' + chKeys[index + 1];
        }
        function aabb(arr) {
          const temp = new Map();
          return arr.filter((a) => !temp.has(a.value) && temp.set(a.value, a))
        }
        suitDic = aabb(suitDic)
        if (item.costAmount > item.totalAmount) {
          item.totalAmount = '¥' + intPub(item.totalAmount);
          item.costAmount = '¥' + intPub(item.costAmount);
        } else {
          item.totalAmount = '¥' + intPub(item.totalAmount);
          item.costAmount = '';
        }

      })

      suitList = res.retData || []
    }

    //取促销信息 -o
    const getStorePromotion = async () => {
      let params = { storeUuid: data.storeUuid, productUuid: queryParam.uuid, };
      let res = await http.asyncGet(api.getStorePromotion, params)
      if (res.code == 0) {
        let data = res.retData;
        data.forEach((ele, index, arr) => {
          var type = promotion.data[ele.promotionTypes[0]];
          promotion['list'].push({
            type: type,
            name: ele.promotionName
          })
        });
      }
    }
    //查库存  -o
    const hasProduct = async (cb) => {
      let params = {
        region: addressParams.region, areaUuid: addressParams.areaUuid, skuNo: data['skuNo'],
        parentSkuNo: data['parentSkuNo'], buyNum: cart.size, terminalType: '02',
        reservePromotionUuid: data['preSale'] ? data['preSale']['uuid'] : '',
      };
      let res = await http.asyncGet(api.hasProduct, params)

      let _data = res.retData;
      data['stock']=_data.totalNum;
      if (_data.canBuy && _data.hasProduct && cart.size <= _data.totalNum) {
        data.canBuy = true;
        data.isGray = false;

        if (data.activeStatus == 'status1' || data.activeStatus == 'status3') {
          data.isGray = true;
        }
      } else {
        if (_data.totalNum <= 0) {
          cart.size = 1;
          data.canBuy = false;
          data.isGray = true;
        } else {
          cart.size = _data.totalNum
        }
        stock = _data.totalNum
      //  this.$dialog.alert({ mes: '库存不足，请减少库存尝试'})
      }
      if (orderType.type == 'suit') {
        if (suitSingle && suitSingle.stock && cart.size <= suitSingle.stock) {
          data.canBuy = true;
          data.isGray = false;
        } else {
          if (suitSingle.stock <= 0) {
            cart.size = 1;
            data.canBuy = false;
            data.isGray = true;
          } else {
            cart.size = suitSingle.stock;
          }
          stock = suitSingle.stock
          // this.$dialog.alert({ mes: '库存不足最多可以购买' + suitSingle.stock + '件' })
        }
      }
      cb && cb();
    }
    //评论 -o
    const getComments = async () => {
      let params = { productUuid: queryParam.uuid, nowPage: 1, pageShow: 1, };

      let res = await http.asyncPost(api.getComments, params)
      if (res.commentList && res.commentList.length > 0) {
        comments.size = res.wm.totalNum;
        comments.averagescore = res.averagescore;
        let t = '', c = res.commentList[0].afterShopComment ? (res.commentList[0].afterShopComment.appTime - res.commentList[0].firstShopComment.appTime) : 0;

        if (c >= 86400000) {
          t = parseInt(c / 86400000) + '天后'
        }

        res.commentList[0].afterShopComment ? (res.commentList[0].afterShopComment['day'] = t) : (res.commentList[0].afterShopComment = { "day": t });
        res.commentList[0].firstShopComment.appTime = utils.formatDate(res.commentList[0].firstShopComment.appTime);
        comments.good = res.commentList[0];

        comments.good.star = res.commentList[0].firstShopCommentScores[0].appScore;
        comments.good.firstShowImgs = res.commentList[0].firstShowImgs
      }
    }
    //商品详情的广告
    const getCategoryAdv = async () => {
      let categoryUuid = data['categoryUuid'];
      let params = { categoryUuid: categoryUuid, terminalType: '02' }
      if (categoryUuid == 0) return;
      let res = await http.asyncGet(api.ad, params)
      if (res.iconPath) {
        let dom = '<div><a href=' + res.categoryUrl + '><img src=' + res.iconPath + ' /></a></div>';
        description = dom + description;
      }
    }
    // 检查收藏状态
    const checkFavourState = async () => {
      let params = { productUuid: queryParam.uuid, terminalType: '02' };
      let res = await http.asyncGet(api.checkFavourState, params)
      if (res.code == 0) {
        if (res.retData.favoriteState == '1') {
          data['collect'] = true;
        } else {
          data['collect'] = false;
        }
      }
    }
    // 取商品详情 seo 用
    const getProInfo = async () => {
      let params = { productUuid: queryParam.uuid, categoryUuid: data['categoryUuid'], terminalType: '02' }
      let res = await http.asyncGet(api.getProInfo, params)
      proInfoText = res && res.retData && res.retData.attributes || ''
    }
    let res = await http.asyncGet(api.getProduct, { terminalType: '02', uuid: uuid })

    if (res.code == 0) {
      //下架商品
      if (res.returnCode == 2) {
        isGoodsReady = false
        return { isGoodsReady }
      }
      //是否秒杀--nnn
      if (res.promotionUuid && res.skuNo) {
        data['promotionUuid'] = res.promotionUuid;
        data['skuNo'] = res.skuNo;

        await seckill(res.promotionUuid, res.skuNo);
        await getColorSize();    //颜色尺寸
        await hadLimitProduct();

        data['isShowCartButton'] = false;
        if (token) {
          await checkFavourState();
        }
      } else {

        await initDetalDescription(res);  //初始商品描述
        await getColorSize();    //颜色尺寸
        await getSuit();     //套餐
        let _price = res.front && res.front.priceAndPromotion && res.front.priceAndPromotion || {}
        data['salePrice'] = '<small class=sm>¥</small>' + intPub(_price.price);
        data['basePrice'] = '&yen;' + res.productSkuPrice
        data['staffPrice'] = '<small class=sm>&yen;</small>' + intPub(res.productModel.staffPrice)
        data['friendPrice'] = '<small class=sm>&yen;</small>' + intPub(res.productModel.friendPrice)
        //data['stock'] = res.front.stock
        if (_price.price < res.productBasePrice) { data['basePrice'] = '¥' + intPub(res.productBasePrice); }

        data['skuNo'] = res.productSku.skuNo;
        data['parentSkuNo'] = res.productSku.parentSkuNo;
        data['storeUuid'] = res.productModel.productMain.storeUuid;
        data['categoryUuid'] = res.productModel.productMain.categoryUuid;
        promotion['name'] = (_price && _price.name) ? _price.name : '';
        data['activeStatus'] = res.activeStatus; //预约状态
        data['reserveOrderId'] = res.reserveOrderId; //预约ID
        //预约
        if (res.activeStatus) {
          data['isShowCartButton'] = false;
          activeStatus['time'] = res.remindSeconds + 2;
          if (activeStatus[res.activeStatus]) {
            data['activeStatusTitle'] = activeStatus[res.activeStatus].st;
          }

          if (res.activeStatus == 'status1' || res.activeStatus == 'status3') {
            data['isGray'] = true;
          }

          data['submitName'] = activeStatus[res.activeStatus].name;
          orderType = { key: activeStatus[res.activeStatus].name, type: res.activeStatus };
        }
        //预定
        if (res.preSale) {
          data['preSale'] = res.preSale;
          data['isShowCartButton'] = false;
          //立即预定-全款, 立即付定金-首款
          data['submitName'] = res.preSale.type == 1 ? '立即预定' : '立即付定金';

          orderType = { key: data['submitName'], type: 'preSaleType' + res.preSale.type };
        }

        promotion['giftList'] = _price.promotionInteactiveModel.productGiftList ? _price.promotionInteactiveModel.productGiftList : [];
        await getStorePromotion(data);  //促销
        await hasProduct();         //查库存
        await getComments();   //评论

        if (token) {
          await checkFavourState();
        }
        let _params = getParams(res.secondParentCategoryName);
        if (_params) {
          await service(_params)  //服务
          await getCommonProblems(_params); //常见问题
        }
        let desHtml = res.productModel.productDescription.description;
        description = desHtml;
        if (/<a name="productAttribute"><\/a>(.+)<a name="productAttribute"><\/a>/.test(desHtml)) {
          description2 = RegExp.$1
        } else {
          description2 = desHtml;
        }
        await getCategoryAdv();
        await getProInfo() //取seo 的商品文字信息
      }
    } else {
      isGoodsReady = false
    }
    if (cart.size <= 1) {
      cart.left = true;
    } else if (cart.size >= 999) {
      cart.right = true;
    }
    return {
      type, couponListUseType, data, proInfoText, swiperSlides, stock, isGoodsReady,
      colorSizeData, suitSingle, queryParam, orderType, seckillData, description, description2, description3, description4,
      suitDic, suitList, cart, chKeys, promotion, activeStatus, comments, addressParams, location,
      title: `【TCL${typeName}】${data.title} – TCL严选商城`,
      Keywords: `TCL${typeName},TCL严选商城`,
      Description: `TCL${typeName}官方渠道售卖，全国包邮、正品低价、快速送达、提供正规发票。欢迎了解TCL官方产品介绍、最新价格等信息。`,
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.Description },
        { hid: 'keywords', name: 'keywords', content: this.Keywords }
      ]
    }
  }
}
</script>
