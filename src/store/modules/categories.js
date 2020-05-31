import firebase from 'firebase'

const state = {
  items: {}
}

const getters = {}

const mutations = {}

const actions = {
  fetchAllCategories ({ state, commit }) {
    console.log('🔥 🏷 : all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categories = snapshot.val()
        Object.keys(categories).forEach(categoryId => {
          const category = categories[categoryId]
          commit('setItem', { resource: 'categories', id: categoryId, item: category }, { root: true })
        })

        resolve(Object.values(state.items))
      })
    })
  },
  fetchCategory: ({ dispatch }, { categoryId }) => dispatch('fetchItem', { resource: 'categories', id: categoryId, emoji: '🏷' }, { root: true }),
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'categories', emoji: '🏷' }, { root: true })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
