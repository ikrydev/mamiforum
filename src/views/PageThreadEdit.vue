<template>
  <div v-if="isAuthorized && thread && text" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>

    <thread-editor
      ref="editor"
      @save="save"
      @cancel="cancel"
      :title="thread.title"
      :text="text"
    ></thread-editor>
  </div>
  <div class="text-center" v-else>
    <h1 class="push-top">Oops! You do not have access to edit this thread</h1>
    <router-link :to="{ name:'ThreadShow', params:{ id: $route.params.id }}">Back to Thread ?</router-link>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import ThreadEditor from '@/components/ThreadEditor'

export default {
  mixins: [asyncDataStatus],
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      saved: false
    }
  },
  computed: {
    isAuthorized () {
      return this.thread ? (this.thread.userId === this.$store.state.auth.authId) : null
    },
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    text () {
      const post = this.$store.state.posts.items[this.thread.firstPostId]
      return post ? post.text : null
    },
    hasUnsavedChanged () {
      if (!this.$refs.editor) return false
      const isTitleChanged = this.$refs.editor.form.title !== this.thread.title
      const isTextChanged = this.$refs.editor.form.text !== this.text
      return (isTitleChanged || isTextChanged) && !this.saved
    }
  },
  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),
    save ({ title, text }) {
      const threadId = this.thread['.key']
      this.updateThread({ title, text, threadId })
      this.saved = true
      this.$router.push({ name: 'ThreadShow', params: { id: threadId } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.thread['.key'] } })
    }
  },
  created () {
    this.fetchThread({ threadId: this.id })
      .then(thread => this.fetchPost({ postId: thread.firstPostId }))
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  },
  beforeRouteLeave (to, form, next) {
    if (this.hasUnsavedChanged) {
      const confirmed = window.confirm('Are you sure you want to leave? unSaved chanegd will be lost.')
      next(confirmed)
    } else {
      next()
    }
  }
}
</script>
