import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'

const state = {
  items: {}
}

const getters = {}

const mutations = {
  setPost (state, { postId, post }) {
    Vue.set(state.items, postId, post)
  }
}

const actions = {
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts', emoji: '📚' }, { root: true }),
  fetchPost: ({ dispatch }, { postId }) => dispatch('fetchItem', { resource: 'posts', id: postId, emoji: '📚' }, { root: true }),
  createPost ({ commit, state, rootState }, { text, threadId }) {
    const postId = firebase.database().ref('posts').push().key
    const userId = rootState.auth.authId
    const post = {
      publishedAt: Math.floor(Date.now() / 1000),
      threadId,
      userId,
      text
    }

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${threadId}/posts/${postId}`] = postId
    updates[`threads/${threadId}/contributors/${userId}`] = userId
    updates[`users/${userId}/posts/${postId}`] = postId

    firebase.database().ref().update(updates).then(() => {
      commit('setItem', { resource: 'posts', id: postId, item: post }, { root: true })
      commit('threads/appendPostToThread', { parentId: threadId, childId: postId }, { root: true })
      commit('threads/appendContributorToThread', { parentId: threadId, childId: userId }, { root: true })
      commit('users/appendPostToUser', { parentId: userId, childId: postId }, { root: true })
      return Promise.resolve(state.items[postId])
    })
  },
  updatePost ({ commit, state, rootState }, { postId, text }) {
    const post = state.items[postId]
    const edited = {
      at: Math.floor(Date.now() / 1000),
      by: rootState.auth.authId,
      moderated: false
    }

    const updates = { text, edited }

    firebase.database().ref('posts').child(postId).update(updates).then(() => {
      commit('setPost', { postId, post: { ...post, text, edited } })
      return Promise.resolve(post)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
