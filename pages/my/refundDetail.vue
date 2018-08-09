<template>
    <!-- 售后详情 -->
    <div class="mod3">
        <div class="top-title">
            <span @click="goBack()" class="arrow-link">
                <i class="yd-back-icon"></i>
            </span>
            <span class="headline-title">售后详情</span>
            <span class="empty"></span>
        </div>
        <div class="after-goods">
            <div class="img">
                <a :href="'/other/'+ productUuid">
                    <img :src="specUuid" alt="图片">
                </a>
            </div>
            <div class="info">
                <a :href="'/other/'+ productUuid">
                    <div class="goods-name">{{productName}}</div>
                </a>
                <div class="goods-spec">
                    <span class="spec"
                          v-for="(item,key) in specs" :key="key">
                        {{item.value}}
                    </span>
                    <span class="numbers">x{{afterServiceNum}}</span>
                </div>
                <div class="goods-clinch">
                    <span class="clinch">
                        成交
                        <i>{{'￥' + (finalPrice - 0).toFixed(2)}}</i>
                    </span>
                </div>
            </div>
        </div>
        <div class="after-goods-infolist">
            <div class="infolist">售后编号：{{afterServiceNo}}</div>
            <div class="infolist">售后类型：{{showapplyType}}</div>
            <div class="infolist">售后状态：<i class="red">{{afterServiceStatus}}</i></div>
            <div class="infolist">申请时间：{{applyTime}}</div>
        </div>
        <div class="after-goods-issues">
            <div class="headline">问题描述：</div>
            <div class="issues-detail">{{afterDescription}}</div>
        </div>
        <div class="after-goods-logistics">
            <div>物流公司:</div>
            <div>物流编号:</div>
        </div>
        <div class="after-goods-btn">
            <span type="hollow" class="role-btn"
                  @click="cancel()"
                  v-if="afterServiceState">取消{{showapplyType}}
            </span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        head() {
            return {
                title: 'T严选商城-售后详情',
            }
        },
        data() {
            return {
                orderUuid: this.$route.query.orderId,
                productName: '',
                applyType: '',
                productUuid: '',
                serviceUuid: '',
                orderDetailId: '',
                finalPrice: '',
                specUuid: '',
                specs: '',
                afterServiceNum: '',
                applyTime: '',
                afterDescription: '',
                afterServiceNo: '',
                afterServiceStatus: '',
            }
        },
        mounted() {
            this.applyRole()
        },
        computed: {
            showapplyType() {
                return this.applyType == 1 ? '退货' : (this.applyType == 2 ? '退款' : '换货')
            },
            afterServiceState() {
                console.log('ss', '售后成功申请关闭'.includes(this.afterServiceStatus))
                if('售后成功申请关闭'.includes(this.afterServiceStatus)) {
                    return false
                } else {
                    return true
                }
            },
        },
        methods: {
            afterSalespec(spec) {
                if(!Array.isArray(spec) && spec) {
                    spec = JSON.parse(spec)
                }
                return spec === undefined ? '' : spec
            },
            goBack() {
                this.$router.go(-1)
            },
            //申请售后详情接口
            applyRole() {
                var params = {
                    nowPage: 1,
                    pageShow: 5,
                    nowChooseTab: '',
                    searchName: this.orderUuid,
                    terminalType: '02',
                }
                this.$http.post('/usercenter/afterSale/listKuyu', params, res => {
                    console.log('res', res)
                    if(res.code == 0) {
                        const dataList = res.data.dataList[0]
                        const dataDetail = dataList.detailModelList[0]
                        console.log(dataDetail)
                        this.productName = dataDetail.productName
                        this.productUuid = dataDetail.productUuid
                        this.finalPrice = dataDetail.od.finalPrice
                        this.specUuid = dataDetail.od.specUuid
                        this.afterServiceNum = dataDetail.afterServiceNum
                        this.orderDetailId = dataDetail.od.uuid
                        this.serviceUuid = dataList.uuid
                        this.afterServiceNo = dataList.afterServiceNo
                        this.afterServiceStatus = dataList.statusName
                        this.applyTime = dataList.applyTime
                        this.afterDescription = dataList.description
                        this.applyType = dataList.applyType
                        this.specs = this.afterSalespec(dataDetail.od.spec)
                    }
                })
            },
            //取消退货
            cancel() {
                var params = {
                    serviceUuid: this.serviceUuid,
                    orderDetailId: this.orderDetailId,
                    cancelContent: '',
                    reason: '',
                    ranNum: Math.random(),
                }
                this.$http.get('/usercenter/afterSale/cancelKuyu', params, res => {
                    if(res.code == '0') {
                        this.$dialog.alert({
                            mes: '取消成功！', callback: () => {
                                this.$router.push({path: '/my/refund'})
                            }
                        })
                    }
                })
            },
        }
    }
</script>

