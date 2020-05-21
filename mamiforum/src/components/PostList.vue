<template>
  <div class="post-list">
    <post-list-item
      v-for="post in posts"
      :key="post['.key']"
      :post="post">
    </post-list-item>
  </div>
</template>

<script>
import PostListItem from './PostListItem'

export default {
  components: {
    PostListItem
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
}
</script>
