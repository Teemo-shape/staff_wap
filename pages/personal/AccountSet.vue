<template>
	<div class="account-set">
		 <yd-navbar title="账户设置">
	      <router-link to="/" slot="left">
	        <yd-navbar-back-icon></yd-navbar-back-icon>
	      </router-link>
	    </yd-navbar>




	    <div class="account-info-top">
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">头像</div>
		    	<img class="header-pic" src="/img/emptyCart.png">
		    	<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex">
	    		<div class="font26 item-1">
	    		  昵称
	    		  <span class="flex-txt">(不可用以登录)</span>
	    	    </div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    </div>


	    <div class="account-info-center">
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">姓名</div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">性别</div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">出生日期</div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">手机号</div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">员工邮箱</div>
	    		<span class="flex-txt">XXX</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex">
	    		<div class="font26 item-1">公司名称</div>
	    		<span class="flex-txt">xxxxxxxxxxxxxxx</span>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    </div>


	    <div class="account-info-bottom">
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">收货地址</div>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    	<a href="#" class="flex border-line">
	    		<div class="font26 item-1">修改密码</div>
	    		<i class=" icon iky-arrow-right"></i>
	    	</a>
	    </div>


	    <a href="#" class="login-out-btn font26">退出登录</a>

	</div>
</template>

<script>
	export default {
		data(){}
	}
</script>
<style lang="less" rel="stylesheet/less">
     body{
     	background:#f8f8f8;
     }
</style>