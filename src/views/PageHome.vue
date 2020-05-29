<template>
  <div v-if="categories" class="col-full push-top">
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
  },
  beforeCreate () {
    this.$store.dispatch('fetchAllCategories').then(categories => {
      categories.forEach(category => {
        this.$store.dispatch('fetchForums', { ids: category.forums })
      })
    })
  }
}
</script>
