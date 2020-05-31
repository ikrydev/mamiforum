import { objectPropertiesCounter } from '@/utils'

export default {
  authUser: state => state.authId ? state.users[state.authId] : null,
  userPosts: state => userId => {
    const user = state.users[userId]
    if (user.posts) {
      return Object.values(state.posts)
        .filter(post => post.userId === userId)
    }
    return []
  },
  userPostsCount: state => userId => objectPropertiesCounter(state.users[userId].posts),
  userThreadsCount: state => userId => objectPropertiesCounter(state.users[userId].threads),
  threadRepliesCount: state => threadId => objectPropertiesCounter(state.threads[threadId].posts) - 1
}
