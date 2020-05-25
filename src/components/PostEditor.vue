<template>
  <form @submit.prevent="save" class="col-full">
    <div class="form-group">
      <textarea v-model="text" class="form-input" cols="30" rows="10"></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isEditing" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button type="submit" class="btn-blue">{{isEditing ? 'Update Post' : 'Submit Post'}}</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    threadId: {
      type: String,
      validator: value => {
        const valid = typeof value === 'string'
        if (!valid) {
          console.error('Oops! props thread is not a valid 😜')
        }

        return valid
      }
    },
    post: {
      type: Object,
      validator: value => {
        const keyIsValid = typeof value['.key'] === 'string'
        const textIsValid = typeof value.text === 'string'
        const valid = keyIsValid && textIsValid
        if (!valid) {
          console.error('Oops! props key or text is not valid 😜')
        }

        return valid
      }
    }
  },
  data () {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  computed: {
    isEditing () {
      return !!this.post
    }
  },
  methods: {
    save () {
      (this.isEditing ? this.update() : this.create()).then(post => {
        this.clearForm()
        this.$emit('save', { post })
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    create () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }

      return this.$store.dispatch('createPost', { ...post })
    },
    update () {
      const post = {
        postId: this.post['.key'],
        text: this.text
      }

      return this.$store.dispatch('updatePost', { ...post })
    },
    clearForm () {
      this.text = ''
    }
  }
}
</script>
