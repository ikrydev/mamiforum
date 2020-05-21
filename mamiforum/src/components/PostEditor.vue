<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea @keyup.enter="save" v-model="text" class="form-input" cols="30" rows="10"></textarea>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn-blue">Add Post</button>
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
      const postId = `newPost.${Math.random()}`
      const post = {
        '.key': postId,
        publishedAt: Math.floor(Date.now() / 1000),
        text: this.text,
        threadId: this.threadId,
        userId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
      }

      this.$emit('save', post)
      this.clearForm()
    },
    clearForm () {
      this.text = ''
    }
  }
}
</script>
