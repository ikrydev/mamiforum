<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link :to="{name: 'ThreadCreate', params: {id: forum['.key']}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>
    <div class="col-full push-top">
      <thread-list :threads="threads"></thread-list>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { mapActions } from 'vuex'
import ThreadList from '@/components/ThreadList'

export default {
  mixins: [asyncDataStatus],
  components: {
    ThreadList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.items[this.id]
    },
    threads () {
      return Object.values(this.$store.state.threads.items).filter(thread => thread.forumId === this.id)
    }
  },
  methods: {
    ...mapActions('threads', ['fetchThreads']),
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('users', ['fetchUser'])
  },
  created () {
    this.fetchForum({ forumId: this.id }).then(forum => {
      if (!forum.threads) {
        this.asyncDataStatus_fetched()
        this.$emit('ready')
        return
      }
      this.fetchThreads({ ids: forum.threads })
        .then(threads => {
          return Promise.all(threads.map(thread => this.fetchUser({ userId: thread.userId })))
        })
        .then(() => {
          this.asyncDataStatus_fetched()
          this.$emit('ready')
        })
    })
  }
}
</script>

<style scoped>
.forum-wrapper{
  width: 100%;
}
</style>
