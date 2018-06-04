<template>
  <div id="app">
    <transition name="bounce">
      <router-view></router-view>
    </transition>
  </div>
</template>



<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
height: 100vh;
}
</style>
