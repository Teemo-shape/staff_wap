<template>
    <div class="address">
        <div class="background-color"></div>
        <yd-navbar title="选择收货地址" class="selectgoodsAddress">
            <span slot="left" @click="goback">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </span>
            <span @click="goManager" slot="right" style="margin-right:0.6rem;color:#666;font-size:0.65rem;">
                管理
            </span>
        </yd-navbar>
        <div class="empty" v-if="addressList.length==0">
            <img src="/img/emptyCart.png">
            <p>哎呀！暂无地址~</p>
        </div>
        <div class="address_list">
            <div class="address_main" v-for="(item,index) in addressList" @click="setLocAdd(index)" :key="index">
                <div class="address_name">
                    <p>
                        <span>{{item.consignee}}</span>&nbsp;&nbsp;
                        <span>{{item.mobile}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-show="item.isDefault=='1'" class="default_add">默认收货地址</span>
                    </p>
                </div>
                <div class="address_add">
                    {{item.area + item.address}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: 'T严选商城-我的地址',
            }
        },
        data() {
            return {
                addressList: [],
                backUrl: '',
                from: '',
            }
        },
        mounted() {
            this.getQuery()
            this.getData()
        },
        methods: {
            getQuery() {
                this.from = this.$route.query.from
                if(this.from == 'confirm') {
                    this.backUrl = '/order/confirm'
                } else if(this.from == 'reservation') {
                    this.backUrl = '/order/reservation'
                }
                //   else if (this.from == 'uc') {
                //     this.backUrl = '/my/info'
                //   }
            },
            getData() {
                this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', {ranNum: Math.random()}, res => {
                    if(res.data) {
                        this.addressList = res.data.sort((a, b) => {
                            return b.isDefault - a.isDefault
                        })
                    }
                })
            },
            goManager() {
                this.$router.replace({'path': '/my/manager?from=' + this.from})
            },
            setLocAdd(i) {
                if(this.from == 'uc') {
                    return false;
                }
                localStorage.setItem('chooseAddress', JSON.stringify(this.addressList[i]))
                this.goback()
            },
            goback() {
                if(this.from == 'uc') {
                    window.location.href = '/my/info'
                }
                var queryParams = JSON.parse(this.$utils.getCookie('queryParams'))
                this.$router.push({'path': this.backUrl, query: queryParams})
            },
        }
    }
</script>
