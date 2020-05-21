<template>
  <div class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <a href="new-thread.html" class="btn-green btn-small">Start a thread</a>
      </div>
    </div>
    <div class="col-full push-top">
      <thread-list :threads="threads"></thread-list>
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { forums, threads } from '@/data'

export default {
  components: {
    ThreadList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return forums[this.id]
    },
    threads () {
      return Object.values(threads).filter(thread => thread.forumId === this.id)
    }
  }
}
</script>

<style scoped>
.forum-wrapper{
  width: 100%;
}
</style>
