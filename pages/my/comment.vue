<template>
    <div class="score g-comment">
        <div class="background"></div>
        <yd-navbar title="评价详情">
            <router-link :to="'/my/comments?type='+type" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>
        <div v-if="!list" class="empty">
            <img src="/static/img/emptyCart.png">
            <p>哎呀！暂无评论数据~~</p>
        </div>

        <div v-else>
            <div class="order">
                <div class="left">评价</div>
                <div class="right">{{data.time}}</div>
            </div>
            <div v-for="(item,index) in list" :key="index">
                <div class="goods">
                    <div class="img goods-img">
                        <a :href="'/other/'+item.productUuid"><img :src="item.imageUrl" :alt="item.productName"></a>
                    </div>
                    <div class="info">
                        <yd-cell-group class="rate-group">
                            <yd-cell-item class="rate-start">
                                <span slot="left" class="rate-description">描述相符评分:</span>
                                <yd-rate slot="left" v-model="item.rate1" :readonly="true" size=".9rem"
                                         active-color="#F5A623"></yd-rate>
                            </yd-cell-item>
                            <yd-cell-item class="rate-start">
                                <span slot="left" class="rate-description">买家服务评分:</span>
                                <yd-rate slot="left" v-model="item.rate3" :readonly="true" size=".9rem"
                                         active-color="#F5A623"></yd-rate>
                            </yd-cell-item>
                            <yd-cell-item class="rate-start">
                                <span slot="left" class="rate-description">发货速度评分:</span>
                                <yd-rate slot="left" v-model="item.rate2" :readonly="true" size=".9rem"
                                         active-color="#F5A623"></yd-rate>
                            </yd-cell-item>
                        </yd-cell-group>
                    </div>
                </div>
                <div class="node comment">
                    <p class="comment-con">{{item.des}}</p>
                    <div class="imgs clearfix" v-show="item.imgList && item.imgList.length>0">
                        <ul>
                            <li v-for="(val,idx) in item.imgList" :key="idx">
                                <img :src="val.imgUrl" alt="">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="node" v-show="item.des1 || (item.imgList1 && item.imgList1.lenght>0)">
                    <div class="zpTxt" v-show="item.des1">
                        <p>追加评论</p>
                        <p class="time">{{item.createTime1 | formatTime}}</p>
                    </div>
                    <p class="comment-con">{{item.des1}}</p>
                    <div class="imgs clearfix" v-show="item.imgList1">
                        <ul>
                            <li v-for="(val,idx) in item.imgList1" :key="idx">
                                <img :src="val.imgUrl" alt="">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        head() {
            return {
                title: 'T严选商城-我的评论',
            }
        },
        data() {
            return {
                uuid: '', list: [], data: {}, type: ''
            }
        },
        mounted() {
            this.uuid = this.$route.query.uuid;
            this.type = this.$route.query.type;
            this.getData()
        },
        filters: {
            formatTime(val) {
                let time = new Date(val);
                var y = time.getFullYear();//年
                var m = time.getMonth() + 1;//月
                var d = time.getDate();//日
                var h = time.getHours();//时
                var mm = time.getMinutes();//分
                var s = time.getSeconds();//秒
                return (y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s);
            }
        },
        methods: {
            getData() {
                this.$http.post('/usercenter/order/ajaxviewKuyuByAfterComment', {uuid: this.uuid}, res => {
                    if(res.code == '0') {
                        console.log(res)
                        let data = {}
                        data.time = res.data.detailList[0].opeTime;

                        var goods = []
                        res.data.detailList.map((y) => {
                            var shopCommentModel = y.shopCommentModel;
                            if(shopCommentModel===null) return false;
                            console.log(y.shopCommentModel);
                            goods.push({
                                productName: y.productName,
                                price: y.finalPrice,
                                imageUrl: y.specUuid,
                                des: shopCommentModel.comments,
                                imgList: shopCommentModel.showImgList ? shopCommentModel.showImgList : [],
                                rate1: shopCommentModel.productScore,
                                rate2: shopCommentModel.transportServiceScore,
                                rate3: shopCommentModel.customerServiceScore,
                                uuid: y.uuid,
                                des1: shopCommentModel.afterShopComment ? shopCommentModel.afterShopComment.comments : '',//追加评论
                                createTime1: shopCommentModel.afterShopComment ? shopCommentModel.afterShopComment.createTime : '',//追加评论时间
                                imgList1: shopCommentModel.afterShopComment ? shopCommentModel.afterShopComment.showImgList : [],
                                replyList: shopCommentModel.replyList ? shopCommentModel.replyList : [],
                                replyList1: shopCommentModel.afterShopComment ? shopCommentModel.afterShopComment.replyList : [],
                                productUuid: y.productUuid,
                            })
                        })

                        this.data = data;
                        this.list = goods;
                    }
                })
            },

        },
    }
</script>
<style>
    .g-comment.score .background {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: #f1f1f1;
        z-index: -1;
    }
    .g-comment.score .order {
        padding: 0.4rem 0.6rem !important;
    }
    .g-comment.score .goods {
        padding: 0.2rem !important;
        height: 100%;
    }
    .g-comment.score .rate-start {
        height: 1.4rem !important;
        margin: 0.1rem 0 !important;
    }
    .g-comment.score .yd-cell:after {
        border: none !important;
    }
    .g-comment.score .rate-start:after {
        border: none !important;
    }
    .g-comment.score .yd-rate {
        margin-left: 0.4rem !important;
    }
    .g-comment.score .yd-rate a {
        margin-left: 0.2rem !important;
    }
    .g-comment.score .rate-description {
        padding-top: 0.2rem !important;
    }
    .g-comment.score .goods:before {
        width: 100% !important;
    }
    .g-comment.score .comment-con {
        padding: 0.43rem 0 0.43rem 0.58rem !important;
        border-bottom: 1px solid #efefef !important;
        background-color: white !important;
    }
    .g-comment.score .imgs ul li {
        margin-right: 0.5rem !important;
    }
    .g-comment.score .imgs {
        margin: 0 !important;
        padding: .7rem .5rem !important;
    }
    .g-comment.score .zpTxt {
        padding: .6rem .5rem !important;
        display: flex !important;
        justify-content: space-between !important;
        border-bottom: 1px solid #efefef !important;
    }
</style>
