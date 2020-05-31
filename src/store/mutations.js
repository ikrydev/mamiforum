import Vue from 'vue'

const appendChildToParentMutation = ({ parent, child }) => (state, { parentId, childId }) => {
  const resource = state[parent][parentId]
  if (!resource[child]) {
    Vue.set(resource, child, {})
  }
  Vue.set(resource[child], childId, childId)
}

export default {
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
  setAuthId (state, userId) {
    state.authId = userId
  },
  appendContributorToThread: appendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
  appendPostToThread: appendChildToParentMutation({ parent: 'threads', child: 'posts' }),
  appendPostToUser: appendChildToParentMutation({ parent: 'users', child: 'posts' }),
  appendThreadToForum: appendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: appendChildToParentMutation({ parent: 'users', child: 'threads' })
}
