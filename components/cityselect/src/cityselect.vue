<template>
    <div class="cityselect">
        <div class="yd-cityselect-mask" v-show="show" @click.stop="close"></div>
        <div class="yd-cityselect" :class="show ? 'yd-cityselect-active' : ''">
            <div class="yd-cityselect-header">
                <p class="yd-cityselect-title">所在地区</p>
                <div v-show="ready" class="yd-cityselect-nav">
                    <a href="javascript:;" v-show="!!nav.txt1" @click.stop="backoffView(0)" :class="nav.index == 0 ? 'yd-cityselect-nav-active' : ''">{{nav.txt1}}</a>
                    <a href="javascript:;" v-show="!!nav.txt2" @click.stop="backoffView(1)" :class="nav.index == 1 ? 'yd-cityselect-nav-active' : ''">{{nav.txt2}}</a>
                    <a href="javascript:;" v-show="!!nav.txt3" @click.stop="forwardView(true)" :class="nav.index == 2 ? 'yd-cityselect-nav-active' : ''">{{nav.txt3}}</a>
                    <a href="javascript:;" v-show="!!nav.txt4" @click.stop="forwardView(true)" :class="nav.index == 3 ? 'yd-cityselect-nav-active' : ''">{{nav.txt4}}</a>
                </div>
            </div>
            <div v-show="!ready" class="yd-cityselect-loading">加载中</div>
            <ul v-show="ready" class="yd-cityselect-content" :class="activeClasses">
                <li class="yd-cityselect-item" ref="provanceBox">
                    <div class="yd-cityselect-item-box">
                        <a href="javascript:;" :class="item.n == activeProvance ? 'yd-cityselect-item-active' : ''" v-for="(item,index) in citys2" :key="index" @click.stop="chooseProvance(item.provinceName, item.uuid)">
                            <span :id="item.uuid">{{item.provinceName}}</span>
                        </a>
                    </div>
                </li>
                <li class="yd-cityselect-item" ref="cityBox">
                    <div class="yd-cityselect-item-box">
                        <a href="javascript:;" :class="item.n == activeCity ? 'yd-cityselect-item-active' : ''" v-for="(item,index) in cityArray2" :key="index" @click.stop="chooseCity(item.cityName, item.uuid)">
                            <span :id="item.uuid">{{item.cityName}}</span>
                        </a>
                    </div>
                </li>
                <li class="yd-cityselect-item" ref="areaBox">
                    <div class="yd-cityselect-item-box">
                        <a href="javascript:;" :class="item == activeArea ? 'yd-cityselect-item-active' : ''" v-for="(item,index) in areaArray2" :key="index" @click.stop="chooseArea(item.regionName, item.uuid)">
                            <span :id="item.uuid">{{item.regionName}}</span>
                        </a>
                    </div>
                </li>
                <li class="yd-cityselect-item" ref="areaBox">
                    <div class="yd-cityselect-item-box">
                        <a href="javascript:;" :class="item == activeReg ? 'yd-cityselect-item-active' : ''" v-for="(item,index) in areaReg" :key="index" @click.stop="chooseJieDao(item.streetName, item.uuid)">
                            <span :id="item.uuid">{{item.streetName}}</span>
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { addClass, removeClass, getScrollview } from './ut';
var Citys = [];
export default {
    name: 'cityselect',
    data() {
        return {
            citys: Citys,
            citys2: [],
            cityArray2: [],
            areaArray2: [],
            areaReg: [],
            show: this.value,
            nav: {
                index: 0,
                txt1: '请选择',
                txt2: '',
                txt3: ''
            },
            activeProvance: '',
            activeCity: '',
            activeArea: '',
            activeReg: '',
            cityArray: [],
            areaArray: [],
            activeClasses: '',
            itemHeight: 40,
            provinceUuid: '05', //省
            cityUuid: 154,       //市
            regionUuid: 1385, //区县
            areaUuid: 15845,  //乡镇
        }
    },
    props: {
        ready: {
            type: Boolean,
            default: true
        },
        provance: String,
        city: String,
        area: String,
        region: String,
        done: Function,
        value: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.getSheng();
    },
    watch: {
        value(val) {
            if (this.isIOS) {
                if (val) {
                    addClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
                } else {
                    removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');
                }
            }

            this.show = val;
        },
        ready(val) {
            val && setTimeout(this.init, 0);
        }
    },
    methods: {
        init() {
            if (!this.ready) return;

            this.setDefalutValue();

            this.scrollView = getScrollview(this.$el);

            this.isIOS = !!(window.navigator && window.navigator.userAgent || '').match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        },
        chooseProvance(name, id) {
            var self = this;
            this.getShi(id, function(data) {
            })

            this.nav.index = 1;
            this.nav.txt1 = this.activeProvance = name;
            this.provinceUuid = id;
            this.nav.txt2 = '请选择';
            this.nav.txt3 = '';
            // this.cityArray = datas;
            this.activeCity = '';
        },
        chooseCity(name, id) {
            this.getQu(id, function(data) {

            })
            this.nav.txt2 = this.activeCity = name;
            this.cityUuid = id;
            this.activeArea = '';
            // if (datas.length <= 0) {
            //     this.returnValue();
            //     return;
            // }
            this.nav.txt3 = '请选择';
            this.nav.index = 2;
            //  this.areaArray = datas;
            this.forwardView(true);
        },
        chooseArea(name, id) {
            this.getJieDao(id, function(data) {

            })
            this.nav.txt3 = this.activeArea = name;
            this.regionUuid = id;
            this.activeReg = '';
            // if (datas.length <= 0) {
            //     this.returnValue();
            //     return;
            // }
            this.nav.index = 3;
            this.nav.txt4 = '请选择';
            //  this.areaArray = datas;
            this.forwardView(true);
        },
        chooseJieDao(name, id) {
            this.nav.txt4 = this.activeReg = name;
            this.areaUuid = id;
            this.returnValue();
        },

        setDefalutValue() {
            if (!this.provance) return;
            this.citys.every((item1, index1) => {
                if (item1.n == this.provance) {

                    const provanceBox = this.$refs.provanceBox;
                    provanceBox.scrollTop = index1 * this.itemHeight - provanceBox.offsetHeight / 3;

                    this.nav.index = 1;
                    this.nav.txt1 = this.activeProvance = this.provance;
                    this.nav.txt2 = '请选择';

                    const _cityData = this.cityArray = item1.c;

                    _cityData.every((item2, index2) => {

                        if (item2.n == this.city) {

                            const cityBox = this.$refs.cityBox;
                            cityBox.scrollTop = index2 * this.itemHeight - cityBox.offsetHeight / 3;

                            this.nav.txt2 = this.activeCity = this.city;

                            const _areaData = this.areaArray = item2.a;

                            const index3 = _areaData.indexOf(this.area);

                            if (_areaData.length > 0) {
                                this.nav.index = 2;
                                this.nav.txt3 = '请选择';
                                this.forwardView(false);
                            }

                            if (index3 > -1) {

                                const areaBox = this.$refs.areaBox;
                                areaBox.scrollTop = index3 * this.itemHeight - areaBox.offsetHeight / 3;

                                this.nav.txt3 = this.activeArea = this.area;
                            }

                            return false;
                        }
                        return true;
                    });
                    return false;
                }
                return true;
            });
        },
        returnValue() {
            this.done({
                provance: { name: this.activeProvance, id: this.provinceUuid },
                city: { name: this.activeCity, id: this.cityUuid },
                area: { name: this.activeArea, id: this.areaUuid },
                region: { name: this.activeReg, id: this.regionUuid }
            });
            this.close();
        },
        close() {
            this.isIOS && removeClass(this.scrollView, 'g-fix-ios-overflow-scrolling-bug');

            this.$emit('input', false);
            this.show = false;
        },
        backoffView(index) {
            this.nav.index = index;
            this.activeClasses = 'yd-cityselect-move-animate yd-cityselect-prev';
        },
        forwardView(animate) {
            this.activeClasses = (animate ? 'yd-cityselect-move-animate' : '') + ' yd-cityselect-next';
            if (this.nav.index >= 3) {
                this.activeClasses = (animate ? 'yd-cityselect-move-animate' : '') + ' yd-cityselect-next2';
            }
        },
        getSheng() {
            this.$http.get('/usercenter/region/getAllProvince', {}, res => {
                this.citys2 = res;
            })
        },
        getShi(provinceUuid, cb) {
            var params = {
                provinceUuid: provinceUuid
            }
            this.$http.get('/usercenter/region/getCitysByProvinceUuid', params, res => {
                this.cityArray2 = res;
                cb(res.data)
            })

        },
        getQu(id, cb) {
            var params = {
                cityUuid: id
            }
            this.$http.get('/usercenter/region/getRegionsByCityUuid', params, res => {
                this.areaArray2 = res;
                cb(res.data)
            })

        },
        getJieDao(id, cb) {
            var params = {
                regionUuid: id
            }
            this.$http.get('/usercenter/region/getStreetsByRegionUuid', params, res => {
                this.areaReg = res;
                cb(res.data)
            })

        }
    },
    mounted() {
        this.init();
    },
    destroyed() {
        this.close();
    }
}
</script>
