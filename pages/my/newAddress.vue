<template>
    <div class="newAdd">
        <yd-navbar :title="uuid?'编辑地址':'新建地址'">
      <span @click="goBack" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </span>
            <a @click="dele" class="delBtn" slot="right" v-show="uuid">删除</a>
        </yd-navbar>
        <yd-cell-group>
            <yd-cell-item type="label">
                <span slot="left" style="padding-left:.75rem;">收货人：</span>
                <input slot="right" v-model="addressDetail.consignee" placeholder="请输入收货人"></input>
            </yd-cell-item>
            <yd-cell-item type="label" href="#">
                <span slot="left">联系电话：</span>
                <input maxlength="11" @keyup="validMobile" slot="right" v-model="addressDetail.mobile"
                       placeholder="请输入联系电话"></input>
            </yd-cell-item>
            <yd-cell-item arrow>
                <span slot="left">所在地区：</span>
                <input slot="right" type="text" @click.stop="modeCity = true" v-model="modeCityValue" readonly
                       class="cell-input" placeholder="省 市 区 街道">
            </yd-cell-item>
            <cityselect v-model="modeCity" :done="resultCtiy" provance="" city="" area=""></cityselect>
            <yd-cell-item class="address">
                <span slot="left">详细地址：</span>
                <textarea slot="right" placeholder="请输入详细地址" v-model="addressDetail.address" min="3" cols="25"
                          rows="3"></textarea>
            </yd-cell-item>
            <yd-cell-item type="label">
        <!--<span slot="left" v-if="isDefault==1" class="setDefaultAdd">-->
          <!--已默认-->
        <!--</span>-->
        <span slot="left" class="setDefaultAdd">
          <a @click="changeDefault" :class="'icon iconfont-tcl '+(!isActive?'icon-danxuan-weixuanzhong':'icon-danxuan-xuanzhong')"></a>
                    <!--<a @click="changeDefault" :class="'icon iconfont-tcl '+(!isActive?'icon-danxuan-weixuanzhong':'icon-danxuan-xuanzhong')"></a>-->
          <span>{{Number(isDefault) ? '已默认':'设为默认地址'}}</span>
        </span>
            </yd-cell-item>
        </yd-cell-group>
        <yd-button size="large" type="danger" @click.native="save" class="add-btn">保存</yd-button>
    </div>
</template>

<script>
    import {CitySelect} from '~/components/cityselect/index.js';

    export default {
        head() {
            return {
                title: 'T严选商城-地址管理',
            }
        },
        components: {
            'cityselect': CitySelect,
        },
        data() {
            return {
                isDefault: '',
                modeCity: false,
                modeCityValue: '',
                radio: 1,
                isActive: false,
                uuid: '',
                addressDetail: {consignee: '', mobile: '', address: '',},
                provinceId: '',
                cityId: '',
                regionId: '',
                streetId: '',
                provinceName: '',
                cityName: '',
                regionName: '',
                streetName: '',
                addressParams: {},
                clickFlag: false,//是否点击地址框
            }
        },
        mounted() {
            this.isDefault = this.$route.query.isDefault || '';
            this.uuid = this.$route.query.uuid;
            if(this.uuid) {
                this.getData()
            }
        },
        methods: {
            goBack() {
                this.$router.replace({'path': '/my/manager?from=uc'})
            },
            dele() {
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
                                    if(o.uuid === this.uuid) {
                                        localStorage.removeItem('chooseAddress')
                                    }
                                }
                                this.$http.get('/usercenter/customeraddress/delDeliveryAddress', {uuid: this.uuid}, res => {
                                    this.$router.push({'path': '/my/manager'})
                                })
                            }
                        }
                    ]
                })
            },
            getData() {
                this.$http.post('/usercenter/customeraddress/getAddressByuuid', {uuid: this.uuid}, res => {
                    this.addressDetail = res;
                    this.modeCityValue = res.area;
                    this.provinceId = res.province;
                    this.cityId = res.city;
                    this.regionId = res.region;
                    this.streetId = res.street;
                    if(res.isDefault == '0') {
                        this.isActive = false;
                    } else {
                        this.isActive = true;
                    }
                })
            },
            validMobile() {
                if(/\D/.test(this.addressDetail.mobile)) {
                    this.$dialog.toast({
                        mes: '只能输入数字',
                        timeout: 1000
                    })
                    this.addressDetail.mobile = ''
                }
            },
            // getProvince() {
            //   this.$http.post('/usercenter/region/getAllProvince', {}, res => {
            //     res.map(o => {
            //       if (parseInt(this.provinceId) == parseInt(o.uuid)) {
            //         this.provinceName = o.provinceName
            //       }
            //     })
            //     this.modeCityValue += this.provinceName + ' '
            //     this.getCity(this.provinceId, this.cityId)
            //   })
            // },
            // getCity(m, n) {
            //   if (parseInt(m) < 10 && m.length < 2) {
            //     m = '0' + m
            //   }
            //   this.$http.post('/usercenter/region/getCitysByProvinceUuid', {
            //     provinceUuid: m
            //   }, res => {
            //     res.map(o => {
            //       if (parseInt(n) == parseInt(o.uuid)) {
            //         this.cityName = o.cityName
            //       }
            //     })
            //     this.modeCityValue += this.cityName + ' '
            //     this.getRegion(this.cityId, this.regionId)
            //   })
            // },
            // getRegion(m, n) {
            //   if (m < 10) {
            //     m = '0' + m
            //   }
            //   this.$http.post('/usercenter/region/getRegionsByCityUuid', {
            //     cityUuid: m
            //   }, res => {
            //     res.map(o => {
            //       if (parseInt(n) == parseInt(o.uuid)) {
            //         this.regionName = o.regionName
            //       }
            //     })
            //     this.modeCityValue += this.regionName + ' '
            //     this.getStreet(this.regionId, this.streetId)
            //   })
            // },
            // getStreet(m, n) {
            //   if (m < 10) {
            //     m = '0' + m
            //   }
            //   this.$http.post('/usercenter/region/getStreetsByRegionUuid', {
            //     regionUuid: m
            //   }, res => {
            //     res.map(o => {
            //       if (parseInt(n) == parseInt(o.uuid)) {
            //         this.streetName = o.streetName
            //       }
            //     })
            //     this.modeCityValue += this.streetName + ' '
            //   })
            // },
            resultCtiy(ret) { //地区返回值
                this.modeCityValue = ret.provance.name + ' ' + ret.city.name + ' ' + ret.area.name + ' ' + ret.region.name;
                var ids = ret.provance.id + ' ' + ret.city.id + ' ' + ret.area.id + ' ' + ret.region.id;

                this.addressParams.province = ret.provance.id
                this.addressParams.city = ret.city.id
                this.addressParams.region = ret.region.id
                this.addressParams.street = ret.area.id

                this.clickFlag = true

            },
            save() {

                var validData = [
                    {value: this.addressDetail.consignee, errTip: '收货人不能为空', pattern: /\S/},
                    {value: this.addressDetail.mobile, errTip: '请输入正确的联系电话!', pattern: /^1[345678][0-9]{9}$/},
                    {value: this.modeCityValue, errTip: '请选择所在地区!', pattern: /\S/},
                    {value: this.addressDetail.address, errTip: '请输入详细地址!', pattern: /\S/},
                ]
                let valide = true
                validData.map((x) => {
                    if(!x.pattern.test(x.value)) {
                        valide = false
                        this.$dialog.alert({mes: x.errTip})
                        return false;
                    }
                })
                if(!valide) return false


                if(!this.clickFlag) {
                    this.addressParams.province = this.provinceId
                    this.addressParams.city = this.cityId;
                    this.addressParams.region = this.regionId;
                    this.addressParams.street = this.streetId;
                }
                this.modeCityValue.split(' ').join('')

                this.addressParams.area = this.modeCityValue.split(' ').join('');
                if(this.uuid) {
                    this.addressParams.uuid = this.uuid;
                }
                this.addressParams.consignee = this.addressDetail.consignee
                this.addressParams.mobile = this.addressDetail.mobile
                this.addressParams.address = this.addressDetail.address
                this.addressParams.isDefault = this.isActive ? '1' : '0'
                this.addressParams.zipcode = ''
                this.addressParams.telephone = ''
                this.addressParams.addresstitle = ''

                var param = JSON.stringify(this.addressParams)
                var data = {}
                data.param = param
                if(this.uuid) {
                    this.$http.post('/usercenter/customeraddress/doEdit', data, res => {
                        if(res.status === '1') {
                            this.$dialog.alert({
                                mes: '编辑成功!', callback: () => {
                                    this.getData()
                                    this.modeCityValue = '';
                                    this.$router.push({path: '/my/manager'})
                                }
                            })
                        } else {
                            this.$dialog.alert({mes: '编辑失败,请核对!'})
                        }
                    })
                } else {
                    this.$http.post('/usercenter/customeraddress/addAddress', data, res => {
                        if(res.status === '1') {
                            this.$dialog.alert({
                                mes: '新增成功!', callback: () => {
                                    this.getData()
                                    this.modeCityValue = '';
                                    this.$router.push({path: '/my/manager'})
                                }
                            })
                        } else {
                            this.$dialog.alert({mes: '新增出错，请核对!'})
                        }
                    })
                }

            },
            changeDefault() {
                this.isActive = !this.isActive;
            },
        }
    }
</script>
