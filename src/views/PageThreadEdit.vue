<template>
  <div class="col-full push-top">
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
      return this.$store.state.posts[this.thread.firstPostId].text
    }
  },
  methods: {
    save ({ title, text }) {
      const threadId = this.thread['.key']
      this.$store.dispatch('updateThread', { title, text, threadId })
      this.$router.push({ name: 'ThreadShow', params: { id: threadId } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.thread['.key'] } })
    }
  }
}
</script>
