import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...data,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },
  mutations: {
    setUser (state, user) {
      Vue.set(state.users, user['.key'], user)
    },
    setPosts (state, { postId, post }) {
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
    editProfile ({ commit }, user) {
      commit('setUser', user)
    },
    createPost ({ commit, state }, post) {
      const postId = `newPost.${Math.random()}`

      post['.key'] = postId
      post.publishedAt = Math.floor(Date.now() / 1000)
      post.userId = state.authId

      commit('setPosts', { postId, post })
      commit('appendPostToThread', { postId, post })
      commit('appendPostToUser', { postId, post })
    }
  }
})
