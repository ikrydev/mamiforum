import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: data,
  mutations: {
    addToPosts (state, { postId, post }) {
      Vue.set(state.posts, postId, post)
    },
    appendPostToThread (state, { postId, post }) {
      const user = state.users[post.userId]
      Vue.set(user.posts, postId, postId)
    },
    appendPostToUser (state, { postId, post }) {
      const thred = state.threads[post.threadId]
      Vue.set(thred.posts, postId, postId)
    }
  },
  actions: {
    createPost ({ commit }, post) {
      const postId = `newPost.${Math.random()}`
      post['.key'] = postId
      commit('addToPosts', { postId, post })
      commit('appendPostToThread', { postId, post })
      commit('appendPostToUser', { postId, post })
    }
  }
})
