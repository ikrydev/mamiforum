import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...data,
    authId: 'NnooaWj4KHVxbhKwO1pEdfaQDsD2'
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
    setThread (state, { threadId, thread }) {
      Vue.set(state.threads, threadId, thread)
    },
    appendPostToThread (state, { postId, post }) {
      const thread = state.threads[post.threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },
    appendPostToUser (state, { postId, post }) {
      const user = state.users[post.userId]
      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }
      Vue.set(user.posts, postId, postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
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
      return Promise.resolve(state.posts[postId])
    },
    createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      return new Promise((resolve, reject) => {
        const threadId = `newThread.${Math.random()}`
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const thread = {
          '.key': threadId,
          forumId,
          title,
          userId,
          publishedAt
        }
        commit('setThread', { threadId, thread })
        commit('appendThreadToForum', { forumId, threadId })
        commit('appendThreadToUser', { userId, threadId })

        dispatch('createPost', { text, threadId })
          .then(res => {
            commit('setThread', { threadId, thread: { ...thread, firstPostId: res['.key'] } })
          })
        resolve(state.threads[threadId])
      })
    }
  }
})
