import firebase from 'firebase'

const state = {
  authId: null,
  unsubscribeAuthObserver: null
}

const getters = {
  authUser: (state, getters, rootState) => state.authId ? rootState.users.items[state.authId] : null
}

const mutations = {
  setAuthId (state, userId) {
    state.authId = userId
  },
  setUnsubscribeAuthObserver (state, unsubscribe) {
    state.unsubscribeAuthObserver = unsubscribe
  }
}

const actions = {
  fetchAuthUser ({ commit, dispatch }) {
    const userId = firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
      // check if user exists in database
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) {
          dispatch('users/fetchUser', { userId }, { root: true }).then(user => {
            commit('setAuthId', userId)
            resolve(user)
          })
        } else {
          resolve(null)
        }
      })
    })
  },

  registerUserWithEmailAndPassword ({ commit, dispatch }, { name, username, email, password, avatar = null }) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        dispatch('users/createUser', { id: user.uid, name, username, email, password, avatar }, { root: true })
          .then(() => dispatch('fetchAuthUser'))
      })
  },
  logInUserWithEmailAndPassword ({ dispatch }, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => dispatch('fetchAuthUser'))
  },
  logInWithGoogle ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider).then(({ user }) => {
      firebase.database().ref('users').child(user.uid).once('value', snapshot => {
        if (!snapshot.exists()) {
          const { uid, displayName, email, photoURL } = user
          return dispatch('users/createUser', { id: uid, name: displayName, username: email, email, avatar: photoURL }, { root: true }).then(() => dispatch('fetchAuthUser'))
        }
      })
    })
  },
  logOut ({ commit }) {
    return firebase.auth().signOut().then(() => {
      commit('setAuthId', null)
    })
  },
  initAuthentication ({ state, commit, dispatch }) {
    console.log('👣 auth state changed')
    if (state.unsubscribeAuthObserver) {
      state.unsubscribeAuthObserver()
    }
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          dispatch('fetchAuthUser').then(dbUser => resolve(dbUser))
        } else {
          resolve(null)
        }
      })

      commit('setUnsubscribeAuthObserver', unsubscribe)
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
