<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="showPage" @ready="pageReady"></router-view>
      <app-spinner v-show="!showPage"></app-spinner>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'

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
  methods: {
    pageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    NProgress.start()
    this.$router.beforeEach((to, form, next) => {
      this.showPage = false
      NProgress.start()
      next()
    })
  }
}
</script>

<style lang="scss">
@import "assets/css/style.css";
@import "~nprogress/nprogress.css";

#nprogress .bar{
  background: #57AD8D
}
</style>
