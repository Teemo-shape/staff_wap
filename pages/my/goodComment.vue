<template>
    <div class="score g-comment comment-write">
        <div class="top-title">
            <span @click="goBack()" class="arrow-link">
                <i class="yd-back-icon"></i>
            </span>
            <span class="headline-title">评价晒单</span>
            <span class="empty"></span>
        </div>
        <div v-for="(item,index) in list" :key="index" class="comment-content">
            <div class="order-detail">
                <div class="img">
                    <a :href="'/other/'+item.productUuid"><img :src="item.imageUrl" alt=""></a>
                </div>
                <div class="cotent">
                    <yd-cell-group>
                        <yd-cell-item>
                            <span class="write-comment-lab" slot="left">描述相符评分：</span>
                            <yd-rate slot="left" v-model="item.rate1" size="0.95rem"
                                     active-color="#F5A623" padding="0.22rem"></yd-rate>
                        </yd-cell-item>
                    </yd-cell-group>
                    <div class="rateDescription">
                        <span v-show="item.rate1 > 0">{{item.rate1}}分(一共5分)</span>
                    </div>
                </div>
            </div>
            <div class="comment-word">
                <textarea v-model="item.des" maxlength='500' rows="5" placeholder="您对宝贝的观点对我们而言非常重要哦~" @input="changeNum(index)">
                </textarea>
                    <span class="num">{{item.num}}/500</span>
            </div>
            <div class="comment-pic">
                <div class="imgs">
                    <ul>
                        <li v-for="(val,idx) in item.imgList" :key="idx">
                            <span @click="delImg(item,idx)">X</span>
                            <img :src="val.fileUrl" alt="">
                        </li>
                        <li class="photo" @click="up(index)">
                            <div class="iky-camera"></div>
                            <input type="file" :id="'files'+index" hidden @change="upLoad(item,index)">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="comment-rate">
                <div class="rate-title">
                <span slot="left" class="setAnonymous">
                    <a @click="changeAnonymous(index)"
                       :class="'icon iconfont-tcl '+(!item.isActive?'icon-danxuan-weixuanzhong':'icon-danxuan-xuanzhong')"></a>
                    <span>匿名评价</span>
                </span>
                    <p>您写的评价将匿名展示</p>
                </div>
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">买家服务评分:</span>
                        <yd-rate slot="left" v-model="item.rate3" size="0.95rem" active-color="#F5A623"
                                 padding="0.22rem"></yd-rate>
                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">发货速度评分:</span>
                        <yd-rate slot="left" v-model="item.rate2" size="0.95rem" active-color="#F5A623"
                                 padding="0.22rem"></yd-rate>
                    </yd-cell-item>
                </yd-cell-group>
            </div>
        </div>
        <div class="submit" @click="submit">
            <yd-button size="large" type="danger">提交评价</yd-button>
        </div>
    </div>
</template>
<script>
    export default {
        head() {
            return {
                title: 'T严选商城-评价晒单',
            }
        },
        data() {
            return {
                data: {},
                list: [],
                num: 0,
                uuid: '',
                // rate1: 5,
                // rate2: 5,
                // rate3: 5,
                // imgList: [],
                stateName: [
                    {name: '下单', del: false},
                    {name: '付款', del: false},
                    {name: '发货', del: false},
                    {name: '交易成功', del: false},
                    {name: '评价', del: false},
                ],
                isPre: false,
                timeList: [],
            }
        },
        mounted() {
            this.uuid = this.$route.query.uuid
            this.getData()
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            changeNum(index) {
                this.list.forEach((val, i)=> {
                    if(index === i) {
                        val.num = this.list[index].des.length;
                    }
                })
            },
            changeAnonymous(index) {
                this.list.forEach((val, i)=> {
                    if(index === i) {
                        val.isActive = !val.isActive
                        val.isAnonymous = val.isAnonymous === 1? 0 : 1
                    }
                })

            },
            getData() {
                this.$http.post('/usercenter/order/ajaxviewKuyu', {uuid: this.uuid}, res => {
                    let data = {}
                    this.timeList = []
                    let m = res.data.m
                    data.uuid = m.uuid
                    data.orderId = m.orderId
                    data.orderStatusName = m.orderStatusName
                    data.state = m.state
                    if(m.orderType == '3') {
                        this.isPre = true;
                    }
                    //时间
                    if(m.orderTime) {
                        this.timeList.push(m.orderTime)
                    }
                    if(m.payTime && m.orderType != '3') {
                        this.timeList.push(m.payTime)
                    }
                    if(m.orderType == '3' && m.firstMoneyPaySuccessTime && m.firstMoneyPaySuccessTime.indexOf(':') > 0) {
                        this.timeList.push(m.firstMoneyPaySuccessTime)
                    }
                    if(m.orderType == '3' && m.lastMoneyPaySuccessTime && m.lastMoneyPaySuccessTime.indexOf(':') > 0) {
                        this.timeList.push(m.lastMoneyPaySuccessTime)
                    }
                    if(m.sendTime) {
                        this.timeList.push(m.sendTime)
                    }
                    ;
                    if(m.confirmTime) {
                        this.timeList.push(m.confirmTime)
                    }
                    ;
                    if(m.commentTime) {
                        this.timeList.push(m.commentTime)
                    }
                    ;
                    //订单状态
                    //预售订单
                    if(m.state != '8' && m.orderType == '3') {//已下单未付款
                        this.stateName = [
                            {name: '下单', del: false},
                            {name: '付定金', del: false},
                            {name: '付尾款', del: false},
                            {name: '发货', del: false},
                            {name: '交易成功', del: false},
                            {name: '评价', del: false},
                        ]
                        if(m.state == '1') {
                            this.stateName[0].del = true;
                        }
                        if(m.state == '2') {
                            this.stateName[1].del = true;
                        }
                        if(m.state == '4' || m.state == '5') {
                            this.stateName[2].del = true;
                        }
                        if(m.state == '6') {
                            this.stateName[3].del = true;
                        }
                        if(m.commentState == '1' || m.state == '7') {
                            this.stateName[4].del = true;
                        }
                        if(m.commentState == '2') {
                            this.stateName = [
                                {name: '下单', del: false},
                                {name: '付定金', del: false},
                                {name: '付尾款', del: false},
                                {name: '发货', del: false},
                                {name: '交易成功', del: false},
                                {name: '评价', del: false},
                            ]
                        }
                    }
                    //普通订单
                    if(m.state != '8' && m.orderType == '1') {//已下单未付款
                        if(m.state == '1') {
                            this.stateName[0].del = true;
                        }
                        if(m.state == '4' || m.state == '5') {
                            this.stateName[1].del = true;
                        }
                        if(m.state == '6') {
                            this.stateName[2].del = true;
                        }
                        if(m.commentState != '2' && m.state == '7') {
                            this.stateName[3].del = true;
                        }
                        if(m.state == '7' && m.commentState == '2') {
                            this.stateName = [
                                {name: '下单', del: false},
                                {name: '付款', del: false},
                                {name: '发货', del: false},
                                {name: '交易成功', del: false},
                                {name: '评价', del: false},
                            ]
                        }
                    }
                    //goods
                    var goods = []

                    m.detailList.map((y) => {
                        goods.push({
                            productName: y.productName,
                            productUuid: y.productUuid,
                            buyNum: y.buyNum,
                            price: y.basePrice,
                            payMoney: y.payMoney,
                            imageUrl: y.specUuid,
                            des: '',
                            imgList: [],
                            rate1: 5,
                            rate2: 5,
                            rate3: 5,
                            uuid: y.uuid,
                            isAnonymous: 1,
                            num: 0,
                            isActive: false,
                        })
                    })
                    // data.goods = goods

                    this.data = data
                    this.list = goods;
                })

            },
            up(i) {
                document.getElementById('files' + i).click()

            },
            upLoad(item, i) {
                if(item.imgList.length >= 5) {
                    this.$dialog.alert({mes: '最多上传5张'})
                    return false;
                }
                var data = {file: document.getElementById("files" + i).files[0]}

                this.$http.post('/usercenter/batchfileupload/batch/upload', data, res => {
                    if(res.code == '0') {
                        item.imgList.push(res.data)
                        document.getElementById("files" + i).value = '';
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
                val.imgList.splice(idx, 1)
            },
            submit() {
                var arr = []
                var del = true
                this.list.map((x, i) => {
                    if(!x.des) {
                        this.$dialog.alert({mes: '请输入商品评价！'})
                        del = false;
                        return false;
                    }
                    if(x.des.length > 150) {
                        this.$dialog.alert({mes: '请填写150字以内的评价内容'})
                        del = false;
                        return false;
                    }
                    arr.push(this.reviewData(i))
                })
                if(!del) {
                    return false;
                }
                var param = {
                    data: JSON.stringify(arr)
                }
                this.$http.post('/usercenter/productappraise/saveAppraiseKuyu', param, res => {
                    if(res.code == '0') {
                        this.$router.push({path: '/my/successComment'})
                    } else {
                        this.$dialog.alert({mes: '评价失败，请稍后再试！'})
                    }
                })
            },
            reviewData(i) {
                var imgString = '';
                if(this.list[i].imgList.length > 0) {
                    this.list[i].imgList.map((x) => {
                        imgString += x.imgName + ',' + x.fileUrl + ';'
                    })
                }
                var obj = {
                    orderDetailUuid: this.list[i].uuid,
                    productScore: this.list[i].rate1,
                    customerServiceScore: this.list[i].rate3,
                    transportServiceScore: this.list[i].rate2,
                    imgString: imgString,
                    orderId: this.uuid,
                    content: this.list[i].des,
                    appTags: ''
                }
                return obj;
            },
        }

    }
</script>
