<template>
  <div class="col-large push-top" v-if="thread && user">
    <h1>{{thread.title}}</h1>
    <router-link
      v-if="isAuthorized"
      :to="{name: 'ThreadEdit', params: {id: thread['.key']}}"
    ><i class="fa fa-pencil"></i> Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">{{user.name}}</a>, <app-date :timestamp="thread.publishedAt"></app-date>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{repliesCount}} replies by {{contributorsCount}} contributors
      </span>
    </p>
    <post-list :posts="posts"></post-list>
    <post-editor
      v-if="authUser"
      :threadId="id">
    </post-editor>
    <div v-else class="text-center" style="margin-bottom:50px">
      <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }">Log In</router-link> or
      <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { objectPropertiesCounter } from '@/utils'

export default {
  mixins: [asyncDataStatus],
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    isAuthorized () {
      return this.thread.userId === this.$store.state.auth.authId
    },
    posts () {
      const postIds = Object.keys(this.thread.posts)
      return Object.values(this.$store.state.posts.items).filter(post => postIds.includes(post['.key']))
    },
    user () {
      return this.$store.state.users.items[this.thread.userId]
    },
    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.id)
    },
    contributorsCount () {
      return objectPropertiesCounter(this.thread.contributors)
    }
  },
  methods: {
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('posts', ['fetchPosts']),
    ...mapActions('users', ['fetchUser'])
  },
  created () {
    this.fetchThread({ threadId: this.id })
      .then(thread => {
        this.fetchUser({ userId: thread.userId })
        return this.fetchPosts({ ids: thread.posts })
      })
      .then(posts => Promise.all(posts.map(post => this.fetchUser({ userId: post.userId }))))
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  }
}
</script>
