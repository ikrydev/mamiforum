<template>
  <div class="forum-list">
    <h2 class="list-title">
      <a href="#">Forums</a>
    </h2>
    <forum-list-item
      v-for="forum in forums"
      :key="forum['.key']"
      :forum="forum"
    ></forum-list-item>
  </div>
</template>
<script>
import ForumListItem from './ForumListItem'

export default {
  components: {
    ForumListItem
  },
  props: {
    forums: {
      type: Array,
      required: true
    }
  }
}
</script>
