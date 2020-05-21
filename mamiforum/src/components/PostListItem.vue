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
    <div
      class="post-date text-faded"
      :title="post.publishedAt | userFriendlyDate"
    >{{post.publishedAt | diffDate}}</div>
  </div>
</template>
<script>
import { users } from '@/data'
import moment from 'moment'

export default {
  props: {
    post: Object
  },
  computed: {
    user () {
      return users[this.post.userId]
    },
    userPostCount () {
      return Object.keys(this.user.posts).length
    }
  },
  filters: {
    userFriendlyDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    diffDate (date) {
      return moment.unix(date).fromNow()
    }
  }
}
</script>
