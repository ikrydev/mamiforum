<template>
  <div v-if="category" class="category-wrapper">
    <div class="col-full push-top">
      <h1>{{category.name}}</h1>
    </div>

    <div class="col-full">
      <category-list-item :category="category"></category-list-item>
    </div>
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'

export default {
  components: {
    CategoryListItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories[this.id]
    }
  },
  created () {
    this.$store.dispatch('fetchCategory', { categoryId: this.id }).then(category => {
      this.$store.dispatch('fetchForums', { ids: category.forums })
    })
  }
}
</script>

<style scoped>
.category-wrapper{
  width: 100%;
}
</style>
