<template>
  <div>
    <div class="profile-card">
      <p class="text-center">
        <img :src="user.avatar" alt class="avatar-xlarge" />
      </p>

      <h1 class="title">{{user.username}}</h1>

      <p class="text-lead">{{user.name}}</p>

      <p class="text-justify">
        <span v-if="user.bio">{{user.bio}}</span>
        <span v-else>No bio specified.</span>
      </p>

      <span class="online">{{user.username}} is online</span>

      <div class="stats">
        <span>{{userPostsCount}} posts</span>
        <span>{{userThreadsCount}} threads</span>
      </div>

      <hr />

      <p v-if="user.website" class="text-large text-center">
        <i class="fa fa-globe"></i>
        <a :href="user.website"> {{user.website}}</a>
      </p>
    </div>

    <p class="text-xsmall text-faded text-center">
      <template v-if="user.registeredAt">
        Member since
        <app-date :timestamp="user.registeredAt"></app-date>
      </template>
      <template v-if="user.lastVisitAt">
        last visited
        <app-date :timestamp="user.lastVisitAt"></app-date>
      </template>
    </p>

    <div class="text-center">
      <hr />
      <router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small">
        Edit Profile
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    }
  }
}
</script>
