<template>
<div class="register">
  <yd-layout>
    <yd-navbar :title="mytit">
      <router-link to="/" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <yd-popup v-model="show" position="bottom" height="16.5rem;overflow:hidden">
      <div class="modal">
        <div class="title">
          <h4>T严选员工内购注册服务及协议</h4>
          <span class="close" @click="show=false">x</span>
        </div>
        <div class="content">
          <p>
              客户在接受商品订购与送货的同时，有义务遵守以下交易条款。您在T严选员工内购商城下订单之前或接受T严选员工内购商城送货之前，请您仔细阅读以下条款：</p>
              <strong>一、本站服务条款的确认和接纳</strong>
              <p>本站的各项电子服务的所有权和运作权归本站。本站提供的服务将完全按照其发布的服务条款和操作规则严格执行。用户必须完全同意所有服务条款并完成注册程序，才能成为本站的正式用户及TCL集团的普通会员。用户确认：本协议条款是处理双方权利义务的当然约定依据，除非违反国家强制性法律，否则始终有效。在下订单的同时，您也同时承认了您拥有购买这些产品的权利能力和行为能力，并且将您对您在订单中提供的所有信息的真实性负责。</p>
              <strong>二、服务简介</strong>
              <p>本站运用自己的操作系统通过国际互联网络为用户提供网络服务。同时，用户必须：</p>
              <p>1.自行配备上网的所需设备，包括个人电脑、调制解调器或其他必备上网装置。<br>2.自行负担个人上网所支付的与此服务有关的电话费用、网络费用。<br>3.基于本站所提供的网络服务的重要性，用户应同意：提供详尽、准确的个人资料；不断更新注册资料，符合及时、详尽、准确的要求。<br>4.为使您感受到更好的会员服务，TCL集团可能会委托相关合作方向您提供一部分会员服务而无须经过您的同意或特别告知您；对此，您完全理解并予以同意。</p>
              <strong>三、价格和数量</strong>
              <p>本站将尽最大努力保证您所购商品与网站上公布的价格一致，但价目表和声明并不构成要约。商品的价格都包含了增值税。如果发生了意外情况，在确认了您的订单后，由于供应商提价，税额变化引起的价格变化，或是由于网站的错误等造成商品价格变化，您有权取消您的订单，并希望您能及时通过电子邮件或电话通知本站客户服务部。</p>
              <p>由于市场变化及各种以合理商业努力难以控制的因素的影响，本站无法承诺用户通过提交订单所希望购买的商品都会有货，用户订购的商品如果发生缺货，用户和本站皆有权取消该订单。同时，本站保留对产品订购数量的限制权。</p>
              <strong>四、送货及费用</strong>
              <p>本站将会把产品送到您所指定的送货地址。所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。送货费用根据您选择的配送方式的不同而异。</p>
              <p>请清楚准确地填写您的真实姓名、送货地址及联系方式。因如下情况造成订单延迟或无法配送等，本站将不承担责任：</p>
              <p>1.客户提供错误信息和不详细的地址；<br>2.货物送达无人签收，由此造成的重复配送所产生的费用及相关的后果。<br>3.不可抗力，例如：自然灾害、交通戒严、突发战争等。</p>
              <strong>五、服务条款的修改</strong>
              <p>本站将可能不定期的修改本用户协议的有关条款，一旦条款及服务内容产生变动，本站将会在重要页面上提示修改内容。您应经常访问本页面了解这些内容，一旦接受本条款，即意味着您已经同时详细阅读并接受了服务条款的变动。</p>
              <p>如果不同意本站对条款内容所做的修改，用户可以主动取消获得的网络服务。</p>
              <strong>六、用户隐私制度</strong>
              <p>本站尊重并保护用户的个人隐私权。本站将以高度的勤勉、审慎义务对待用户的资料信息，除在如下情况下，本站依据您的个人意愿或法律的规定外，不会将这些信息对外披露或向第三方提供：</p>
              <p>1.经您事先同意，向第三方披露；<br>2.根据法律的有关规定，或者行政司法机构的要求，向第三方或者行政、司法机构披露；3.为提供您所要求的产品和服务，而必须向第三方分享您的个人信息；<br>4.其他本站根据法律、法规或者网站政策认为合适的披露。</p>
              <strong>七、用户的帐号，密码和安全性</strong>
              <p>用户一旦注册成功，成为本站的合法用户，将得到一个密码和用户名。您可随时根据指示改变您的密码。用户将对用户名和密码安全负全部责任。另外，每个用户都要对以其用户名进行的所有活动和事件负全责。用户若发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通告本站。</p>
              <strong>八、不承诺提供担保</strong>
              <p>用户个人对网络服务的使用承担风险。除非另有明确的书面说明，本站及其所包含的其他方式通过本站提供给您的全部信息、内容、商品（包括软件）和服务，是在“现状”和“现存”的基础上提供的。除非另有明确的书面说明，我们不对本网站的运营及包含在本网站上的信息、内容、商品（包括软件）或服务作任何形式的、明示或默示的声明或担保，且不会承诺其提供给用户的全部信息或发出的电子邮件没有病毒或其他有害成分。在适用法律所允许的最大限度内，我们不承诺所有明示或默示的担保，包括但不限于对适销性和满足特定目的的默示担保。您明确同意自担风险使用本网站。</p>
              <strong>九、责任限制</strong>
              <p>本站对因不可抗力或其他无法控制的原因（如本站销售服务系统异常或无法使用导致网上交易无法完成或丢失有关的信息、记录等），应尽可能合理地协助处理善后事宜，努力使客户免受经济损失。用户因使用本站而引起的损害或经济损失，本站将依据相应的法律规定承担合理的责任，但承担的全部责任均不超过用户所购买的与该索赔有关的商品价格。</p>
              <strong>十、对用户信息的存储和限制</strong>
              <p>本站有判定用户的行为是否符合本站服务条款的要求和精神的保留权利，如果用户违背了服务条款的规定，本站有中断对其提供网络服务的权利。对有违反法律法规、捏造事实、恶意诋毁等行为的，本站有停止传输并删除其信息，禁止用户发言，限制用户订购，注销用户账户并向相关机关进行披露。</p>
              <strong>十一、用户管理</strong>
              <p>用户单独承担发布内容的责任。用户对服务的使用是根据所有适用于本站的国家法律、地方法律和国际法律标准的。用户必须遵循：</p>
              <p>1.从中国境内向外传输技术性资料时必须符合中国有关法规。<br>
              2.使用网络服务不作非法用途。<br>
              3.不干扰或混乱网络服务。<br>
              4.遵守所有使用网络服务的网络协议、规定、程序和惯例。</p>
              <p>用户须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐性的、伤害性的、庸俗的，淫秽等信息资料。</p>
              <p>另外，用户也不能传输何教唆他人构成犯罪行为的资料；不能传输助长国内不利条件和涉及国家安全的资料；不能传输任何不符合当地法规、国家法律和国际法律的资料。</p>
              <p>未经许可而非法进入其它电脑系统是禁止的。</p>
              <p>若用户的行为不符合以上提到的服务条款，本站将作出独立判断立即取消用户服务帐号。</p>
              <p>用户需对自己在网上的行为承担法律责任。用户若在本站上散布和传播反动、色情或其他违反国家法律的信息，本站的系统记录有可能作为用户违反法律的证据。</p>
              <strong>十二、保障用户</strong>
              <p>同意保障和维护本站全体成员的利益，负责支付由用户使用超出业务范围引起的律师费用，违反服务条款的损害补偿费用等。</p>
              <strong>十三、终止服务</strong>
              <p>在下列情况下，本站可以通过注销账户的方式终止服务，同时保留对用户的违法行为追究法律责任的权利：</p>
              <p>1.用户违反法律法规及本协议相关条款规定；<br>
              2.用户注册信息中的内容虚假；<br>
              3.用户提供的注册信息填写的联系方式不存在或无效；<br>
              4.本协议条款更新时，用户明示不愿接受新的条款；<br>
              5.用户对本站实施欺诈、胁迫、恶意攻击等行为；<br>
              6.本站认为需要终止服务的其他情况。</p>
              <strong>十四、通告</strong>
              <p>所有发给用户的通告都可通过重要页面的公告或电子邮件或常规的信件传送。用户协议条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</p>
              <strong>十五、参与广告策划</strong>
              <p>用户在他们发表的信息中加入宣传资料或参与广告策划，在本站的免费服务上展示他们的产品，任何这类促销方法，包括运输货物、付款、服务、商业条件、担保及与广告有关的描述都只是在相应的用户和广告销售商之间发生。本站不承担任何责任，本站没有义务为这类广告销售负任何一部分的责任。</p>
              <strong>十六、网络服务内容的所有权</strong>
              <p>本站定义的网络服务内容包括：文字、软件、声音、图片、录象、图表、广告中的全部内容；电子邮件的全部内容；本站为用户提供的其他信息。所有这些内容受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在本站和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。本站所有的文章版权归原文作者和本站共同所有，任何人需要转载本站的文章，必须征得原文作者或本站授权。</p>
              <strong>十七、法律管辖和适用</strong>
              <p>本协议的订立、执行和解释及争议的解决均应适用中国法律。</p>
              <p>如发生本站服务条款与中国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它合法条款则依旧保持对用户产生法律效力和影响。</p>
              <p>本协议的规定是可分割的，如本协议任何规定被裁定为无效或不可执行，该规定可被删除而其余条款应予以执行。</p>
              <p>如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向本站所在地的人民法院提起诉讼。</p>
        </div>
        <div class="btn-bottom">
          <yd-button size="large" type="hollow" @click.native="$router.push({path:'login'})" class="mybtn">不同意</yd-button>
          <yd-button size="large" type="danger" @click.native="show=false" class="mybtn">同意</yd-button>
        </div>
      </div>
    </yd-popup>
    <div class="container">
      <div class="mod1"  v-show="mod1">
        <div class="user">
          <p class="name">帐号</p>
          <yd-input v-model="user" max="30" :placeholder="tip" :regex="type==1?'mobile':'email'"></yd-input>
        </div>
        <!--<p class="tip mgt24">忘记{{way1}}的员工可使用<a @click="chg(way2)">{{way2}}申请</a></p>-->
          <p class="tip red mgt24" v-show="noUser">{{ifuser}}</p>
        <yd-button size="large" :disabled="disabled" class="next-btn" type="danger" @click.native="validate">{{btnTxt}}</yd-button>
        <yd-button size="large" class="mgt20" type="hollow" @click.native="$router.push({path:'/'})" v-show="back">返回首页</yd-button>
      </div>
      <div class="mod2" v-show="mod2">
        <div v-if="isSecond">
          <yd-cell-group class="imgcodeBox">
            <yd-cell-item style="padding-left:0;">
            <yd-input slot="left" v-model.trim="imgcode" max="4" placeholder="请输入验证码"></yd-input>
            <img slot="right" :src="codeSrc" alt="验证码" @click="getCode">
                </yd-cell-item>
          </yd-cell-group>
          <p class="tip">请输入图片验证码</p>
        </div>
        <yd-cell-group class="mgt50">
          <yd-cell-item>
            <input type="text" slot="right" placeholder="请输入验证码" v-model="code" @keyup="checkCode">
            <yd-sendcode slot="right"
                         v-model="start"
                         @click.native="sendCode"
                         type="danger"
                         init-str="获取验证码"
                         run-str="{%s}秒"
                         reset-str="再次获取"
            ></yd-sendcode>
          </yd-cell-item>
        </yd-cell-group>
        <p class="tip">请输入{{user}}收到的验证码</p>
        <yd-button size="large" :disabled="dis1" class="mgt150" type="danger" @click.native="mod2=false;mod3=true">下一步</yd-button>
      </div>
      <div class="mod3" v-show="mod3">
        <div class="user">
            <p class="name"><i style="color: #ff4545;">*</i>密码</p>
          <yd-input type="password" v-model="pwd" max="20" placeholder="请输入密码"></yd-input>
        </div>
        <div class="user mgt24">
          <p class="name"><i style="color: #ff4545;">*</i>再次输入</p>
          <yd-input type="password" v-model="repwd" max="20" placeholder="请再次输入相同的密码"></yd-input>
        </div>
        <p class="tip mgt20">密码长度8~16位，数字、字母、字符至少包含两种</p>
        <yd-button size="large" class="next-btn" type="danger" @click.native="ok()" :disabled="dis2">确定</yd-button>
      </div>
    </div>
  </yd-layout>
</div>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        user:'',
        idNumber: '',
        //idShow:false,
        noUser:false,
        tip: '请输入TCL员工邮箱',
        way1:'邮箱',
        way2:'手机号',
        btnTxt:'点击完成验证',
        back:false,
        mytit:'身份验证',
        mod1:true,
        mod2:false,
        mod3:false,
        start:false,
        code:'',
        dis1:true,
        pwd:'',
        repwd:'',
        type:2,
        ifuser:'',
        uuid:'',
        codeSrc:'',
        isSecond:false,
        imgcode:'',
        rand:0
      }
    },
    computed:{
      disabled:function(){
        //return this.idShow==false?this.user=='':this.user==''||this.idNumber==''
        return this.user==''
      },
      dis2:function(){
        //return this.idShow==false?this.user=='':this.user==''||this.idNumber==''
        return this.pwd==''||this.repwd==''
      }
    },
    methods: {
      // chg(t){
      //   switch(t){
      //     case '手机号':
      //     this.type=1
      //     this.tip= '请输入手机号码'
      //     this.way1='手机号';
      //     this.way2='邮箱'
      //     this.idShow = false
      //     break
      //     case '邮箱':
      //     this.type=2
      //     this.tip= '请输入邮箱号码'
      //     this.way1='邮箱';
      //     this.way2='手机号'
      //     this.idShow = false
      //     break
      //   }
      // },
      validate() {
        let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if(!reg.test(this.user)){
            this.noUser = true
            this.ifuser = '请输入正确格式的邮箱'
            return false;
        }else{
            this.noUser = false
            this.ifuser = ''
        }
        this.btnTxt='帐号验证中...'

        this.$http.get('/login/staff/checkMailOrPhoneExistApply',{username:this.user,type:this.type},(res)=>{
            this.btnTxt='重新验证'
            this.back = true
          if(res.code==0){//验证通过，跳转下一步
            this.noUser = false
            this.mod1=false
            this.mod2=true
            this.mytit = '帐号申请'
          }else{//验证未通过
            this.noUser = true
            this.ifuser = res.msg
          }
        })
      },
      getCode() { //获取图片验证码
            this.uuid = this.$utils.uuid()
            this.codeSrc = '/rest/login/staff/getImageValidateCode?img-key='+this.uuid
        },
      sendCode() {
        // this.$dialog.loading.open('发送中...');
        if(this.isSecond && this.imgcode.length<4){
            this.$dialog.toast({
                mes: '请输入四位验证码！',
                timeout: 1500,
                icon: 'error'
            });
          }
        var params = {
          key:this.uuid,
          userName:this.user,
          type:this.type,
          fromType:1,
          noStaff:true,
          inputCode:this.imgcode,
          inputCodeKey:this.uuid
        },that = this
        this.$http.get('/login/staff/sendMsgToPhoneOrEmail',params,function(res){
            if(res.code==0){
              setTimeout(() => {
                  that.start = true;
                  that.$dialog.loading.close();
                  that.$dialog.toast({
                      mes: '已发送',
                      icon: 'success',
                      timeout: 1500
                  });
              }, 1000);
            }else{
              that.getCode();
              that.isSecond = true;
              that.$dialog.toast({
                  mes: res.msg,
                  timeout: 3000
              });
            }
        })
      },
      checkCode(){
        if(this.code.length < 6) return false;
        var params = {
          key:this.uuid,
          userName:this.user,
          inputCode:this.code,
          fromType:1,
          noStaff:true
        },that = this;
        this.$http.get('/login/staff/checkValidateCode',params,function(res){
            if(res.code==0){
              that.dis1 = false
            }else{
              that.$dialog.toast({
                  mes: '请输入正确的验证码',
                  timeout: 1500,
                  icon: 'error',
                  callback: () => {
                      that.dis1 = true
                  }
              })
            }
        })
      },
      ok(){
        var that = this,reg=/^(?![^a-zA-Z]+$)(?!\D+$).{6,12}$/;
        reg = /^(?![0-9]+$)(?![a-zA-Z]+$)([0-9A-Za-z]|[._]){8,16}$/
        if(!reg.test(this.pwd)){
          this.$dialog.toast({
              mes: '密码格式不正确~',
              timeout: 1500,
              icon: 'error'
          })
          return false
        }else if(this.pwd!=this.repwd){
          this.$dialog.toast({
              mes: '两次输入密码不一致',
              timeout: 1500,
              icon: 'error',
              callback: () => {
                  that.pwd2 = ''
              }
          })
          return false
        }
        that.$router.push({name:'account-personal',params:{type:that.type,user:that.user,pwd:that.pwd}})

      }
    }
  }

</script>
