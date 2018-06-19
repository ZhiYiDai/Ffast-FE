<style scoped>
  .layout-copy {
    text-align: center;
    color: #9ea7b4;
    height: 20px;
    line-height: 20px;
  }

</style>


<template>
  <div class="layout-copy">
    {{footerText}}
  </div>
</template>

<script>
  import config from '@/config';
  export default {
    created () {

    },
    data () {
      return {
        footerText: config.footerText
      }
    },
    methods: {}
  }
</script>
