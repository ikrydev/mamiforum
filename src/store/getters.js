import { objectPropertiesCounter } from '@/utils'

export default {
  authUser: state => state.authId ? state.users[state.authId] : null,
  userPostsCount: state => userId => objectPropertiesCounter(state.users[userId].posts),
  userThreadsCount: state => userId => objectPropertiesCounter(state.users[userId].threads),
  threadRepliesCount: state => threadId => objectPropertiesCounter(state.threads[threadId].posts) - 1
}
