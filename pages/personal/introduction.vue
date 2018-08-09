<template>
	<div class="T-intr">
		 <yd-navbar title="T严选介绍及疑问">
		      <router-link to="/" slot="left">
		        <yd-navbar-back-icon></yd-navbar-back-icon>
		      </router-link>
	     </yd-navbar>
        
        <div class="border-line"  v-for="(item,index) in queData">
        	<div class="question flex" @click="toggle(index,item.state)">
        		<span class="icon-dot font24" :class="{'red':item.state}">Q</span>
        		<div class="item-1 font26">{{item.que}}</div>
        		<i class="iconfont-tcl font22" :class="item.state ? 'icon-shang':'icon-xia'" ></i>
        	</div>
        	<div class="answer font22" v-if="item.state">{{item.ans}}</div>
        </div>

         
         

	</div>
</template>

<script>
	export default {
		data(){
		return {
			queData:[
				{
					que:'什么是T严选',
					ans:'T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问',
					state:false
				},
				{
					que:'什么是T严选',
					ans:'T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问',
					state:false
				},
				{
					que:'什么是T严选',
					ans:'T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问T严选介绍及疑问',
					state:false
				}
			]

		}
		

		},
		methods:{
			toggle(index,state){
				/*console.log(state);*/

				if (state === true) {
					this.queData.forEach(function(item){
					  item.state = false;
					});

				}else{
					this.queData.forEach(function(item){
					  item.state = false;
					});
					this.queData[index].state = true

				}

			}

		}
	}
</script>
