<template>
    <div class="manager">
        <div class="background-color"></div>
        <div>
            <yd-navbar title="地址管理">
        <span @click="goBack" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </span>
            </yd-navbar>
            <div class="empty" v-if="addressList.length==0">
                <img src="/img/emptyCart.png">
                <p>哎呀！暂无地址~</p>
            </div>
            <div class="address_list">
                <div class="address_item" v-for="(item,key) in addressList" :key="key">
                    <div @click="setLocAdd(key)">
                        <div class="address_name">
                            <p>
                                <span>{{item.consignee}}</span>&nbsp;&nbsp;
                                <span>{{item.mobile}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                        </div>
                        <div class="address_add">
                            {{item.area + item.address}}
                        </div>
                    </div>

                    <div class="address_control">
                        <div class="set">
                            <a @click="setDefault(item, key)"
                               :class="'icon iconfont-tcl '+(item.isDefault=='0'?'icon-danxuan-weixuanzhong':'icon-danxuan-xuanzhong')"></a>
                            <span>{{item.isDefault == '1' ? '默认地址' : '设为默认地址'}}</span>
                        </div>
                        <div class="fr" @click="removeAdd(key)">
                            <b class="iky-remove"></b>
                            <span>删除</span>
                        </div>
                        <div class="fr" @click="editAdd(key,item.isDefault)">
                            <b class="iky-edit"></b>
                            <span>编辑</span>
                        </div>
                    </div>
                </div>
            </div>
            <yd-button size="large" type="danger" @click.native="toNewAdd" class="add-btn"><i
                class="icon iconfont-tcl icon-tianjiaxindizhi"></i>新建地址
            </yd-button>
        </div>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: 'T严选商城-地址管理',
            }
        },
        data() {
            return {
                addressList: [],
                radio: true,
                uuids: [], //地址
                from: this.$route.query.from,
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            setLocAdd(i) {
                if(this.from == 'uc') {
                    return false;
                }
                localStorage.setItem('chooseAddress', JSON.stringify(this.addressList[i]))
                var queryParams = JSON.parse(this.$utils.getCookie('queryParams'))
                this.$router.push({'path': '/order/' + this.from, query: queryParams})
            },
            getData() {
                this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', {ranNum: Math.random()}, res => {
                    this.uuids = []
                    if(res.data) {
                        this.addressList = res.data.sort((a, b)=> {
                            return b.isDefault - a.isDefault
                        })
                        res.data.map(o => {
                            this.uuids.push(o.uuid)
                        })
                    }
                })
            },
            goBack() {
                this.$router.go(-1)
//                if(this.form == 'uc') {
//                    this.$router.replace({'path': '/my'})
//                } else {
//                    this.$router.replace({'path': '/my/address?from=confirm'})
//                }
            },
            toNewAdd() {
                this.$router.push({path: '/my/newAddress'})
            },
            setDefault(item, k) {
                if(this.addressList[k].isDefault == '1') {
                    return false;
                }
                this.$http.post('/usercenter/customeraddress/setDefault', {uuid: this.uuids[k]}, res => {
                    this.getData()
                })
            },
            removeAdd(k) {
                this.$dialog.confirm({
                    title: '温馨提示',
                    mes: '确定删除吗？',
                    opts: [
                        {
                            txt: '取消',
                            callback: () => {
                            }
                        },
                        {
                            txt: '确定',
                            callback: () => {
                                //如果删除的地址在本地有，一起删除
                                if(localStorage.getItem('chooseAddress')) {
                                    var o = JSON.parse(localStorage.getItem('chooseAddress'))
                                    if(o.uuid === this.uuids[k]) {
                                        localStorage.removeItem('chooseAddress')
                                    }
                                }
                                this.$http.get('/usercenter/customeraddress/delDeliveryAddress', {uuid: this.uuids[k]}, res => {
                                    this.$router.go(0)
                                })
                            }
                        }
                    ]
                })

            },
            editAdd(k, isDefault) {
                this.$router.push({path: '/my/newAddress', query: {'uuid': this.uuids[k], 'isDefault': isDefault}})
            },
        }
    }
</script>
