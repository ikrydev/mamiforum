<template>
  <form @submit.prevent="save" :class="{'col-full':isEditing}">
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
import { mapActions } from 'vuex'

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
    ...mapActions('posts', ['createPost', 'updatePost']),
    save () {
      if (this.text === '') {
        alert('Please type something before submit post!')
        return false
      }
      this.persist().then(post => {
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

      return this.createPost({ ...post })
    },
    update () {
      const post = {
        postId: this.post['.key'],
        text: this.text
      }

      return this.updatePost({ ...post })
    },
    clearForm () {
      this.text = ''
    },
    persist () {
      return (this.isEditing ? this.update() : this.create())
    }
  }
}
</script>
