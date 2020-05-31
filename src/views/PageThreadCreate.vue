<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>

    <thread-editor
      ref="editor"
      @save="save"
      @cancel="cancel"
    ></thread-editor>
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
    forum () {
      return this.$store.state.forums[this.id]
    },
    hasUnsavedChanged () {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'createThread']),
    async save ({ title, text }) {
      const forumId = this.id
      const thread = await this.createThread({ title, text, forumId })
      this.saved = true
      this.$router.push({ name: 'ThreadShow', params: { id: thread['.key'] } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.id } })
    }
  },
  created () {
    this.fetchForum({ forumId: this.id }).then(() => {
      this.asyncDataStatus_fetched()
      this.$emit('ready')
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanged) {
      const confirmed = window.confirm('Are you sure you want to leave? unSaved chanegd will be lost.')
      next(confirmed)
    } else {
      next()
    }
  }
}
</script>
