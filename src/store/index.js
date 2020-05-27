import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
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
    forums: {},
    categories: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'NnooaWj4KHVxbhKwO1pEdfaQDsD2'
  },
  getters: {
    authUser (state) {
      return { name: 'fikri', avatar: '' }
      // return state.users[state.authId]
    },
    userPostsCount: state => userId => objectPropertiesCounter(state.users[userId].posts),
    userThreadsCount: state => userId => objectPropertiesCounter(state.users[userId].threads),
    threadRepliesCount: state => threadId => objectPropertiesCounter(state.threads[threadId].posts) - 1
  },
  mutations: {
    setUser (state, { userId, user }) {
      Vue.set(state.users, userId, user)
    },
    setPost (state, { postId, post }) {
      Vue.set(state.posts, postId, post)
    },
    setThread (state, { threadId, thread }) {
      Vue.set(state.threads, threadId, thread)
    },
    setItem (state, { resource, id, item }) {
      item['.key'] = id
      Vue.set(state[resource], id, item)
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

      commit('setPost', { postId, post })
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

      commit('setPost', { postId, post })
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
    },
    fetchItem ({ commit, state }, { resource, id, emoji }) {
      console.log(`🔥 ${emoji} : ${id}`)
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id)
          .once('value', snapshot => {
            commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })

            resolve(state[resource][id])
          })
      })
    },
    fetchThread ({ dispatch }, { threadId }) {
      return dispatch('fetchItem', { resource: 'threads', id: threadId, emoji: '📄' })
    },
    fetchUser ({ dispatch }, { userId }) {
      return dispatch('fetchItem', { resource: 'users', id: userId, emoji: '👨‍💼' })
    },
    fetchPost ({ dispatch }, { postId }) {
      return dispatch('fetchItem', { resource: 'posts', id: postId, emoji: '📚' })
    }
  }
})
