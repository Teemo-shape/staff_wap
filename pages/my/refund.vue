<template>
    <div class="my-info afterReturn-sale">
        <div class="background-color"></div>
        <!-- 退货/售后 -->
        <div class="mod1">
            <div class="top-title">
                <span @click="goBack()" class="arrow-link">
                    <i class="yd-back-icon"></i>
                </span>
                <span class="headline-title">退货/售后</span>
                <span class="empty"></span>
            </div>
            <div class="after-item" v-for="(data,i) in dataList" :key="i">
                <div class="after-orderNo">
                    <div>
                        <span>售后编号：</span>
                        <span>{{data.afterServiceNo}}</span>
                    </div>
                    <div class="fr red">
                        {{showapplyType(data)}}
                    </div>
                </div>
                <div class="after-goods">
                    <div class="img">
                        <a :href="'/other/'+ data.detailModelList[0].productUuid">
                            <img :src="data.detailModelList[0].od.specUuid" alt="图片">
                        </a>
                    </div>
                    <div class="info">
                        <a :href="'/other/'+ data.detailModelList[0].productUuid">
                            <div class="goods-name">{{data.detailModelList[0].productName}}</div>
                        </a>
                        <div class="goods-spec">
                        <span class="spec"
                            v-for="(x,y) in data.detailModelList[0].od.spec"
                            :key="y">{{data.detailModelList[0].od.spec[y].value}}
                        </span>
                            <span class="numbers">x{{data.detailModelList[0].afterServiceNum}}</span>
                        </div>
                    </div>
                </div>
                <div class="after-detail">
                    <div class="after-detail-left">售后状态: {{data.statusName}}</div>
                    <div class="btn">
                        <a :href="'/my/refundDetail?orderId='+data.orderId">
                            查看详情
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let load = null
    export default {
        head() {
            return {
                title: 'T严选商城-退货/售后',
            }
        },
        data() {
            return {
                orderId: '',
                nowPage: 1,
                pageShow: 5,
                pageCount: null,
                loadEnd: true,
                dataList: [],
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            load = this.load
            window.addEventListener('scroll', load, false)
        },
        beforeDestroy() {
            window.removeEventListener('scroll', load, false)
        },
        computed: {

        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            afterServiceState(state) {
                console.log('ss', '售后成功申请关闭'.includes(state))
                if('售后成功申请关闭'.includes(state)) {
                    this.showCancel = false
                }else {
                    this.showCancel = true
                }
            },
            showapplyType(data) {
                return data.applyType == 1 ? '退货' : (data.applyType == 2 ? '退款' : '换货')
            },
            //od.spec字符串，转为数组
            filterSalespec(data) {
                return data.map((val, index)=> {
                    const obj = val
                    const spec = obj.detailModelList[0].od.spec
                    if(!Array.isArray(spec) && spec) {
                        obj.detailModelList[0].od.spec = JSON.parse(spec)
                    }else {
                        obj.detailModelList[0].od.spec = spec === undefined ? '' : spec
                    }
                    return obj
                })
            },
            load() {
                const start = window.scrollY + document.body.clientHeight >= document.body.scrollHeight - 50
                if(start && this.loadEnd && this.nowPage < this.pageCount && (this.dataList.length > 0)) {
                    this.nowPage++
                    this.$nextTick(function () {
                        this.getData(this.pageShow)
                    })
                }
            },
            getData() {
                var params = {
                    nowPage: this.nowPage,
                    pageShow: this.pageShow,
                    nowChooseTab: '',
                    searchName: '',
                    terminalType: '02',
                }
                this.loadEnd = false
                this.$http.post('/usercenter/afterSale/listKuyu', params, (res)=> {
                    console.log('res', res)
                    if(res.code == 0) {
                        const list = this.filterSalespec(res.data.dataList)
                        this.pageCount = Math.ceil(res.data.pagination.totalNum / this.pageShow)
                        this.loadEnd = true
                        this.dataList = this.nowPage == 1 ? list : (this.dataList.concat(list))
                    }
                })
            },
        }
    }
</script>


