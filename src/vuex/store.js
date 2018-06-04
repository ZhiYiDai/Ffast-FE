import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

// 创建 store 实例
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
