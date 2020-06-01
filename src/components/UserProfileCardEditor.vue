<template>
  <div>
    <div class="profile-card">
      <p class="text-center">
        <img
          :src="user.avatar"
          alt
          class="avatar-xlarge img-update"
        />
      </p>

      <div class="form-group">
        <input
          type="text"
          @blur="$v.activeUser.username.$touch()"
          v-model.lazy="activeUser.username"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />

        <template v-if="$v.activeUser.username.$error">
          <span v-if="!$v.activeUser.username.required" class="form-error">This field is required</span>
          <span v-if="!$v.activeUser.username.isUnique" class="form-error">Sorry! This username is taken</span>
        </template>
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="activeUser.name"
          placeholder="Full Name"
          class="form-input text-lead"
        />

        <template v-if="$v.activeUser.name.$error">
          <span v-if="!$v.activeUser.name.required" class="form-error">This field is required</span>
        </template>
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          class="form-input"
          v-model="activeUser.bio"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{userPostsCount}} posts</span>
        <span>{{userThreadsCount}} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_website"
          v-model="activeUser.website" />

        <template v-if="$v.activeUser.website.$error">
          <span v-if="!$v.activeUser.website.url" class="form-error">please enter valid URL</span>
        </template>
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_email"
          @blur="$v.activeUser.email.$touch()"
          v-model.lazy="activeUser.email"
        />

        <template v-if="$v.activeUser.email.$error">
          <span v-if="!$v.activeUser.email.required" class="form-error">This field is required</span>
          <span v-if="!$v.activeUser.email.email" class="form-error">please enter valid email address</span>
          <span v-if="!$v.activeUser.email.isUnique" class="form-error">Sorry! This email is taken</span>
        </template>
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_location"
          v-model="activeUser.location"
        />
      </div>

      <div class="btn-group space-between">
        <button @click.prevent="cancel" class="btn-ghost">Cancel</button>
        <button @click.prevent="save" class="btn-blue">Save</button>
      </div>
    </div>

    <p class="text-xsmall text-faded text-center">
      <template v-if="activeUser.registeredAt">
        Member since
        <app-date :timestamp="activeUser.registeredAt"></app-date>
      </template>
      <template v-if="activeUser.lastVisitAt">
        last visited
        <app-date :timestamp="activeUser.lastVisitAt"></app-date>
      </template>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, email, url } from 'vuelidate/lib/validators'
import { uniqueUsername, uniqueEmail } from '@/utils/validators'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeUser: { ...this.user }
    }
  },
  validations: {
    activeUser: {
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
      website: {
        url
      }
    }
  },
  computed: {
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    }
  },
  methods: {
    ...mapActions('users', ['updateProfile']),
    save () {
      this.$v.activeUser.$touch()
      if (this.$v.activeUser.$invalid) return
      const user = {
        ...this.activeUser
      }
      this.updateProfile(user).then(() => {
        this.$router.push({ name: 'Profile' })
      })
    },
    cancel () {
      this.$router.push({ name: 'Profile' })
    }
  }
}
</script>
