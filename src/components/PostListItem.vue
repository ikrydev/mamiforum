<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <img class="avatar-large" :src="user.avatar" :alt="user.name" />
      </a>
      <p class="desktop-only text-small">{{userPostCount}} posts</p>
    </div>
    <div class="post-content">
      <div>{{post.text}}</div>
    </div>
    <div class="post-date text-faded">
      <app-date :timestamp="post.publishedAt"></app-date>
    </div>
  </div>
</template>

<script>
import { objectPropertiesCounter } from '@/utils'

export default {
  props: {
    post: Object
  },
  computed: {
    user () {
      return this.$store.state.users[this.post.userId]
    },
    userPostCount () {
      return objectPropertiesCounter(this.user.posts)
    }
  }
}
</script>
