<template>
    <div class="flex-grid">
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
import { mapGetters } from 'vuex'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'

export default {
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
      user: 'authUser'
    }),
    userPosts () {
      return Object.values(this.$store.state.posts).filter(post => post.userId === this.user['.key'])
    }
  }
}
</script>
