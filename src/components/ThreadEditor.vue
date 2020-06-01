<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
        @blur="$v.form.title.$touch()"
        v-model="form.title" />
      <template v-if="$v.form.title.$error">
        <span v-if="!$v.form.title.required" class="form-error">This field is required</span>
        <span v-if="!$v.form.title.minLength" class="form-error">The title must be at least 10 characters long</span>
      </template>
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea id="thread_content" class="form-input" name="content" rows="8" cols="140" v-model="form.text"></textarea>
      <template v-if="$v.form.text.$error">
        <span v-if="!$v.form.text.required" class="form-error">This field is required</span>
        <span v-if="!$v.form.text.minLength" class="form-error">The text of thread must be least 40 characters long. Type ad leat {{ 40 - form.text.length}} more</span>
      </template>
    </div>
    <div class="btn-group">
      <button @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{isUpdated ? 'Update' : 'Publish'}}
      </button>
    </div>
  </form>
</template>
<script>
import { minLength, required } from 'vuelidate/lib/validators'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(10)
      },
      text: {
        required,
        minLength: minLength(40)
      }
    }
  },
  computed: {
    isUpdated () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) return
      this.$emit('save', { ...this.form })
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
