<template>
  <div class="player">
    <div class="modal">
      <div class="modal_content">
        <div class="modal_content_header">
          <a href="javascript:void(0)" @click="close">
            <img src="/img/p_close.png" alt="">
          </a>
        </div>
        <div class="modal_content_body">
          <video id="video" autoplay :src="videoSrc" controls="controls">
          </video>
        </div>
        <!-- <div class="modal_content_footer">

        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'player',
    layout: "empty",
    props:{
      videoSrc:{
        type:String,
        default:''
      },
      isPlay:{
        type:Boolean,
        default:true,
      },
    },
    data(){
      return {

      }
    },
    methods:{
      close(){
        this.$emit('changState',false)
        // var video = document.getElementById("video")
        // video.pause();
      },
    },
  }
</script>