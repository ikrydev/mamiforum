import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'

import { appendChildToParentMutation } from '@/store/helpers'
import { objectPropertiesCounter } from '@/utils'

const state = {
  items: {}
}

const getters = {
  threadRepliesCount: state => threadId => objectPropertiesCounter(state.items[threadId].posts) - 1
}

const mutations = {
  setThread (state, { threadId, thread }) {
    Vue.set(state.items, threadId, thread)
  },
  appendContributorToThread: appendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
  appendPostToThread: appendChildToParentMutation({ parent: 'threads', child: 'posts' })
}

const actions = {
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'threads', emoji: '📄' }, { root: true }),
  fetchThread: ({ dispatch }, { threadId }) => dispatch('fetchItem', { resource: 'threads', id: threadId, emoji: '📄' }, { root: true }),
  createThread ({ commit, state, rootState }, { title, text, forumId }) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const userId = rootState.auth.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = {
        publishedAt,
        forumId,
        title,
        userId,
        firstPostId: postId,
        posts: {},
        contributors: {}
      }
      thread.posts[postId] = postId
      thread.contributors[userId] = userId

      const post = { publishedAt, threadId, userId, text }

      const updates = {}

      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId

      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId

      firebase.database().ref().update(updates).then(() => {
        // update thread
        commit('setItem', { resource: 'threads', id: threadId, item: thread }, { root: true })
        commit('forums/appendThreadToForum', { parentId: forumId, childId: threadId }, { root: true })
        commit('users/appendThreadToUser', { parentId: userId, childId: threadId }, { root: true })

        // update post
        commit('setItem', { resource: 'posts', id: postId, item: post }, { root: true })
        commit('appendPostToThread', { parentId: threadId, childId: postId })
        // commit('appendContributorToThread', { parentId: threadId, childId: userId })
        commit('users/appendPostToUser', { parentId: userId, childId: postId }, { root: true })

        resolve(state.items[threadId])
      })
    })
  },
  updateThread ({ commit, state, rootState }, { title, text, threadId }) {
    const thread = state.items[threadId]
    const postId = thread.firstPostId

    const post = rootState.posts.items[postId]
    const edited = {
      at: Math.floor(Date.now() / 1000),
      by: rootState.auth.authId,
      moderated: false
    }

    const updates = {}
    updates[`threads/${threadId}/title`] = title
    updates[`posts/${postId}/text`] = text
    updates[`posts/${postId}/edited`] = edited

    firebase.database().ref().update(updates).then(() => {
      commit('setThread', { threadId, thread: { ...thread, title } })
      commit('posts/setPost', { postId, post: { ...post, text, edited } }, { root: true })
      return Promise.resolve({ ...thread, title })
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
