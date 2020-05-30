<template>
  <div :class="$style.centered" class="push-top">
    <h1 :class="$style.headingLarge">Oops!,Not Found!</h1>
    <p :class="$style.textLarge">We couldn't find what are you looking for. why don't you go
      <router-link :to="{name:'Home'}">home instead ?</router-link>
    </p>
  </div>
</template>
<script>

export default {
  created () {
    this.$emit('ready')
  }
}
</script>
<style module>
.headingLarge{
  font-size: 80px;
}
.textLarge{
  font-size: 24px;
  font-weight: 100;
}
.centered{
  text-align: center;
}
</style>
