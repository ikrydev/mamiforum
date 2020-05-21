<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{name:'ThreadShow', params: { id: thread['.key'] }}">{{thread.title}}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By
        <a href="#">{{user.name}}</a>,
        <span :title="thread.publishedAt | userFriendlyDate">{{thread.publishedAt | diffDate}}</span>.
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">{{repliesCount}} reply</p>

      <!-- <img
        class="avatar-medium"
        src="http://i0.kym-cdn.com/photos/images/facebook/000/010/934/46623-batman_pikachu_super.png"
        alt
      />

      <div>
        <p class="text-xsmall">
          <a href="#">Bruce Wayne</a>
        </p>
        <p class="text-xsmall text-faded">2 hours ago</p>
      </div> -->

    </div>
  </div>
</template>
<script>
import { users } from '@/data'
import moment from 'moment'

export default {
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  computed: {
    repliesCount () {
      return Object.keys(this.thread.posts).length - 1
    },
    user () {
      return users[this.thread.userId]
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
