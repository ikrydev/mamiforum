<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            v-model="form.name"
            @blur="$v.form.name.$touch()"
            id="name"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="form-error">This field is required</span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model.lazy="form.username"
            @blur="$v.form.username.$touch()"
            id="username"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.username.$error">
            <span v-if="!$v.form.username.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.username.isUnique" class="form-error">Sorry! This username is taken</span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            @blur="$v.form.email.$touch()"
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
          />
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.email.email" class="form-error">please enter valid email address</span>
            <span v-if="!$v.form.email.isUnique" class="form-error">Sorry! This email is taken</span>
          </template>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            @blur="$v.form.password.$touch()"
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.password.minLength" class="form-error">The password must be at least 6 characters long</span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            v-model.lazy="form.avatar"
            @blur="$v.form.avatar.$touch()"
            id="avatar"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.avatar.$error">
            <span v-if="!$v.form.avatar.url" class="form-error">Please enter valid URL</span>
            <span v-if="!$v.form.avatar.supportedImageFile" class="form-error">This file type is not supported by our system, supported file types are .jpg, .jpeg, .png, .gif, .svg</span>
            <span v-if="!$v.form.avatar.responseOk" class="form-error">The supplied image cannot be found</span>
          </template>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click.prevent="registerWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, email, minLength, url } from 'vuelidate/lib/validators'
import { uniqueUsername, uniqueEmail, supportedImageFile, responseOk } from '@/utils/validators'

export default {
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      }
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        isUnique: uniqueUsername
      },
      email: {
        required,
        email,
        isUnique: uniqueEmail
      },
      password: {
        required,
        minLength: minLength(6)
      },
      avatar: {
        url,
        supportedImageFile,
        responseOk
      }
    }
  },
  methods: {
    ...mapActions('auth', ['registerUserWithEmailAndPassword', 'logInWithGoogle']),
    register () {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) return
      const { name, username, email, password, avatar } = this.form
      this.registerUserWithEmailAndPassword({ name, username, email, password, avatar })
        .then(() => this.$router.push({ name: 'Home' }))
    },
    registerWithGoogle () {
      this.logInWithGoogle().then(() => this.$router.push({ name: 'Home' }))
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
