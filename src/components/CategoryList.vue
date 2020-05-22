<template>
  <div>
    <category-list-item
      v-for="category in categories"
      :key="category['.key']"
      :category="category">
    </category-list-item>
  </div>
</template>

<script>
import CategoryListItem from './CategoryListItem'

export default {
  components: {
    CategoryListItem
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>
