<template>
  <div>
    <div class="flex-grid">
      <div class="col-3 push-top">
        <div class="profile-card">
          <p class="text-center">
            <img
              :src="user.avatar"
              alt
              class="avatar-xlarge"
            />
          </p>

          <h1 class="title">{{user.username}}</h1>

          <p class="text-lead">{{user.name}}</p>

          <p class="text-justify">
            <span v-if="user.bio">{{user.bio}}</span>
            <span v-else>No bio specified.</span>
          </p>

          <span class="online">{{user.name}} is online</span>

          <div class="stats">
            <span>{{userPostsCount}} posts</span>
            <span>{{userThreadsCount}} threads</span>
          </div>

          <hr />

          <p class="text-large text-center">
            <i class="fa fa-globe"></i>
            <a v-if="user.website" :href="user.website">{{user.website}}</a>
          </p>
        </div>

        <p
          class="text-xsmall text-faded text-center"
        >Member since june 2020, last visited 2 hours ago</p>

        <div class="text-center">
          <hr />
          <a href="#" class="btn-green btn-small">Edit Profile</a>
        </div>
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{user.name}}'s recent activity</span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />

        <post-list :posts="userPosts"></post-list>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { objectPropertiesCounter } from '@/utils'
import PostList from '@/components/PostList'

export default {
  components: {
    PostList
  },
  computed: {
    ...mapGetters({
      user: 'authUser'
    }),
    userPosts () {
      return Object.values(this.$store.state.posts).filter(post => post.userId === this.user['.key'])
    },
    userPostsCount () {
      return objectPropertiesCounter(this.user.posts)
    },
    userThreadsCount () {
      return objectPropertiesCounter(this.user.threads)
    }
  }
}
</script>
