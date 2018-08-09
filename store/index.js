import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        loading: false,
        classifyURL: '', //分类列表中路径
    },
    mutations: {
        savaURL(state, data) {
            state.classifyURL = data;
        }
    }
})

export default store