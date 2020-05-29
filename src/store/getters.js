import { objectPropertiesCounter } from '@/utils'

export default {
  authUser (state) {
    return { name: 'fikri', avatar: '' }
    // return state.users[state.authId]
  },
  userPostsCount: state => userId => objectPropertiesCounter(state.users[userId].posts),
  userThreadsCount: state => userId => objectPropertiesCounter(state.users[userId].threads),
  threadRepliesCount: state => threadId => objectPropertiesCounter(state.threads[threadId].posts) - 1
}
