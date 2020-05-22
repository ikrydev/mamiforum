<template>
  <div id="app">
    <div class="container">
      <TheNavbar/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'

export default {
  components: {
    TheNavbar
  }
}
</script>

<style lang="scss">
@import "assets/css/style.css";

</style>
