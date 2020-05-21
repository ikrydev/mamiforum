<template>
  <div>
    <div class="col-large push-top">
      <h1>{{thread.title}}</h1>
      <p>
        By <a href="#" class="link-unstyled">{{user.name}}</a>, <app-date :timestamp="thread.publishedAt"></app-date>.
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{posts.length}} replies by 3 contributors</span>
      </p>
      <post-list :posts="posts"></post-list>
      <post-editor @save="addPost" :threadId="id"></post-editor>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'

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
  data () {
    return {
      thread: sourceData.threads[this.id],
      newPostText: ''
    }
  },
  computed: {
    posts () {
      const postIds = Object.keys(this.thread.posts)
      return Object.values(sourceData.posts).filter(post => postIds.includes(post['.key']))
    },
    user () {
      return sourceData.users[this.thread.userId]
    }
  },
  methods: {
    addPost (postData) {
      const { '.key': postId, userId } = postData

      this.$set(sourceData.posts, postId, postData)
      this.$set(sourceData.users[userId].posts, postId, postId)
      this.$set(this.thread.posts, postId, postId)
    }
  }
}
</script>
