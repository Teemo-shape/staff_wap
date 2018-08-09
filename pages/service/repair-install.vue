<template>
  <div class="repair" @click="listShow=false">
    <yd-navbar :title="type==1?'安装申请':'维修申请'">
      <router-link to="/service" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <img :src="type==1?'/img/install.jpg':'/img/repair.jpg'" class="repairImg">
    <div class="info">
      <h2>个人信息</h2>
      <yd-cell-group class="form">
        <yd-cell-item>
          <span slot="left">联系人<i>*</i></span>
          <yd-input slot="right" required v-model="name" max="12" placeholder="输入联系人" autocomplete="off"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">联系电话<i>*</i></span>
          <yd-input slot="right" required v-model="phone" max="11" placeholder="输入联系电话" regex="mobile"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">图片验证码<i>*</i></span>
          <yd-input slot="right" required v-model="imgCode" max="4" placeholder="图片验证码" type="text" regex="[A-Za-z0-9]{4}" @keyup.native="chkImgCd" id="imgCode"></yd-input>
          <div class="code" slot="right"><img :src="codeImg" alt="" class="codeImg" @click="getCaptchakey" id="codeImg"></div>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">短信验证码<i>*</i></span>
          <yd-input slot="right" required v-model="msgCode" max="6" placeholder="短信验证码" regex="\d{6}"></yd-input>
          <yd-sendcode initStr="发送验证码" second="60" runStr="已发送{%s}" resetStr="获取验证码" slot="right" v-model="start" @click.native="sendCode" type="hollow" :class="imgCode.length>=4?'sendcode bn':' sendcode'"></yd-sendcode>
        </yd-cell-item>
        <yd-cell-item arrow>
          <span slot="left">所在地区<i>*</i></span>
          <yd-input slot="right" ref="menuItem" @click.native="areaShow=true" v-model="modeCityValue" readonly placeholder="请选择地址"></yd-input>
        </yd-cell-item>
        <yd-cell-item class="street">
          <span slot="left">详细地址<i>*</i></span>
          <yd-textarea slot="right" required placeholder="详细地址" maxlength="100" v-model="street"></yd-textarea>
        </yd-cell-item>
      </yd-cell-group>
      <cityselect v-model="areaShow" :done="resultCity" provance="" city="" area=""></cityselect>
    </div>
    <div class="need">
      <h2>{{type=='1'?'安装':'维修'}}服务需求</h2>
      <yd-cell-group class="form">
        <yd-cell-item arrow type="label">
          <span slot="left">产品信息<i>*</i></span>
          <select slot="right" :style="category==''?'color:#cdcdce':''" v-model="category" @change="productVersion='';">
            <option value="">请选择产品类别</option>
            <option v-for="(a,b) in catList" :key="b" :value="a.categoryName">{{a.categoryName}}</option>
          </select>
        </yd-cell-item>
        <yd-cell-item class="versionList">
          <span slot="left">
            产品型号<i>*</i>
          </span>
          <a slot="left" @click="howGetShow=true;" class="howGet">如何查找您的产品型号？</a>
          <yd-input slot="right" required v-model="productVersion" placeholder="输入产品型号" @keyup.native="getProductVersion($event)"></yd-input>
          <ul slot="right" v-show="listShow">
            <li v-for="(v,i) in vlist" :key="i" :data-id="v.uuid" @click.stop="val(v.name)">{{v.name}}</li>
          </ul>
        </yd-cell-item>
        <yd-cell-item class="ordertime" arrow>
          <span slot="left">上门时间<i>*</i></span>
          <div slot="right" class="ran" @click="timeShow=true">
            <div class="datetime-input">{{datetime}}</div>
            <span>{{range}}</span>
          </div>
        </yd-cell-item>
        <yd-cell-item class="file" v-show="type==2">
          <span slot="left">故障图片/视频</span>
          <yd-input slot="right" type="text" readonly :placeholder="imgList.length>0?'':'图片最多三张/视频最大20M'"></yd-input>
          <ul slot="right">
            <li v-for="(i,x) in imgList" slot="left" :key="x">
              <img :src="i.filePath" alt="" v-if="i.fileType.indexOf('video')<0">
              <video autoplay :src="i.filePath" v-else></video>
              <span @click.stop="remove(i.filePath)">×</span>
              <a v-show="i.fileType.indexOf('video')>-1">
                <img src="/img/howGet/videoPause.png" alt="">
              </a>
            </li>
          </ul>
          <input type="file" slot="right" value="上传图片" class="hidden" accept="image/*,video/*,video/3gpp" @change.stop="uploadImg" id="file" ref="file">
          <img slot="right" src="/img/camera.png" @click="$refs.file.click()"  class="camera"/>
        </yd-cell-item>
        <yd-cell-item class="des-pro">
          <span slot="left">问题描述<i>*</i></span>
          <yd-textarea slot="right" required placeholder="请输入问题描述" maxlength="100" v-model="description"></yd-textarea>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <div class="submit">
      <a @click.stop="save">提交申请</a>
    </div>
    <!-- <calendar :limit="firstLimit" @getValue="getValue"></calendar> -->
    <yd-popup v-model="timeShow" position="bottom" height="21.5rem" class="service-time">
      <div class="title">
        <span class="cancel" @click="timeShow=false">取消</span>
        <h2>选择上门时间</h2>
        <span class="ok" @click="timeShow=false">确认</span>
      </div>
      <calendar :isRed="true" @getValue="getValue"></calendar>
      <div class="range">
        <button v-for="(i,x) in rList" :disabled=i.disabled :class="{'active':i.active==true}" :key="x" @click.stop="getRange(i)">{{i.key}}</button>
      </div>
    </yd-popup>
    <!-- 提示信息 -->
    <yd-popup v-model="howGetShow" position="center" height="22rem" class="howGetShow">
      <h1>如何查找您的产品型号<span @click="howGetShow=false;">X</span></h1>
      <div class="content">
        <h2>一、电视的产品型号查找方法：</h2>
        <p>
          找到<span>电视背面或者包装箱上白色条码贴纸</span>，如下图红色框部分就是电视的产品型号。不同时期生产的产品型号位置可能略有差异，铁粉们仔细查看一定可以找到哒。
          <img src="/img/howGet/h1.png" alt="">
          <img src="/img/howGet/h2.png" alt="">
        </p>
        <h2>二、冰洗空的产品型号查找方法：</h2>
        <p>
          找到<span>冰箱、洗衣机或空调机身的中国能效贴纸或者包装箱上白色条码贴纸</span>，如下图红色框部分就是产品型号了。不同时期生产的产品型号位置可能略有差异，铁粉们仔细查看一定可以找到哒。
          <img src="/img/howGet/h3.png" alt="">
          <img src="/img/howGet/h4.png" alt="">
        </p>
        <h2>三、全品类通用型查找产品型号方式：</h2>
        <p>
          以电视产品为例，<span>找到产品的纸质说明书，说明书封面就有产品型号</span>，根据产品的尺寸就可以确认您的电视型号了
          <img src="/img/howGet/h5.png" alt="">
          <b>更多服务请关注“TCL官方服务”</b>
          <img src="/img/howGet/h6.png" alt="">
        </p>
      </div>
      <div class="bottom" @click="howGetShow=false;">
          <p>我知道了</p>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import { CitySelect } from '@/components/cityselect';
import { calendar } from '@/components/calendar';
//import { Daterange } from '@/components/daterange';
export default {
  layout: 'empty',
  head() {
    return {
      title: 'TCL官网-安装/维修',
    }
  },
  components: {
    'cityselect': CitySelect,
    'calendar': calendar,
    //'daterange': Daterange
  },
  data() {
    return {
      selectValue: '',
      timeShow: false,
      type: this.$route.query.type == undefined ? 2 : (this.$route.query.type == 'repair' ? 2 : 1),//链接地址须添加type参数，2为维修，1为安装，若为空默认为维修
      name: '', phone: '', rand1: '', rand2: '', imgCode: '',
      codeImg: '', msgCode: '', street: '', catList: [],
      category: '', productVersion: '', description: '',
      start: false, areaShow: false, areas: '',
      modeCityValue: '', listShow: false, vlist: [],
      imgList: [], dateShow: false, datetime: '',
      yearFormat: '<span style="color:#F00;">{value}<i style="font-size: 12px;margin-left: 1px;">年</i></span>',
      monthFormat: '<span style="color:#0BB20C;">{value}<i style="font-size: 12px;margin-left: 1px;">月</i></span>',
      dayFormat: '<span style="color:#FFB400;">{value}<i style="font-size: 12px;margin-left: 1px;">日</i></span>',
      range: '',
      rList: [
        { key: '08:00-10:00',disabled:false, active: false },
        { key: '10:00-12:00',disabled:false, active: false },
        { key: '12:00-14:00',disabled:false, active: false },
        { key: '14:00-16:00',disabled:false, active: false },
        { key: '16:00-18:00',disabled:false, active: false }],
      flag: true, arr1: [], arr2: [],howGetShow:false,
    }
  },
  mounted() {
    this.getCaptchakey();
    this.getProductCategory();
    this.current()
    this.getInfo()
  },
  methods: {
    getValue(v) {
      var date = new Date()
      var now = this.$utils.formatDate(date)
      this.datetime = v
      if(this.datetime>now){
        this.rList.map(x=>x.disabled = false)
      }else{
        this.current()
      }
      
    },
    getInfo() {
      //姓名和手机号码   
      /* this.$http.get('/tclcustomer/userInfo', { auth: 1 }, res => {
          if (res.code == '0' && res.data) {
              this.phone = res.data.bindPhone || ''
              this.name = res.data.nickName || ''
          }
      }) */
      //地址
      this.$http.post('/usercenter/customeraddress/toCustomerAddressKuyu', {}, res => {
        if (res.status == 1 && res.data && res.data.length > 0) {
          let add = res.data.filter(x => x.isDefault == 1)
          add = add.length > 0 ? add[0] : res.data[0]
          this.street = add.address || ''
          this.modeCityValue = add.area || ''
          this.phone = add.mobile
          this.name = add.consignee

          //对地址进行加工，添加空格，因为提交格式所需。这些代码要保留。
          this.$http.post('/usercenter/region/getAllProvince', {}, res => {
            res.map(o => {
              this.arr1.push(o);
            })
            this.arr1.map(o => {
              if (o.uuid == add.province) {
                this.modeCityValue = o.provinceName
              }
            })
            this.arr2 = [add.province, add.city, add.region, add.street];
            this.$http.post('/usercenter/region/getCitysByProvinceUuid', { provinceUuid: this.arr2[0] }, res => {
              res.map(o => {
                if (o.uuid == this.arr2[1]) {
                  this.modeCityValue += ' ' + o.cityName
                }
              })
              this.$http.post('/usercenter/region/getRegionsByCityUuid', { cityUuid: this.arr2[1] }, res => {
                res.map(o => {
                  if (o.uuid == this.arr2[2]) {
                    this.modeCityValue += ' ' + o.regionName
                  }
                })
                this.$http.post('/usercenter/region/getStreetsByRegionUuid', { regionUuid: this.arr2[2] }, res => {
                  res.map(o => {
                    if (o.uuid == this.arr2[3]) {
                      this.modeCityValue += ' ' + o.streetName
                    }
                  })
                })
              })
            })
          })
        }
      })
    },
    current() {
      var date = new Date();
      /* var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate; */

      this.datetime = this.$utils.formatDate(date)//currentdate
      var hours = date.getHours()
      // console.log(hours)
      //初始化时间段的active
      var index = -1;
      if(hours>=0 && hours<6){
        index = -1
      }else if(hours>=6&&hours<8){
        index = 0
      }else if(hours>=8&&hours<10){
        index = 1
      }else if(hours>=10&&hours<12){
        index = 2
      }else if(hours>=12&&hours<14){
        index = 3
      }else if(hours>=14&&hours<24){
        index = -1
      }
      this.rList.map(x=>x.active = false)
      if(index<=3){
        this.rList[index+1].active = true;
        this.range = this.rList.filter(x=>x.active)[0].key    //时间段初始化
      }
      this.setDisabled(index)
    },
    setDisabled(index){
       this.rList.map((x,i) => {
         if(i<=index){
           x.disabled = true;
         }
       })
    },
    getRange(n) {
      this.range = n.key
      this.rList.map(x => x.active = false)
      n.active = true
    },
    //获取图形验证码
    getCaptchakey() {
      this.rand1 = Math.random();
      //console.log(window.location.host + '/rest/getCustomerRegCode?img-key=' + this.rand1)
      this.codeImg = '/rest/getCustomerRegCode?img-key=' + this.rand1
    },
    //验证图形验证码
    chkImgCd() {
      var o = document.querySelectorAll('#imgCode')[0];
      if (this.imgCode.replace(/(^\s*)|(\s*$)/g, '').length == 4) {
        this.$http.post('/tclcustomerregist/checkValidateCode', {
          'img-key': this.rand1,
          inputcode: this.imgCode
        }, res => {
          if (res.code == '0') {
            o.querySelector('.yd-input-success').style.display = 'block'
            o.querySelector('.yd-input-error').style.display = 'none'
          } else {
            o.querySelector('.yd-input-error').style.display = 'block'
            o.querySelector('.yd-input-success').style.display = 'none'
          }
        })

      }
    },
    //发送短信验证码
    sendCode() {
      if (this.phone == '') {
        this.$dialog.alert({ mes: '手机号码不能为空' });
        return false;
      } else if (this.imgCode == '') {
        this.$dialog.alert({ mes: '图形验证码不能为空' });
        return false;
      }
      this.rand2 = Math.random();
      var obj = {
        "captchakey": this.rand1,
        "captchadata": this.imgCode,
        "username": this.phone,
        "type": 3,
        "img-key": this.rand2
      }
      this.$http.post('/tclcustomerregist/sendMessagetoPhoneOrEmail', obj, res => {
        if (res.code == '0') {
          this.start = true;
          //setTimeout(() => { this.getCaptchakey() }, 60 * 1000)
        } else {
          this.$dialog.alert({ mes: res.msg });
          this.getCaptchakey();
          return false;
        }
      })
    },
    //获取产品类别
    getProductCategory() {
      this.$http.get('/servicecenter/getProductCategory', {}, res => {
        if (res.data) {
          res.data.map((o) => {
            this.catList.push(o)
          })
        }
      });
    },
    //获取产品型号
    getProductVersion(e) {
      if (this.category == '') {
        // console.log(e.currentTarget.firstElementChild)
        e.currentTarget.firstElementChild.blur()
        this.productVersion = ''
        this.$dialog.alert({ mes: '请先选择产品类别' });
        return false;
      }
      if (this.productVersion == '') {
        //this.$dialog.alert({mes: '产品型号不允许为空'});
        this.listShow = false;
        return false;
      }
      this.vlist = [];
      // this.$http.get('/servicecenter/matchProductVersion', {
      this.$http.get('/servicecenter/queryProductModel', {
        productVersion: this.productVersion,
        cateName: this.category
      }, res => {
        if (res.retData.length > 0) {
          this.listShow = true;
          this.vlist = res.retData
        } else {
          this.listShow = false;
        }
      });
    },
    //选择产品型号
    val(v) {
      this.productVersion = v
      this.listShow = false;
    },
    resultCity(ret) {
      //console.log(ret);
      this.modeCityValue = ret.provance.name + ' ' + ret.city.name + ' ' + ret.area.name + ' ' + ret.region.name;
    },
    //上传故障图片
    uploadImg() {
      var videoList = [],imageList=[];
      this.imgList.map(x=>{
        if(x.fileType.indexOf('video')>-1){
          videoList.push(x)
        }else{
          imageList.push(x)
        }
      })
      // console.log(this.$refs['file'].files[0].type)
      if(videoList.length>0 && this.$refs['file'].files[0].type.indexOf('video')>-1){
        this.$dialog.alert({ mes: '最多只能上传3张图片和1个视频' })
        this.$refs['file'].value = '';
        return false;
      }else{
        if(imageList.length>2 && this.$refs['file'].files[0].type.indexOf('image')>-1){
          this.$dialog.alert({ mes: '最多只能上传3张图片和1个视频' })
          this.$refs['file'].value = '';
          return false
        }
      }
      this.$http.upload('/servicecenter/upload', { uploadID: 'file',maximgsize:10,maxvideosize:20}, res => {
        // alert(JSON.stringify(res))
        if (res.code == 0 && res.data && res.data.filePath) {
          this.imgList.push(res.data)
        } else {
          this.$dialog.alert({ mes: res.msg });
          return false;
        }
      });
    },
    //删除图片
    remove(o) {
      if (o != '') {
        this.$http.get('/fileupload/delete',{path:o},res=>{})
        this.imgList.map((x,i)=>{
          if(o === x.filePath){
            this.imgList.splice(i, 1)
          }
        })
      }
    },
    //提交申请
    save() {
      function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
      }
      if (trim(this.name) == '') {
        this.$dialog.alert({ mes: '请填写联系人' });
        return false
      } else if (trim(this.phone) == '') {
        this.$dialog.alert({ mes: '请填写联系方式' });
        return false
      } else if (!(/1[3|5|7|8]\d{9}/.test(this.phone))) {
        this.$dialog.alert({ mes: '请填写正确的联系方式' });
        return false
      } else if (trim(this.imgCode) == '') {
        this.$dialog.alert({ mes: '请填写图形验证码' });
        return false
      } else if (trim(this.msgCode) == '') {
        this.$dialog.alert({ mes: '请填写短信验证码' });
        return false
      } else if (trim(this.modeCityValue) == '') {
        this.$dialog.alert({ mes: '请选择所在地址' });
        return false
      } else if (trim(this.street) == '') {
        this.$dialog.alert({ mes: '请填写详细地址' });
        return false
      }else if (this.range == '') {
        this.$dialog.alert({ mes: '请选择上门日期和时间' });
        return false
      }else if (this.category == '') {
        this.$dialog.alert({ mes: '请选择产品类别' });
        return false
      } else if (trim(this.productVersion) == '') {
        this.$dialog.alert({ mes: '请输入产品型号' });
        return false
      } else if (trim(this.description) == '') {
        this.$dialog.alert({ mes: '请输入问题描述' });
        return false
      } else {
        this.flag = false;
        var urls = [];   //图片
        var videoUrl = []; //视频
        this.imgList.map(o => {
          if(o.fileType.indexOf('video')>-1){
            videoUrl.push(o.filePath)
          }else{
            urls.push(o.filePath)
          }
        })
        var m = this.modeCityValue.split(' '),
          params = {
            key: this.rand2, linkman: this.name, code: this.msgCode, address: this.street,
            mobile: this.phone, pics: this.type == 1 ? '' : urls.join(','),
            videos:this.type==1?'':videoUrl,
            province: m[0] || '', city: m[1] || '',
            region: m[2] || '', street: m[3] || '',
            productCategoryName: this.category,
            productSubCategoryName: '',//?
            serviceType: this.type,//1:安装2:维修
            description: this.description, applyTime: this.datetime,
            applyTimeType: this.range, productSn: this.productVersion
          }
        this.$http.post('/servicecenter/saveService', params, res => {
          if (res.code == 0) {
            this.$dialog.alert({
              mes: '您的申请已经提交成功,我们会尽快和您取得联系...', callback: () => {
                window.location.reload();
              }
            });
          } else if (res.code == '-4') {
            this.$dialog.alert({ mes: '短信验证码错误' });
            return false;
          } else {
            this.$dialog.alert({ mes: res.msg });
            return false;
          }
        });
      }
    }
  }
}
</script>
