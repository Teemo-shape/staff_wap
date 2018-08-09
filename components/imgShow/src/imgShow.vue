<template>
  <div class="imgshow">
    <img class="plimg" v-for="(i, index) in imgList" :src="i.imgUrl" @click="open(index)" :key="index" />
    <div class="mask-black-dialog" v-show="show">
      <div class="img-confirm">
        <div class="img-con-box">
          <span class="icon l iky-arrow-left font44" @click="prev"></span>
          <img :src="img" alt="" width="80%">
          <span class="icon r iky-arrow-right font44" @click="next"></span>
        </div>
        <a href="javascript:;" class="confirm-btn" @click.stop="closeConfirm()">×</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'imgShow',
  data() {
    return {
      imgList: [],
      show: false,
      showIndex: '',
      img: '',
    }
  },
  props: {
    list: Array,
  },
  mounted() {
    if (this.list) {
      this.imgList = this.list;
    }
  },
  methods: {
    open(index) {
      this.showIndex = index;
      this.img = this.imgList[index].imgUrl;
      this.show = true;
    },
    closeConfirm() {
      this.show = false;
    },
    next() {
      this.showIndex += 1;
      if (this.showIndex >= this.imgList.length) {
        this.showIndex = this.imgList.length - 1;
        return false
      };
      this.img = this.imgList[this.showIndex].imgUrl;
    },
    prev() {
      this.showIndex -= 1;
      if (this.showIndex < 0) {
        this.showIndex = 0;
        return false;
      }
      this.img = this.imgList[this.showIndex].imgUrl;
    }
  }
}
</script>
