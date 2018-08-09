<template>
    <div class="score g-comment add-comments">
        <yd-navbar title="追加评论">
            <router-link :to="'/my/comments?type='+type" @click="$router.back()" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>
        <div class="comment-content" v-for="(good, index) in goods" :key="index">
            <div class="order">
                <div class="img-s">
                    <a :href="'/other/'+good.productUuid"><img :src="good.imageUrl" :alt="good.productName"></a>
                </div>
                <p class="con-s">
                    <span class="name">
                        {{good.productName + '&nbsp' + good.color + '&nbsp' + good.size}}
                    </span>
                </p>
            </div>
            <div class="comment-word">
                <p class="add">追加评论</p>
                <textarea maxlength='500' rows="5" v-model="good.des1"
                          placeholder="已经用了一段时间了，有更多宝贝使用心得？分享给想买的他们吧~"
                          @input="changeNum(index)">
            </textarea>
                <p class="num">{{good.num}}/500</p>
            </div>
            <div class="comment-pic">
                <div class="imgs">
                    <ul>
                        <li v-for="(val,idx) in good.imgList1" :key="idx">
                            <span @click="delImg(good.imgList1,idx)">X</span>
                            <img :src="val.fileUrl" alt="">
                        </li>
                        <li class="photo" @click="up(index)">
                            <div class="iky-camera"></div>
                            <input type="file" :id="'files'+index" hidden @change="upLoad(good,index)">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="submit" @click="submit()">
            <yd-button size="large" type="danger">提交追加评价</yd-button>
        </div>
    </div>
</template>
<script>
    export default {
        head() {
            return {
                title: 'T严选商城-追加评论',
            }
        },
        data() {
            return {
                uuid: '',
                goods: [],
                type: ''
            }
        },
        mounted() {
            this.uuid = this.$route.query.uuid;
            this.type = this.$route.query.type;
            this.getData()
        },
        methods: {
            getData() {
                this.$http.post('/usercenter/order/ajaxviewKuyuByAfterComment', {uuid: this.uuid}, res => {
                    if(res.code == '0') {
                        console.log('res', res)
                        res.data.detailList.forEach((y) => {
                            let spec = y.spec ? JSON.parse(y.spec) : ''
                            const good = {
                                uuid: y.uuid,
                                imageUrl: y.specUuid ? y.specUuid : '',
                                productName: y.productName,
                                color: spec ? spec[0].value : '',
                                size: spec ? (spec[1] ? spec[1].value : '') : '',
                                imgList1: [],
                                des1: '',
                                uuid: y.uuid,
                                num: 0,
                            }
                            this.goods.push(good)
                        })
                    }
                })
            },
            changeNum(index) {
                this.goods.forEach((val, i)=> {
                    if(index === i) {
                        val.num = this.goods[index].des1.length;
                    }
                })
            },
            up(i) {
                document.getElementById('files' + i).click()
            },
            upLoad(item, i) {
                console.log('item', item)
                if(item.imgList1.length >= 5) {
                    this.$dialog.alert({mes: '最多上传5张'})
                    return false;
                }
                var data = {file: document.getElementById("files" + i).files[0]}
                console.log('data', data)
                this.$http.post('/usercenter/batchfileupload/batch/upload', data, res => {
                    if(res.code == '0') {
                        item.imgList1.push(res.data)
                        document.getElementById("files" + i).value = ''
                    } else if(res.code == '-1') {
                        this.$dialog.alert({mes: '图片过大,上传的图片不能超过4M！'})
                    } else if(res.code == '-2') {
                        this.$dialog.alert({mes: '仅支持jpg,gif,png,jpeg,bmp后缀的图片上传！'})
                    } else if(res.code == '-3') {
                        this.$dialog.alert({mes: '图片为空!'})
                    }
                })
            },
            delImg(val, idx) {
                val.splice(idx, 1)
            },
            submit() {
                var obj = {}
                var arr = []
                this.goods.map((val, i)=> {
                    if(!val.des1) {
                        this.$dialog.alert({mes: '请输入商品评价！'})
                        return false;
                    }
                    if(val.des1.length > 150) {
                        this.$dialog.alert({mes: '请填写500字以内的追评内容'})
                        return false;
                    }
                    arr.push(this.reviewData(i))
                })
                var param = {
                    data: JSON.stringify(arr)
                }
                console.log('param', param)
                this.$http.post('/usercenter/productappraise/saveAfterAppraiseKuyu', param, res => {
                    console.log('res', res)
                    if(res.code == '0') {
                        this.$dialog.alert({
                            mes: '评价成功', callback: () => {
                                this.$router.push({path: '/my/successComment?uuid=' + this.uuid})
                            }
                        })
                    } else {
                        this.$dialog.alert({mes: '评价失败，请稍后再试！'})
                    }
                })
            },
            reviewData(i) {
                var imgString = '';
                if(this.goods[i].imgList1.length > 0) {
                    this.goods[i].imgList1.map((x) => {
                        imgString += x.imgName + ',' + x.fileUrl + ';'
                    })
                }
                var obj = {
                    orderDetailUuid: this.goods[i].uuid,
                    imgString: imgString,
                    orderId: this.uuid,
                    content: this.goods[i].des1,
                    appTags: '',
                    terminalType: '02'
                }
                return obj;
            },
        },
    }
</script>

