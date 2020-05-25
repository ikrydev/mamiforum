<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <img class="avatar-large" :src="user.avatar" :alt="user.name" />
      </a>
      <p class="desktop-only text-small">{{userPostCount}} posts</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div style="padding-right: 10px">{{post.text}}</div>
        <a @click.prevent="editing = true" style="margin-left: auto;" class="link-unstyled" title="Make a change">
          <i class="fa fa-pencil"></i>
        </a>
      </template>
      <post-editor
        v-if="editing"
        :post="post"
        @save="editing = false"
        @cancel="editing = false"
      ></post-editor>
    </div>
    <div class="post-date text-faded">
      <div class="edition-info" v-if="post.edited">
        Edited
      </div>
      <app-date :timestamp="post.publishedAt"></app-date>
    </div>
  </div>
</template>

<script>
import { objectPropertiesCounter } from '@/utils'
import PostEditor from '@/components/PostEditor'

export default {
  components: {
    PostEditor
  },
  props: {
    post: Object
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    user () {
      return this.$store.state.users[this.post.userId]
    },
    userPostCount () {
      return objectPropertiesCounter(this.user.posts)
    }
  }
}
</script>
