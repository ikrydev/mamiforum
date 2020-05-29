<template>
  <div v-if="forum" class="col-full push-top">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>

    <thread-editor
      @save="save"
      @cancel="cancel"
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
    forum () {
      return this.$store.state.forums[this.id]
    }
  },
  methods: {
    async save ({ title, text }) {
      const forumId = this.id
      const thread = await this.$store.dispatch('createThread', { title, text, forumId })
      this.$router.push({ name: 'ThreadShow', params: { id: thread['.key'] } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.id } })
    }
  },
  created () {
    this.$store.dispatch('fetchForum', { forumId: this.id })
  }
}
</script>
