<template>
  <div class="post" v-if="post && user">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <img @error="useDefaultAvatar" class="avatar-large" :src="user.avatar" :alt="user.name" />
      </a>
      <p class="desktop-only text-small">{{userThreadsCount}} threads</p>
      <p class="desktop-only text-small">{{userPostsCount}} posts</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div style="padding-right: 10px">{{post.text}}</div>
        <a
          v-if="isAuthorized"
          @click.prevent="editing = true"
          style="margin-left: auto;"
          class="link-unstyled"
          title="Make a change"
        >
          <i class="fa fa-pencil"></i>
        </a>
      </template>
      <post-editor
        v-if="editing"
        :post="post"
        @save="editing = false"
        @cancel="editing = false"
      ></post-editor>
    </div>
    <div class="post-date text-faded">
      <div class="edition-info" v-if="post.edited">
        Edited
      </div>
      <app-date :timestamp="post.publishedAt"></app-date>
    </div>
  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor'

export default {
  components: {
    PostEditor
  },
  props: {
    post: Object
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    isAuthorized () {
      return this.user['.key'] === this.$store.state.auth.authId
    },
    user () {
      return this.$store.state.users.items[this.post.userId]
    },
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    }
  },
  methods: {
    useDefaultAvatar (e) {
      e.target.src = require('@/assets/img/user.png')
    }
  }
}
</script>
