<template>
	<div class="T-intr">
		 <yd-navbar title="T严选介绍及疑问">
		      <router-link to="/my" slot="left">
		        <yd-navbar-back-icon></yd-navbar-back-icon>
		      </router-link>
	     </yd-navbar>
    <div class="border-line"  v-for="(item,index) in queData" :key="index">
      <div class="question flex" @click="toggle(index,item.expand)">
        <span class="icon-dot font24" :class="{'red':item.expand}">Q</span>
        <div class="item-1 font26">{{item.contentTitle}}</div>
        <i class="iconfont-tcl font22" :class="item.expand ? 'icon-shang':'icon-xia'" ></i>
      </div>
      <div class="answer font22" v-show="item.expand" v-html="item.introduction"></div>
    </div>
	</div>


</template>

<script>
	export default {
        head() {
            return {
                title: 'T严选商城-介绍及疑问',
            }
        },
		data(){
      return {
        queData:[]
      }

		},
    mounted(){
      this.getData()
    },
		methods:{
		  getData(){
        this.queData = []
        this.$http.post('/servicecenter/getCommonProblems',{},res=>{
          res.retData.subCotentCategorys.forEach(o => {
            o.contentList.forEach(m => {
              m.expand = false
              this.queData.push(m)
              this.queData[0].expand = true
            })
          })
        })
      },
			toggle(index,expand){
		    this.queData[index].expand = !expand
			}

		}
	}
</script>
