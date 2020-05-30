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
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  created () {
    this.fetchCategory({ categoryId: this.id }).then(category => {
      this.fetchForums({ ids: category.forums })
    })
  }
}
</script>

<style scoped>
.category-wrapper{
  width: 100%;
}
</style>
