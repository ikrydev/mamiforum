<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <forum-list :forums="forums"></forum-list>
    <thread-list :threads="threads"></thread-list>
  </div>
</template>

<script>
import { threads, forums } from '@/data'
import ThreadList from '@/components/ThreadList'
import ForumList from '@/components/ForumList'

export default {
  components: {
    ThreadList,
    ForumList
  },
  data () {
    return {
      threads: Object.values(threads),
      forums: Object.values(forums)
    }
  }
}
</script>
