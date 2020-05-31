import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import auth from './modules/auth'
import categories from './modules/categories'
import forums from './modules/forums'
import threads from './modules/threads'
import posts from './modules/posts'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters,
  mutations,
  actions,
  modules: {
    auth,
    categories,
    forums,
    threads,
    posts,
    users
  }
})
