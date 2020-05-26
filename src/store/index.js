import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/data'
import { objectPropertiesCounter } from '@/utils'

Vue.use(Vuex)

const appendChildToParentMutation = ({ parent, child }) => (state, { parentId, childId }) => {
  const resource = state[parent][parentId]
  if (!resource[child]) {
    Vue.set(resource, child, {})
  }
  Vue.set(resource[child], childId, childId)
}

export default new Vuex.Store({
  state: {
    ...data,
    authId: 'NnooaWj4KHVxbhKwO1pEdfaQDsD2'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    },
    userPostsCount: state => userId => objectPropertiesCounter(state.users[userId].posts),
    userThreadsCount: state => userId => objectPropertiesCounter(state.users[userId].threads),
    threadRepliesCount: state => threadId => objectPropertiesCounter(state.threads[threadId]) - 1
  },
  mutations: {
    setUser (state, { userId, user }) {
      Vue.set(state.users, userId, user)
    },
    setPosts (state, { postId, post }) {
      Vue.set(state.posts, postId, post)
    },
    setThread (state, { threadId, thread }) {
      Vue.set(state.threads, threadId, thread)
    },
    appendPostToThread: appendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendPostToUser: appendChildToParentMutation({ parent: 'users', child: 'posts' }),
    appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: appendChildToParentMutation({ parent: 'users', child: 'threads' })
  },
  actions: {
    updateProfile ({ commit }, { userId, user }) {
      commit('setUser', { userId, user })
    },
    createPost ({ commit, state }, { text, threadId }) {
      const postId = `awesomePost.${Math.random()}`
      const userId = state.authId
      const post = {
        '.key': postId,
        publishedAt: Math.floor(Date.now() / 1000),
        userId,
        text
      }

      commit('setPosts', { postId, post })
      commit('appendPostToThread', { parentId: threadId, childId: postId })
      commit('appendPostToUser', { parentId: userId, childId: postId })
      return Promise.resolve(state.posts[postId])
    },
    updatePost ({ commit, state }, { postId, text }) {
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
        commit('appendThreadToForum', { parentId: forumId, childId: threadId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })

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
