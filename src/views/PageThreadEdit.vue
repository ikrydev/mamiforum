<template>
  <div v-if="thread" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>

    <thread-editor
      @save="save"
      @cancel="cancel"
      :title="thread.title"
      :text="text"
    ></thread-editor>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'

export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    }
  },
  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    save ({ title, text }) {
      const threadId = this.thread['.key']
      this.updateThread({ title, text, threadId })
      this.$router.push({ name: 'ThreadShow', params: { id: threadId } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.thread['.key'] } })
    }
  },
  created () {
    this.fetchThread({ threadId: this.id }).then(thread => {
      this.fetchPost({ postId: thread.firstPostId })
    })
  }
}
</script>
