<style scoped>
  .perms-valid-panel {
    display: inline-block;
  }
</style>
<template>
  <div v-if="isValid" class="perms-valid-panel">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['permsName'],
    created () {
      if (this.permsName == null) {
        this.isValid = true;
      } else {
        this.isValid = OperatorUtils.getPermsData().contains(this.permsName);
      }
    },
    data () {
      return {
        isValid: false
      };
    }
  };
</script>
