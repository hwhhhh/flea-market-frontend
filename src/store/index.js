import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: window.sessionStorage.getItem('user'),
  commodity: window.sessionStorage.getItem('commodity')
}
const mutations = {
  GET_USER: (state, data) => {
    // 把用户名存起来
    state.user = data
    window.sessionStorage.setItem('user', data)
  },
  LOGOUT: (state) => {
    // 登出的时候要清除用户名
    state.user = null
    window.sessionStorage.removeItem('user')
  },
  GET_COMMODITY: (state, data) => {
    // 把商品存起来
    state.commodity = data
    window.sessionStorage.setItem('commodity', data)
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions: {
  },
  modules: {
  }
})
