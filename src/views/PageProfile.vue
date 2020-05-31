<template>
    <div v-if="asyncDataStatus_ready" class="flex-grid">
      <div class="col-3 push-top">
        <user-profile-card
          v-if="!edit"
          :user="user"
        ></user-profile-card>
        <user-profile-card-editor
          v-else
          :user="user"
        ></user-profile-card-editor>
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{user.username}}'s recent activity</span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />

        <post-list :posts="userPosts"></post-list>
      </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  mixins: [asyncDataStatus],
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    }),
    userPosts () {
      return this.$store.getters['users/userPosts'](this.user['.key'])
    }
  },
  methods: {
    ...mapActions('posts', ['fetchPosts'])
  },
  created () {
    this.$store.dispatch('posts/fetchPosts', { ids: this.user.posts }).then(() => {
      this.asyncDataStatus_fetched()
      this.$emit('ready')
    })
  }
}
</script>
