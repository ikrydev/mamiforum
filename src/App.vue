<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="showPage" @ready="showPage = true"/>
      <div v-show="!showPage">Loading...</div>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  components: {
    TheNavbar
  },
  data () {
    return {
      showPage: false
    }
  },
  created () {
    this.$router.beforeEach((to, form, next) => {
      this.showPage = false
      next()
    })
  }
}
</script>

<style lang="scss">
@import "assets/css/style.css";

</style>
