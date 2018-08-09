<template>
	<div class="reservationOk">
		<yd-navbar title="预约成功">
		</yd-navbar>
		<div>
			<h4>恭喜您预约成功！</h4>
			<div class="tip">
				<p class="tip">已成功预约
					<span> {{proName}}</span>
				</p>
				<p class="tip">将于{{time}}开放购买</p>
			</div>
		</div>
		<div class="btnbox">
			<a href="/my/reservation">查看预约</a>
			<a href="/" class="to">继续购物</a>
		</div>
	</div>
</template>

<script>
export default {
	head() {
		return {
			title: 'TCL官网-预约成功',
		}
	},
	data() {
		return {
			time: '',
			proName: ''
		}
	},
	created() {
		if (this.$utils.getCookie('reservationdata')) {
			var info = JSON.parse(this.$utils.getCookie('reservationdata'))
			this.time = info.rushBuyBeginTime
			this.proName = info.gname
		}
		if (this.$utils.getCookie('queryParams')) {
			this.$utils.delCookie('queryParams')
		}
	},
}
</script>

