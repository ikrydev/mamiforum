<template>
  <div>
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <thread-list-item
        v-for="thread in threads"
        :key="thread['.key']"
        :thread="thread">
      </thread-list-item>
    </div>
  </div>
</template>
<script>
import ThreadListItem from './ThreadListItem'

export default {
  components: {
    ThreadListItem
  },
  props: {
    threads: {
      type: Array,
      required: true
    }
  }
}
</script>
