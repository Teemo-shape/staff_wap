<template>
    <div class="success-comment">
        <yd-navbar title="评价成功">
            <span @click="$router.go(-1)" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </span>
        </yd-navbar>
        <div class="content">
            <div class="sucess">
                <p>非常感谢您用心填写评价，</p>
                <p>您的评价和观点对我们非常重要！</p>
            </div>
            <div class="return-btn">
                <a href="/my/orders">
                    <button>返回我的订单</button>
                </a>
                <a href="/my/comments">
                    <button>查看我的评价</button>
                </a>
            </div>
        </div>
        <div class="undetermined">
            待定区域
        </div>
    </div>
</template>
<script>
    export default {
        head() {
            return {
                title: 'T严选商城-评价成功',
            }
        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        },
    }
</script>


