<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'

export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  }
}
</script>
