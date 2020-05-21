<template>
  <div>
    <div class="col-large push-top">
      <h1>{{thread.title}}</h1>
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
