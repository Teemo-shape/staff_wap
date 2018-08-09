<template>
    <div class="my-comments comments-detail">
        <div class="background-color"></div>
        <yd-navbar title="我的评价">
            <router-link to="/my" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>
        <ul class="comment-tab">
            <li class="navtab"
                :class="{active:item.active}"
                @click="tabClick(item, i)"
                v-for="(item, i) in tabItems"
                ref="navtab"
                :key="i"
            >
                <a>{{ item.title }}</a>
            </li>
            <!--<li class="tab" :class="{active:tab=='waitcomment'}" @click="tabClick('waitcomment')"><p>待评价</p></li>-->
            <!--<li class="tab" :class="{active:tab=='appraise'}" @click="tabClick('appraise')"><p>已评价</p></li>-->
        </ul>
        <div class="item" v-for="(item,index) in list" :key="index">
            <div class="goods">
                <div class="goods-details">
                    <div class="img">
                        <a :href="'/other/'+item.detailList[0].productUuid"><img
                            :src="item.detailList[0].specUuid"
                            :alt="item.detailList[0].productName">
                        </a>
                    </div>
                    <div class="info">
                        <p class="goods-name">
                            <a :href="'/other/'+item.detailList[0].productUuid">{{item.detailList[0].productName}}</a>
                        </p>
                        <p class="goods-spec">
                            <span class="spec"
                                  v-for="(spec,index) in item.detail"
                                  :key="index">{{spec.value}}</span>
                            <span class="multiply">x</span>
                            <span class="number">{{item.detailList[0].buyNum}}</span>
                        </p>
                    </div>
                </div>
                <div class="goods-comments">
                    <div class="zpBtn" v-if="tab=='appraise'">
                        <a :href="'/my/goodComment?uuid='+item.uuid+'&type=appraise'">修改评论</a>
                    </div>
                    <div class="zpBtn"
                         v-if="hasAftercomments(item)">
                        <a :href="'/my/addComment?uuid='+item.uuid+'&type=appraise'">追加评价</a>
                    </div>
                    <div class="zpBtn" v-if="tab=='appraise'">
                        <a :href="'/my/comment?uuid='+item.uuid+'&type=appraise'">查看评价</a>
                    </div>
                    <div class="zpBtn" v-if="tab=='waitcomment'">
                        <a :href="'/my/goodComment?uuid='+item.uuid+'&type=waitcomment'">评论</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    var isload = typeof window === 'undefined';
    let load = null;
    export default {
        head() {
            return {
                title: 'T严选商城-我的评价',
            }
        },
        data() {
            return {
                nowPage: 1,
                pageShow: 6,
                pageCount: 0,
                list: [],
                loadEnd: true,
                tabItems: [
                    {title: '全部评价', active: true, tab:'appraise'},
                    {title: '待评价', active: false, tab:'waitcomment'},
                    {title: '已评价', active: false, tab:'appraise'},
                    {title: '已追评', active: false,  tab:'waitcomment'},
                ],
                spec: {},
                type: '',
                tab: 'appraise'
            }
        },
        filters: {
            toFixed: function(val) {
                return val ? val.toFixed(1) : '';
            },
            matTime: function(val) {
                // return val ? this.$utils.formatDate(val) : '';
            },
            pubTime: function(val) {
                var t = '',
                    c = val.afterShopComment ? (val.afterShopComment.appTime - val.firstShopComment.appTime) : 0;
                return c >= 86400000 ? parseInt(c / 86400000) + '天后' : '当天'
            },
            formatxss: function(dom) {
                if(isload) return dom
                var d = document.createElement('div');
                dom = (dom && dom != undefined) ? dom.replace(/\s+/ig, '') : '';
                d.innerHTML = dom;
                return d.innerText;
            }
        },
        mounted() {
            load = this.load;
//            this.tab = this.$route.query.type || 'waitcomment';
            this.getData(this.tab);
            window.addEventListener('scroll', load, false)
        },
        beforeDestroy() {
            window.removeEventListener('scroll', load, false)
        },
        methods: {
            load() {
                let start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 50
                if(start && this.loadEnd && this.nowPage < this.pageCount && (this.list.length > 0)) {
                    this.nowPage++
                    this.$nextTick(function () {
                        this.getData(this.tab)
                    })
                }
            },
            tabClick(item, index) {
                let temp = this.$refs.navtab
                let len = temp.length;
                this.tabItems.forEach((val, ind) => {
                    val.active = false
                    if(index === ind) {
                        this.tab = val.tab
                        val.active = true
                    }
                })
                this.getData(item.tab)
            },
            getData(tab) {
                const params = {
                    nowPage: this.nowPage,
                    pageShow: this.pageShow,
                    nowChooseTab: tab,
                }
                this.loadEnd = false;
                this.$http.post('/usercenter/order/ajaxlist', params, res => {
                    console.log('res', res)
                    this.loadEnd = true
                    if(res.code == 0) {
                        this.pageCount = Math.ceil(res.data.pagination.totalNum / this.pageShow)
                        this.list = this.nowPage == 1 ? res.data.dataList : (this.list.concat(res.data.dataList));
                        for(let item of this.list) {
                            let spec = item.detailList[0].spec ? JSON.parse(item.detailList[0].spec) : '';
                            this.$set(item, 'detail', spec);
                        }
                    }
                })
            },
            hasAftercomments(item) {
                const hasAftercomments = item.commentState==2 && item.detailList[0].shopCommentModel && !item.detailList[0].shopCommentModel.afterComment
                return this.tab=='appraise' && hasAftercomments
            },
        }
    }
</script>

