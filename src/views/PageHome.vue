<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import { threads, forums, categories } from '@/data'
// import ThreadList from '@/components/ThreadList'
// import ForumList from '@/components/ForumList'
import CategoryList from '@/components/CategoryList'

export default {
  components: {
    CategoryList
  },
  data () {
    return {
      threads: Object.values(threads),
      forums: Object.values(forums),
      categories: Object.values(categories)
    }
  }
}
</script>
