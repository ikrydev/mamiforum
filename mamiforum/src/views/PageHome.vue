<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <thread-list :threads="threads"></thread-list>
  </div>
</template>

<script>
import { threads } from '@/data'
import ThreadList from '@/components/ThreadList'

export default {
  components: {
    ThreadList
  },
  data () {
    return {
      threads: Object.values(threads)
    }
  }
}
</script>
