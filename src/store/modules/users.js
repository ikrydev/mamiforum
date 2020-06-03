import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'

import { appendChildToParentMutation } from '@/store/helpers'
import { objectPropertiesCounter, objectEmptyPropertiesRemover } from '@/utils'

const state = {
  items: {}
}

const getters = {
  userPosts: (state, getters, rootState) => userId => {
    const user = state.items[userId]
    if (user.posts) {
      return Object.values(rootState.posts.items)
        .filter(post => post.userId === userId)
    }
    return []
  },
  userPostsCount: state => userId => objectPropertiesCounter(state.items[userId].posts),
  userThreadsCount: state => userId => objectPropertiesCounter(state.items[userId].threads)
}

const mutations = {
  setUser (state, { userId, user }) {
    Vue.set(state.items, userId, user)
  },
  appendPostToUser: appendChildToParentMutation({ parent: 'users', child: 'posts' }),
  appendThreadToUser: appendChildToParentMutation({ parent: 'users', child: 'threads' })
}

const actions = {
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'useres', emoji: '👨‍💼' }, { root: true }),
  fetchUser: ({ dispatch }, { userId }) => dispatch('fetchItem', { resource: 'users', id: userId, emoji: '👨‍💼' }, { root: true }),
  updateProfile ({ commit }, user) {
    const updates = {
      avatar: user.avatar,
      username: user.username,
      usernameLower: (user.username).toLowerCase(),
      name: user.name,
      bio: user.bio,
      website: user.website,
      email: user.email,
      location: user.location
    }

    return new Promise((resolve, reject) => {
      firebase.database().ref('users').child(user['.key']).update(objectEmptyPropertiesRemover(updates)).then(() => {
        resolve(user)
        commit('setUser', { userId: user['.key'], user })
      })
    })
  },
  createUser ({ commit, state }, { id, name, username, email, password = null, avatar = null }) {
    return new Promise((resolve, reject) => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { id, name, username, email, password, avatar, usernameLower, registeredAt }
      firebase.database().ref('users').child(id).set(user).then(() => {
        commit('setItem', { resource: 'users', id, item: user }, { root: true })

        resolve(state.items[id])
      })
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
