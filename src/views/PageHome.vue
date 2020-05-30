<template>
  <div v-if="categories" class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  created () {
    this.fetchAllCategories().then(categories => {
      categories.forEach(category => {
        this.fetchForums({ ids: category.forums })
      })
    })
  }
}
</script>
