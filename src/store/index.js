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
    updateProfile ({ commit }, user) {
      commit('setUser', user)
    },
    createPost ({ commit, state }, post) {
      const postId = `awesomePost.${Math.random()}`

      post['.key'] = postId
      post.publishedAt = Math.floor(Date.now() / 1000)
      post.userId = state.authId

      commit('setPosts', { postId, post })
      commit('appendPostToThread', { postId, post })
      commit('appendPostToUser', { postId, post })
      return Promise.resolve(state.posts[postId])
    },
    updatePost ({ commit, state }, { text, postId }) {
      const post = {
        ...state.posts[postId],
        text,
        edited: {
          at: Math.floor(Date.now() / 1000),
          by: state.authId,
          moderated: false
        }
      }

      commit('setPosts', { postId, post })
      return Promise.resolve(state.posts[postId])
    },
    createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      return new Promise((resolve, reject) => {
        const threadId = `awesomeThread.${Math.random()}`
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
          .then(post => {
            commit('setThread', { threadId, thread: { ...thread, firstPostId: post['.key'] } })
          })
        resolve(state.threads[threadId])
      })
    },
    updateThread ({ commit, state, dispatch }, { title, text, threadId }) {
      const thread = state.threads[threadId]
      const postId = thread.firstPostId

      commit('setThread', { threadId, thread: { ...thread, title } })
      dispatch('updatePost', { text, postId })
    }
  }
})
