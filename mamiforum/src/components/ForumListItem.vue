<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link class="text-xlarge" :to="{ name: 'Forum', params: { id: forum['.key'] }}">
        {{forum.name}}
      </router-link>
      <p>{{forum.description}}</p>
    </div>

    <div class="threads-count">
      <p>
        <span class="count">{{threadLength}}</span>
        {{threadLength === 1 ? 'thread' : 'threads'}}
      </p>
    </div>

    <!-- TODO: implement last thread -->
  </div>
</template>
<script>
export default {
  props: {
    forum: {
      type: Object,
      required: true
    }
  },
  computed: {
    threadLength () {
      return this.forum.threads ? Object.keys(this.forum.threads).length : 0
    }
  }
}
</script>
