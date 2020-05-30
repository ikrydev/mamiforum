<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="showPage" @ready="showPage = true"></router-view>
      <app-spinner v-show="!showPage"></app-spinner>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'

export default {
  components: {
    TheNavbar,
    AppSpinner
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
