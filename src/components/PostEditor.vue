<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea v-model="text" class="form-input" cols="30" rows="10"></textarea>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn-blue">Submit Post</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      this.$store.dispatch('createPost', { ...post })
      this.clearForm()
    },
    clearForm () {
      this.text = ''
    }
  }
}
</script>
