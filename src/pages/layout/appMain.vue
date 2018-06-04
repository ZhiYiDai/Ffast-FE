<style scoped>
  .layout-content {
    margin: 15px 15px 5px 15px;
    min-height: calc(100vh - 130px);
    overflow-y: yes;
  }

  .layout-content-main {
    height: 100%;
  }

  .layout-copy {
    text-align: center;
    color: #9ea7b4;
    height: 20px;
   line-height: 20px;
  }

</style>


<template>
  <div>
    <div class="layout-content">
      <div class="layout-content-main">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
      </div>
    </div>
    <div class="layout-copy">
      {{footerText}}
    </div>
  </div>
</template>

<script>
  import config from '@/config'
  export default {
    name:'appMain',
    props: ['menuSmall'],
    created() {

    },
    data() {
      return {
        footerText:config.footerText
      }
    },
    methods: {}
  }
</script>
