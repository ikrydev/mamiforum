<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="login" action class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="text"
            class="form-input"
          />
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">This field is required</span>
            <span v-if="!$v.form.email.email" class="form-error">please enter valid email address</span>
          </template>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">This field is required</span>
          </template>
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }">
            Create an account?
          </router-link>
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall" @click.prevent="logInWithGoogleAccount">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { email, required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    ...mapActions('auth', ['logInUserWithEmailAndPassword', 'logInWithGoogle']),
    login () {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) return
      const { email, password } = this.form
      this.logInUserWithEmailAndPassword({ email, password })
        .then(() => this.successRedirect())
        .catch(err => alert(`👨‍💼 : ${err.message}`))
    },
    logInWithGoogleAccount () {
      this.logInWithGoogle()
        .then(() => this.successRedirect())
        .catch(err => alert(`👨‍💼 : ${err.message}`))
    },
    successRedirect () {
      const redirectURL = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectURL)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
