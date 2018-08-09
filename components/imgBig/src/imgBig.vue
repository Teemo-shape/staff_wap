<template>
  <div class="imgshow">
    <div class="mask-black-dialog" v-show="show">
      <div class="img-confirm">
        <div class="img-con-box" @touchend.capture.stop="touchEnd" @touchstart.capture.stop="touchStart" @touchmove="touchMove">
          <!-- <span class="icon l iky-arrow-left font44" @click="prev"></span> -->
          <img :src="img" alt="" width="90%">
          <!-- <span class="icon r iky-arrow-right font44" @click="next"></span> -->
        </div>
        <a href="javascript:;" class="confirm-btn" @click="closeConfirm()">×</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'imgBig',
  data() {
    return {
      show: false,
      showIndex: '',
      img: '',
      startX:0,
      disX:0
    }
  },
  props: {
    list: Array,
  },
  methods: {
    showCom(index){
      console.log(this.list)
      this.show = true;
      this.showIndex = index;
      this.img = this.list[index].imgUrl || this.list[index];
    },
    closeConfirm() {
      this.show = false;
    },
    touchStart(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) { 
          this.startX = ev.touches[0].clientX; 
          console.log('开始'+this.startX)
      }
    },
    touchMove(ev){
      ev = ev || event;
      ev.preventDefault();
      let moveX = ev.touches[0].clientX;
      console.log('滑了'+moveX)
      this.disX = moveX - this.startX;
    },
    touchEnd(ev){
      ev = ev || event;
      ev.preventDefault();
      console.log('距离'+this.disX);
      if(this.disX>20){
        this.prev();
      }else if(this.disX<-20){
        this.next();
      }
    },
    next() {console.log('右');
      this.showIndex += 1;
      if (this.showIndex >= this.list.length) {
        this.showIndex = this.list.length - 1;
        this.$dialog.toast({mes: '已是最后一张', timeout: 1000});
        return false
      };
      this.img = this.list[this.showIndex].imgUrl || this.list[this.showIndex];
    },
    prev() {console.log('左')
      this.showIndex -= 1;
      if (this.showIndex < 0) {
        this.showIndex = 0;
        this.$dialog.toast({mes: '已是第一张', timeout: 1000});
        return false;
      }
      this.img = this.list[this.showIndex].imgUrl || this.list[this.showIndex];
    }
  }
}
</script>
