<style scoped>
  .layout {
    background: #f5f7f9;
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background-color: #333;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-right-small {
    width: 100%;
    padding-left: 42px;
    overflow: auto;
    height: 100vh;
  }

  .layout-right {
    width: 100%;
    padding-left: 200px;
    overflow: auto;
    height: 100vh;
  }


</style>
<template>
  <div class="layout">
    <Row type="flex">
      <Sidebar :menuSmall="menuSmall"></Sidebar>
      <div class="ease-in-out" :class="menuSmall?'layout-right-small':'layout-right'">
        <Navbar :toggleClick="toggleClick"></Navbar>
        <Levelbar :showTabs="true"></Levelbar>
        <AppMain :menuSmall="menuSmall"></AppMain>
      </div>
    </Row>
  </div>
</template>
<script>
  let timerCount = 0;
  import { Navbar, Sidebar, AppMain, Levelbar } from './index.js';
  import DateUtils from 'utils/DateUtils'
  import Emitter from '@/utils/mixins/emitter'
  export default {
    name: 'Home',
    mixins: [Emitter],
    data () {
      return {
        menuSmall: false
      }
    },
    computed: {},
    methods: {
      toggleClick () {
        this.menuSmall = !this.menuSmall;
      },
      queryBacklog () {
        this.$store.dispatch('queryBacklogData', (data) => {
        });
      }
    },
    created () {
      this.$on('on-query-backlog', (data) => {
        this.queryBacklog();
      });
      this.queryBacklog();

    },
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Levelbar
    }
  }
</script>
