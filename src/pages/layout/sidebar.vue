<style rel="stylesheet/scss" lang="scss" scoped>
  $sidebarWidth: 200px;
  $sidebarSmallWidth: 42px;

  .layout-menu-left {
    background: #3e3e3e;
    height: 100vh;
    width: $sidebarWidth;
    position: absolute;
    z-index: 100;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .layout-menu-left:hover{
    overflow-y: auto;
  }

  .layout-menu-left-small {
    width: $sidebarSmallWidth;
  }

  .layout-menu-left-small .ivu-menu ul {
    display: none;
  }

  .layout-logo-left {
    height: 45px;
    margin: 20px 10px;

    background: url("../../../static/assets/img/logo.png") no-repeat ;
  }

  .layout-menu-left-small .layout-logo-left {
    background-position-x: 0%;
    background-size: cover;
    height: 38px;
    margin: 23px 0px;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background-color: #333;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-menu-left-small .ivu-menu span {
    display: none !important;
  }

  .layout-menu-left .ivu-menu span, .layout-menu-left .ivu-menu-item {
    transition: opacity 2s linear;
    font-size: 12px;
  }

  .layout-menu-left .ivu-menu-item {
    font-size: 10px;
  }

  .layout-menu-left-small .ivu-menu .ivu-icon {
    font-size: 20px;
  }

  .layout-menu-left:hover {
    box-shadow: 0 0px 20px rgba(0, 0, 0, .5);
  }

  .layout-menu-left::-webkit-scrollbar {
    width: 6px;
  }

  .layout-menu-left::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.25);
  }
</style>

<style>
  .layout-menu-left-small .ivu-menu .ivu-menu-submenu-title-icon {
    display: none !important;
  }

  .layout-menu-left .ivu-menu-submenu-title {
    padding: 12px 16px;
    overflow: visible;
  }

  .layout-menu-left-small .ivu-menu-submenu-title {
    padding: 14px 13px !important;
  }

  .layout-menu-left-small .ivu-menu ul {
    display: none;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
    background: #3E3E3E;
  }

  .ivu-menu-dark {
    background: #3e3e3e;
  }

  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background: #494949 !important;
  }

  .layout-menu-left .ivu-menu-submenu-title, .layout-menu-left .ivu-menu {
    width: 200px;
  }
</style>

<template>
  <div class="ease-in-out layout-menu-left" :class="{'layout-menu-left-small': menuSmall && !menuHover}"
       v-on:mouseleave="()=>{setMenuHover(false)}" v-on:mouseenter="()=>{setMenuHover(true)}">
    <i-menu theme="dark" width="auto" :accordion="true" :active-name="activeName" :open-names="openNames" ref="menu">
      <div class="layout-logo-left"></div>
      <Submenu v-for="item in menuData" :name="item.id" :key="item.id">
        <template slot="title">
          <Icon :type="item.icon"></Icon>
          <span>{{item.title}}</span>
        </template>
        <router-link v-for="childrenItem in item.children" :to="childrenItem.url" :key="childrenItem.id">
          <MenuItem :name="childrenItem.id" :key="childrenItem.id">
            <Icon :type="childrenItem.icon" v-show="childrenItem.icon"></Icon>
            <span>{{childrenItem.title}}</span>
          </MenuItem>
        </router-link>
      </Submenu>
    </i-menu>
  </div>
</template>


<script>

  import common from '@/utils/common'

  export default {
    name: 'sidebar',
    props: ['menuSmall'],
    data () {
      return {
        menuHover: false,
        menuData: null,
        activeName: '',
        openNames: []
      }
    },
    created: function () {
      this.menuData = common.constructTree(OperatorUtils.getMenuData(), 'name');
      this.updateCurMenu();
    },
    computed: {},
    methods: {
      setMenuHover(hover){
        if (this.menuSmall) {
          this.menuHover = hover;
        }
      },
      getMenu (path) {
        let menu = OperatorUtils.getMenuData();
        for (let i = 0; i <= menu.length; i++) {
          if (menu[i] != null && menu[i].url == path) {
            return menu[i];
          }
        }
      },
      updateCurMenu(){
        let curMenu = this.getMenu(this.$router.currentRoute.path);
        if (curMenu != null) {
          this.activeName = curMenu.id;
          this.openNames[0] = curMenu.parentId;
        } else {
          this.activeName = '';
        }
      }
    },
    watch: {
      $route () {
        this.updateCurMenu();
      }
    },
    components: {}
  }
</script>
