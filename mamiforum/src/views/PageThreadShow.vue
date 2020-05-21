<template>
  <div>
    <div class="col-large push-top">
      <h1>{{thread.title}}</h1>
      <post-list :posts="posts"></post-list>
    </div>
  </div>
</template>

<script>
import { threads, posts } from '@/data'
import PostList from '@/components/PostList'

export default {
  components: {
    PostList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    thread () {
      return threads[this.id]
    },
    posts () {
      return Object.values(posts).filter(post => post.threadId === this.id)
    }
  }
}
</script>
