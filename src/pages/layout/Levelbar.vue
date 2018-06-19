<style scoped>
  .levelbar-breadcrumb {
    padding: 12px 15px;
    position: absolute;
    left: 0;
  }

  .levelbar-tabs {
    padding: 10px 12px 0px 15px;
    position: absolute;
    right: 0;
  }

  .levelbar-row {
    height: 30px
  }


</style>
<style>
  .levelbar-tabs .ivu-tag, .levelbar-tabs .ivu-tag-border {
    height: 26px !important;
    line-height: 26px !important;
  }
</style>
<template>

  <row class="levelbar-row">
    <Breadcrumb class="levelbar-breadcrumb" separator="/">
      <Breadcrumb-item v-for="(item,index) in levelList" :key="item.name" :href="item.url">
        <Icon :type="item.icon" v-if="item.icon"></Icon>
        {{item.name}}
      </Breadcrumb-item>
    </Breadcrumb>
    <div v-if="showTabs" class="levelbar-tabs">
      <template v-if="pathList!=null && pathList.length>1" v-for="(item, index) in pathList">
        <Tag
          @click.native="tagClick(item.url)"
          :closable="index==hoverIndex"
          :type="item.url==curPath ?'':'border'"
          :color="item.url==curPath ?'#5c6b77':''"
          @mouseleave.native="()=>{setHover(null)}"
          @mouseenter.native="()=>{if(item.url!=curPath){setHover(index)}}"
          @on-close="handleClose(index)"
        >
          {{item.name}}
        </Tag>
      </template>
    </div>

  </row>
</template>

<script>
  export default {
    name: 'levelbar',
    props: {
      showTabs: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        levelList: null,
        pathList: [],
        curPath: '',
        hoverIndex: null
      };
    },
    methods: {
      getBreadcrumb () {
        let matched = [];
        let mainUrl = OperatorUtils.getMain();
        matched.push({name: '首 页', url: mainUrl, icon: 'home'});
        let path = this.$route.path;
        let menuData = OperatorUtils.getMenuData();
        let isEditPage = false;
        if (path.indexOf('/edit') > -1) {
          path = path.replace('/edit', '');
          isEditPage = true;
        }
        this.curPath = path;
        for (let i in menuData) {
          if (menuData[i].url === path) {
            if (menuData[i].parentId != null && menuData[i].parentId > 0) {
              for (let j in menuData) {
                if (menuData[i].parentId === menuData[j].id) {
                  matched.push({name: menuData[j].name, url: menuData[j].url, icon: menuData[j].icon});
                }
              }
            }
            let md = {name: menuData[i].name, url: menuData[i].url};
            matched.push(md);
            this.addTab(md);
          }
        }
        if (matched.length === 1 && path !== mainUrl) {
          matched.push({name: this.$route.name, url: path});
        }
        if (isEditPage) {
          matched.push({name: this.$route.query.action.title, url: this.$route.path});
        }
        this.levelList = matched;
      },
      addTab (data) {
        if (!this.showTabs || data === null) {
          return;
        }
        for (let i in this.pathList) {
          if (this.pathList[i].url === data.url) {
            return;
          }
        }
        if (this.pathList.length > 8) {
          this.pathList.splice(0, 1);
        }
        this.pathList.push(data);
      },
      tagClick (url) {
        this.$router.push(url);
        this.hoverIndex = null;
      },
      setHover (index) {
        this.hoverIndex = index;
      },
      handleClose (index) {
        if (this.pathList.length > 1) {
          this.pathList.splice(index, 1);
        }
      }
    },
    created () {
      this.getBreadcrumb();
    },
    watch: {
      $route () {
        this.getBreadcrumb();
      }
    },
    components: {}
  };
</script>


