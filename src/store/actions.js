import firebase from 'firebase'

export default {
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

  fetchCategory: ({ dispatch }, { categoryId }) => dispatch('fetchItem', { resource: 'categories', id: categoryId, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { forumId }) => dispatch('fetchItem', { resource: 'forums', id: forumId, emoji: '📃' }),
  fetchThread: ({ dispatch }, { threadId }) => dispatch('fetchItem', { resource: 'threads', id: threadId, emoji: '📄' }),
  fetchPost: ({ dispatch }, { postId }) => dispatch('fetchItem', { resource: 'posts', id: postId, emoji: '📚' }),
  fetchUser: ({ dispatch }, { userId }) => dispatch('fetchItem', { resource: 'users', id: userId, emoji: '👨‍💼' }),

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
  }
}
