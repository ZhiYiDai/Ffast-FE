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
  import WarningUtils from 'utils/WarningUtils'
  import DateUtils from 'utils/dateUtils'
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
      /**
       * 请求预警数据
       */
      queryWarning () {
        let remind = this.$store.state.remind;
        this.$store.dispatch('queryWarningData', (data) => {
          for (let i = 0; i < data.length; i++) {
            let remindKey = 'warning_lv_' + data[i].warningLevel;
            // 判断是否已经提醒过
            if (remind[remindKey] == null || !remind[remindKey].contains(data[i].id)) {
              WarningUtils.openNotice(data[i]);
              this.$nextTick(() => {
                document.getElementById('warning_' + data[i].id).addEventListener('click', () => {
                  this.$Notice.close('warning_' + data[i].id);
                  if (this.$router.currentRoute.path === '/warning/warning') {
                    this.broadcast('Warning', 'on-show-detail', data[i]);
                  } else {
                    WarningUtils.gotoWarning(this.$router, data[i]);
                  }
                });
              });
              // 加入到已提醒列表
              this.$store.dispatch('addRemind', {key: remindKey, id: data[i].id});
            }
          }
        });
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
      this.$on('on-show-warning-detail', (data) => {
        this.broadcast('Warning', 'on-show-detail', data);
      });
      return;
      // this.queryWarning();
      // this.queryBacklog();
      // setInterval(() => {
      //   this.queryWarning();
      //   timerCount++;
      //   // 每隔一段时间清除掉一些重要以上的已提醒项
      //   if (timerCount % 2 === 0) {
      //     this.$store.dispatch('removeRemind', 'warning_lv_5');
      //   }
      //   if (timerCount % 3 === 0) {
      //     this.$store.dispatch('removeRemind', 'warning_lv_4');
      //   }
      //   if (timerCount % 5 === 0) {
      //     this.$store.dispatch('removeRemind', 'warning_lv_3');
      //   }
      // }, 10000);
    },
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Levelbar
    }
  }
</script>
