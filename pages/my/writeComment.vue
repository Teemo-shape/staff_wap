<template>
    <div class="score g-comment comment-write">
        <yd-navbar title="评价晒单">
            <router-link :to="'/my/comments?type=appraise'" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>
        <div class="comment-content">
            <div class="order-detail">
                <div class="img">
                    <a :href="'/other/'+goods.productUuid"><img :src="goods.imageUrl" :alt="goods.productName"></a>
                </div>
                <div class="cotent">
                    <yd-cell-group>
                        <yd-cell-item>
                            <span class="write-comment-lab" slot="left">描述相符评分：</span>
                            <yd-rate slot="left" v-model="goods.rate1" size="0.95rem"
                                     active-color="#F5A623" padding="0.22rem"></yd-rate>
                        </yd-cell-item>
                    </yd-cell-group>
                    <div class="rateDescription">
                        <span v-show="goods.rate1 > 0">{{goods.rate1}}分(一共5分)</span>
                    </div>
                </div>
            </div>
            <div class="comment-word">
            <textarea maxlength='500' rows="5" v-model="goods.des1" placeholder="您对宝贝的观点对我们而言非常重要哦~" @input="changeNum">
            </textarea>
                <span class="num">{{num}}/500</span>
            </div>
            <div class="comment-pic">
                <div class="imgs">
                    <ul>
                        <li v-for="(val,idx) in goods.imgList1" :key="idx">
                            <span @click="delImg(goods.imgList1,idx)">X</span>
                            <img :src="val.fileUrl" alt="">
                        </li>
                        <li class="photo" @click="up()">
                            <div class="iky-camera"></div>
                            <input type="file" id="files" hidden @change="upLoad(goods)">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="comment-rate">
                <div class="rate-title">
                <span slot="left" class="setAnonymous">
                    <a @click="changeAnonymous"
                       :class="'icon iconfont-tcl '+(!isActive?'icon-danxuan-weixuanzhong':'icon-danxuan-xuanzhong')"></a>
                    <span>匿名评价</span>
                </span>
                    <p>您写的评价将匿名展示</p>
                </div>
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">买家服务评分:</span>
                        <yd-rate slot="left" v-model="goods.rate3" size="0.95rem" active-color="#F5A623"
                                 padding="0.22rem"></yd-rate>
                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">发货速度评分:</span>
                        <yd-rate slot="left" v-model="goods.rate2" size="0.95rem" active-color="#F5A623"
                                 padding="0.22rem"></yd-rate>
                    </yd-cell-item>
                </yd-cell-group>
            </div>
        </div>
        <div class="submit" @click="submit()">
            <yd-button size="large" type="danger">提交评价</yd-button>
        </div>
    </div>
</template>
<script>
    import {ImgShow} from '~/components/imgShow';

    export default {
        components: {'imgShow': ImgShow,},
        head() {
            return {
                title: 'T严选商城-评价晒单',
            }
        },
        data() {
            return {
                uuid: '',
                isActive: false,
                goods: {},
//                tipText: [
//                    '<span>$ 分(一共5分)</span>',
//                    '<span>$ 分(一共5分)</span>',
//                    '<span>$ 分(一共5分)</span>',
//                    '<span>$ 分(一共5分)</span>',
//                    '<span>$ 分(一共5分)</span>'
//                ],
                num: 0,
                isAnonymous: 1,//不匿名
            }
        },
        mounted() {
            this.uuid = this.$route.query.uuid
//            this.type = this.$route.query.type
            this.getData()
        },
        methods: {
            getData() {
                this.$http.post('/usercenter/order/ajaxviewKuyuByAfterComment', {uuid: this.uuid}, res => {
                    if(res.code == '0') {
                        console.log(res)
                        res.data.detailList.map((y) => {
                            this.goods = {
                                uuid: y.uuid,
                                imageUrl: y.specUuid,
                                productUuid: y.productUuid,
                                productName: y.productName,
                                imgList1: [],
                                des1: '',
                                rate1: 5,
                                rate2: 5,
                                rate3: 5,
                            }
                        })
                        console.log(this.goods)
                    }
                })
            },
            changeNum() {
                this.num = this.goods.des1.length;
            },
            up() {
                document.getElementById('files').click()
            },
            upLoad(goods) {
                if(goods.imgList1.length >= 5) {
                    this.$dialog.alert({mes: '最多上传5张'})
                    return false
                }
                var data = {file: document.getElementById("files").files[0]}

                this.$http.post('/usercenter/batchfileupload/batch/upload', data, res => {
                    if(res.code == '0') {
                        goods.imgList1.push(res.data)
                        document.getElementById("files").value = '';
                    } else if(res.code == '-1') {
                        this.$dialog.alert({mes: '图片过大,上传的图片不能超过4M！'})
                    } else if(res.code == '-2') {
                        this.$dialog.alert({mes: '仅支持jpg,gif,png,jpeg,bmp后缀的图片上传！'})
                    } else if(res.code == '-3') {
                        this.$dialog.alert({mes: '图片为空!'})
                    }
                })
            },
            delImg(val, idx) {
                val.splice(idx, 1)
            },
            submit() {
                var obj = {}, arr = [];
                if(!this.goods.des1) {
                    this.$dialog.alert({mes: '请输入商品评价！'})
                    return false;
                }
                if(this.goods.des1.length > 150) {
                    this.$dialog.alert({mes: '请填写150字以内的追评内容'})
                    return false;
                }
                obj = this.reviewData();
                arr.push(obj)
                var param = {
                    data: JSON.stringify(arr)
                }
                this.$http.post('/usercenter/productappraise/saveAppraiseKuyu', param, res => {
                    if(res.code == '0') {
                        this.$dialog.alert({
                            mes: '评价成功', callback: () => {
                                this.$router.push({path: '/my/successComment?uuid=' + this.uuid})
                            }
                        })
                    } else {
                        this.$dialog.alert({mes: '评价失败，请稍后再试！'})
                    }
                })
            },
            reviewData() {
                var imgString = '';
                if(this.goods.imgList1.length > 0) {
                    this.goods.imgList1.map((x) => {
                        imgString += x.imgName + ',' + x.fileUrl + ';'
                    })
                }
                var obj = {
                    orderDetailUuid: this.goods.uuid,
                    productScore: this.goods.rate1,//产品描述
                    customerServiceScore: this.goods.rate3,//服务态度
                    transportServiceScore: this.goods.rate2,//物流
                    imgString: imgString,
                    orderId: this.uuid,
                    content: this.goods.des1,
                    appTags: '',
                    terminalType: '02'
                }
                return obj;
            },
            changeAnonymous() {
                this.isActive = !this.isActive;
                this.isAnonymous = this.isAnonymous === 1? 0 : 1
            },
        },
    }
</script>

