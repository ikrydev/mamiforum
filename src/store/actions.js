import firebase from 'firebase'

export default {
  updateProfile ({ commit }, { userId, user }) {
    commit('setUser', { userId, user })
  },
  fetchAuthUser ({ commit, dispatch }) {
    const userId = firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
      // check if user exists in database
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) {
          dispatch('fetchUser', { userId }).then(user => {
            commit('setAuthId', userId)
            resolve(user)
          })
        } else {
          resolve(null)
        }
      })
    })
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
  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', { resource, id, emoji })))
  },
  fetchAllCategories ({ state, commit }) {
    console.log('🔥 🏷 : all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categories = snapshot.val()
        Object.keys(categories).forEach(categoryId => {
          const category = categories[categoryId]
          commit('setItem', { resource: 'categories', id: categoryId, item: category })
        })

        resolve(Object.values(state.categories))
      })
    })
  },
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'forums', emoji: '📃' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'threads', emoji: '📄' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'posts', emoji: '📚' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { ids, resource: 'useres', emoji: '👨‍💼' }),

  fetchCategory: ({ dispatch }, { categoryId }) => dispatch('fetchItem', { resource: 'categories', id: categoryId, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { forumId }) => dispatch('fetchItem', { resource: 'forums', id: forumId, emoji: '📃' }),
  fetchThread: ({ dispatch }, { threadId }) => dispatch('fetchItem', { resource: 'threads', id: threadId, emoji: '📄' }),
  fetchPost: ({ dispatch }, { postId }) => dispatch('fetchItem', { resource: 'posts', id: postId, emoji: '📚' }),
  fetchUser: ({ dispatch }, { userId }) => dispatch('fetchItem', { resource: 'users', id: userId, emoji: '👨‍💼' }),

  createPost ({ commit, state }, { text, threadId }) {
    const postId = firebase.database().ref('posts').push().key
    const userId = state.authId
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
      commit('setItem', { resource: 'posts', id: postId, item: post })
      commit('appendPostToThread', { parentId: threadId, childId: postId })
      commit('appendContributorToThread', { parentId: threadId, childId: userId })
      commit('appendPostToUser', { parentId: userId, childId: postId })
      return Promise.resolve(state.posts[postId])
    })
  },
  updatePost ({ commit, state }, { postId, text }) {
    const post = state.posts[postId]
    const edited = {
      at: Math.floor(Date.now() / 1000),
      by: state.authId,
      moderated: false
    }

    const updates = { text, edited }

    firebase.database().ref('posts').child(postId).update(updates).then(() => {
      commit('setPost', { postId, post: { ...post, text, edited } })
      return Promise.resolve(post)
    })
  },
  createThread ({ commit, state, dispatch }, { title, text, forumId }) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const userId = state.authId
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
        commit('setItem', { resource: 'threads', id: threadId, item: thread })
        commit('appendThreadToForum', { parentId: forumId, childId: threadId })
        commit('appendThreadToUser', { parentId: userId, childId: threadId })

        // update post
        commit('setItem', { resource: 'posts', id: postId, item: post })
        commit('appendPostToThread', { parentId: threadId, childId: postId })
        commit('appendContributorToThread', { parentId: threadId, childId: userId })
        commit('appendPostToUser', { parentId: userId, childId: postId })

        resolve(state.threads[threadId])
      })
    })
  },
  updateThread ({ commit, state }, { title, text, threadId }) {
    const thread = state.threads[threadId]
    const postId = thread.firstPostId

    const post = state.posts[postId]
    const edited = {
      at: Math.floor(Date.now() / 1000),
      by: state.authId,
      moderated: false
    }

    const updates = {}
    updates[`threads/${threadId}/title`] = title
    updates[`posts/${postId}/text`] = text
    updates[`posts/${postId}/edited`] = edited

    firebase.database().ref().update(updates).then(() => {
      commit('setThread', { threadId, thread: { ...thread, title } })
      commit('setPost', { postId, post: { ...post, text, edited } })
      return Promise.resolve({ ...thread, title })
    })
  },
  createUser ({ commit, state }, { id, name, username, email, password = null, avatar = null }) {
    return new Promise((resolve, reject) => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { id, name, username, email, password, avatar, usernameLower, registeredAt }
      firebase.database().ref('users').child(id).set(user).then(() => {
        commit('setItem', { resource: 'users', id, item: user })

        resolve(state.users[id])
      })
    })
  },
  registerUserWithEmailAndPassword ({ commit, dispatch }, { name, username, email, password, avatar = null }) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        dispatch('createUser', { id: user.uid, name, username, email, password, avatar })
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
          return dispatch('createUser', { id: uid, name: displayName, username: email, email, avatar: photoURL }).then(() => dispatch('fetchAuthUser'))
        }
      })
    })
  },
  logOut ({ commit }) {
    return firebase.auth().signOut().then(() => {
      commit('setAuthId', null)
    })
  }
}
