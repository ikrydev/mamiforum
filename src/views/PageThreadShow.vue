<template>
  <div class="col-large push-top" v-if="thread && user">
    <h1>{{thread.title}}</h1>
    <router-link
      :to="{name: 'ThreadEdit', params: {id: thread['.key']}}"
    ><i class="fa fa-pencil"></i> Edit Thread</router-link>
    <p>
      By <a href="#" class="link-unstyled">{{user.name}}</a>, <app-date :timestamp="thread.publishedAt"></app-date>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{repliesCount}} replies by {{contributorsCount}} contributors
      </span>
    </p>
    <post-list :posts="posts"></post-list>
    <post-editor :threadId="id"></post-editor>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { objectPropertiesCounter } from '@/utils'

export default {
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
    thread () {
      return this.$store.state.threads[this.id]
    },
    posts () {
      const postIds = Object.keys(this.thread.posts)
      return Object.values(this.$store.state.posts).filter(post => postIds.includes(post['.key']))
    },
    user () {
      return this.$store.state.users[this.thread.userId]
    },
    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.id)
    },
    contributorsCount () {
      return objectPropertiesCounter(this.thread.contributors)
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts', 'fetchUser'])
  },
  created () {
    this.fetchThread({ threadId: this.id }).then(thread => {
      console.log(thread)
      this.fetchUser({ userId: thread.userId })
      this.fetchPosts({ ids: Object.keys(thread.posts) }).then(posts => {
        posts.forEach(post => this.fetchUser({ userId: post.userId }))
      })
    })
  }
}
</script>
