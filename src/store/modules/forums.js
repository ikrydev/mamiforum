import { appendChildToParentMutation } from '@/store/helpers'

const state = {
  items: {}
}

const getters = {}

const mutations = {
  appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' })
}

const actions = {
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums', emoji: '📃' }, { root: true }),
  fetchForum: ({ dispatch }, { forumId }) => dispatch('fetchItem', { resource: 'forums', id: forumId, emoji: '📃' }, { root: true })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
