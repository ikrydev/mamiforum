<template>
  <div v-if="asyncDataStatus_ready" class="category-wrapper">
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
import asyncDataStatus from '@/mixins/asyncDataStatus'
import CategoryListItem from '@/components/CategoryListItem'

export default {
  mixins: [asyncDataStatus],
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
      return this.$store.state.categories.items[this.id]
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums'])
  },
  created () {
    this.fetchCategory({ categoryId: this.id })
      .then(category => this.fetchForums({ ids: category.forums }))
      .then(() => {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
      })
  }
}
</script>

<style scoped>
.category-wrapper{
  width: 100%;
}
</style>
