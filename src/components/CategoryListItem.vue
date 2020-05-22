<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link :to="{name: 'Category', params: {id: category['.key']}}">
        {{category.name}}
      </router-link>
    </h2>
    <forum-list :forums="categoryForum"></forum-list>
  </div>
</template>

<script>
import ForumList from './ForumList'
import { forums } from '@/data'

export default {
  components: {
    ForumList
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    categoryForum () {
      return Object.values(forums).filter(forum => forum.categoryId === this.category['.key'])
    }
  }
}
</script>
