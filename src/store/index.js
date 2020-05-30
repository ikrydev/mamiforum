import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    forums: {},
    categories: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'NnooaWj4KHVxbhKwO1pEdfaQDsD2'
  },
  getters,
  mutations,
  actions
})
