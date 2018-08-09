<template>
    <!-- 申请售后 -->
    <div class="mod2">
        <div class="background-color"></div>
        <div class="top-title">
                <span @click="goBack()" class="arrow-link">
                    <i class="yd-back-icon"></i>
                </span>
            <span class="headline-title">申请售后</span>
            <span class="empty"></span>
        </div>
        <div class="after-goods">
            <div class="img">
                <a :href="'/other/'+ productUuid"><img :src="goodsImgURL" alt="图片"></a>
            </div>
            <div class="info">
                <a :href="'/other/' + productUuid" ><div class="goods-name">{{productName}}</div></a>
                <div class="goods-spec">
                    <span class="spec"
                          v-for="(item,key) in afterSalevalues" :key="key">
                        {{item.value}}
                    </span>
                    <span class="numbers">{{'x' + buyNum}}</span>
                </div>
                <div class="goods-clinch">
                    <span class="clinch">
                        成交
                        <i style="color: red">{{'￥' + (finalPrice - 0).toFixed(2)}}</i>
                    </span>
                </div>
            </div>
        </div>
        <div class="after-type">
            <div class="after-type-title">售后类型</div>
            <yd-cell-item>
                <span slot="left" class="option">
                      <yd-button slot="left" type="hollow" class="optiontype"
                                 :key="index" v-for="(item,index) in allTypes"
                                 @click.native="selectType(item)"
                                 :class="{'active':item.on}">
                          <i class="icon iconfont-tcl icon-xuanze" v-show="item.on"></i>
                          {{item.txt}}
                      </yd-button>
                </span>
            </yd-cell-item>
        </div>
        <yd-cell-item class="after-number">
            <span slot="left" class="numbers">数量</span>
            <yd-input slot="right" required
                      :placeholder='placeholder' class="numDetail"
                      v-model="afterServiceNum"
                      v-on:input="numberLimit()">
            </yd-input>
        </yd-cell-item>
        <div class="after-issues-description">
            <div class="issues-description">问题描述</div>
            <yd-textarea slot="right" v-model="description" placeholder="请输入您的问题" maxlength="500">
            </yd-textarea>
        </div>
        <div size="large" type="danger" class="submitBtn" @click="submit()" :class="{'red':submitLimit}">提交</div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        head() {
            return {
                title: 'T严选商城-售后申请',
            }
        },
        data() {
            return{
                productName: '',
                buyNum: null,
                productUuid: '',
                finalPrice: '',
                goodsImgURL: '',
                customerAddress: '',
                customerTel: '',
                customerName: '',
                afterSalevalues: '',
                afterServiceNum: null,
                description: '',
                applyType: '1',
                //物流状态，判断是否能提交。
                afterlogisticsStates: '',
                sendGoods: '1',
                receiveGoods: '',
                orderMainUuid: '',
                allTypes: [
                    {txt: '退货', on: true, val: '1'},
                    {txt: '换货', on: false, val: '3',},
                ],
            }
        },
        created() {
            this.applyRole()
        },
        computed: {

            orderUuid: function() {
                return this.$route.query.orderId
            },
            detailUuid: function() {
                return this.$route.query.uuid
            },
            placeholder: function() {
                return `请输入数量（最大${this.buyNum}）`
            },

            // 不可输入非数字、大于购买数、物流状态大于等于6、问题描述不为空
            submitLimit: function() {
                const select = Number(this.afterServiceNum)
                const logisticsStates = Number(this.afterlogisticsStates)
                return select <= this.buyNum && select && logisticsStates >=6 && this.description.length > 0
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            //判断物流状态
            logisticsStates(state) {
                if(state) {
                    if(Number(state) >= 6) {
                        this.receiveGoods = '1'
                    } else {
                        this.receiveGoods = '0'
                    }
                }
            },
            afterSalespec(spec) {
                if(!Array.isArray(spec) && spec) {
                    spec = JSON.parse(spec)
                }
                return spec === undefined ? '' : spec
            },
            selectType(item) {
                this.allTypes.map(type => {
                    type.on = false
                })
                item.on = true
                this.applyType = item.val
            },
            numberLimit() {
                const select = Number(this.afterServiceNum)
                if(!select && this.afterServiceNum !== '') {
                    this.$dialog.alert({
                        mes: '请输入数量值!', callback: () => {
                            this.afterServiceNum = ''
                        }
                    })
                }else if (this.afterServiceNum === '0' || select > this.buyNum) {
                    this.$dialog.alert({
                        mes: '超过购买数量!', callback: () => {
                            this.afterServiceNum = ''
                        }
                    })
                }
            },
            descriptionLimit() {
                console.log(!this.description)
                if(!this.description) {
                    this.$dialog.alert({
                        mes: '问题描述不能为空!',callback: () => {

                        }
                    })
                }
            },
            //申请售后详情接口
            applyRole() {
                var params = {
                    orderUuid: this.orderUuid,
                    applyType: '',
                    detailUuid: this.detailUuid,
                    terminalType: '02'
                }
                this.$http.get('/usercenter/afterSale/toOrderRefundKuyu', params, res => {
                    if(res.code == 0) {
                        console.log('res', res)
                        this.productName = res.data.orderDetail.productName;
                        this.productUuid = res.data.orderDetail.productUuid;
                        this.buyNum = res.data.orderDetail.buyNum
                        this.finalPrice = res.data.orderDetail.finalPrice
                        this.goodsImgURL = res.data.orderDetail.specUuid
                        this.customerAddress = res.data.omam.address
                        this.customerTel = res.data.omam.mobile
                        this.customerName = res.data.omam.name
                        this.afterlogisticsStates = res.data.orderMain.state
                        this.orderMainUuid = res.data.orderDetail.orderMainUuid
                        this.afterSalevalues = this.afterSalespec(res.data.orderDetail.spec)
                        this.logisticsStates(this.afterlogisticsStates)
                    }
                })
            },

            //提交接口
            submit() {
                const select = Number(this.afterServiceNum)
                var params = {
                    customerName: this.customerName,
                    customerTel: this.customerTel,
                    customerAddress: this.customerAddress,
                    afterServiceNum: select,
                    description: this.description,
                    reason: '',
                    orderUuid: this.orderUuid,
                    detailUuid: this.detailUuid,
                    applyType: this.applyType,
                    backMoney: this.finalPrice,
                    imgName: '',
                    money: String(this.finalPrice),
                    returnType: '',
                    sendGoods: this.sendGoods,
                    receiveGoods: this.receiveGoods,
                    packageNote: '',
                    packageGoodOrNot: '',
                    ranNum: Math.random(),
                    terminalType: 2
                }
                console.log(this.submitLimit, params)
                if(this.submitLimit) {
                    this.$http.post('/usercenter/afterSale/saveServiceApplyKuyu', params, res => {
                        console.log('test1', res)
                        if(res.code == '0') {
                            this.$dialog.alert({
                                mes: '申请成功!', callback: () => {
                                    this.$router.push({path: `orderDetail?uuid=${this.orderMainUuid}`})
                                }
                            })
                        }
                    })
                }
            },
        }

    }
</script>
