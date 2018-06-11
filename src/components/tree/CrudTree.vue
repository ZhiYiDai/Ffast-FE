<style scoped>
  .tree-toolbar {
    padding: 6px 2px 10px 2px;
  }

</style>
<style>

</style>

<template>
  <div>
    <slot name="treeTop"></slot>
    <!--顶部工具栏-->
    <div class="tree-toolbar" v-if="treeOptions.showToolbar">
      <!--增删改按钮-->
      <template v-if="this.treeOptions.editOptions">
        <PermsValid :perms-name="createPermsTree" v-if="treeOptions.createUrl">
          <Button size="small" shape="circle" type="ghost" icon="plus" @click="treeAddData()">添加</Button>
        </PermsValid>
        <PermsValid :perms-name="updatePermsTree" v-if="treeOptions.updateUrl">
          <Button size="small" shape="circle" type="ghost" icon="edit" @click="treeEditData()"
                  :disabled="!treeOptions.selected">编辑
          </Button>
        </PermsValid>

        <template v-if="isPopupEdit">
          <!--弹出式编辑框-->
          <PopupEdit ref="treePopupEdit"
                     :width="treeOptions.editOptions.width"
                     :dynamic="treeOptions.editOptions.dynamic"
                     @on-success="editTreeSuccess"
                     :label-width="treeOptions.editOptions.labelWidth">
          </PopupEdit>
        </template>
      </template>
      <PermsValid :perms-name="deletePermsTree" v-if="treeOptions.deleteUrl" style="padding-top: 4px">
        <Poptip confirm title="您确认删除选中的内容吗？" @on-ok="treeDelData()" placement="bottom-start" transfer>
          <Button type="ghost" size="small" shape="circle" icon="trash-b" @click="" :disabled="!treeOptions.selected">
            删除
          </Button>
        </Poptip>
      </PermsValid>

      <Button v-if="treeOptions.manageUrl" size="small" shape="circle" type="ghost" icon="android-create"
              @click="$router.push(treeOptions.manageUrl);">管理
      </Button>
    </div>
    <!--顶部工具栏结束-->
    <DataTree ref="tree"
              :param="treeOptions.param"
              :dataUrl="treeOptions.dataUrl"
              @on-select="onTreeChange"
              @on-data-loaded="onTreeDataLoaded"
              :lazy="treeOptions.lazy"/>
  </div>

</template>
<script>
  import {PopupEdit, PermsValid, DataTree} from 'components/';
  // import  DataTree from 'components/tree/DataTree';

  export default {
    props: {
      treeOptions: {
        treeView: {}
      }
    },
    data () {
      return {};
    },
    computed: {
      createPermsTree () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':create';
      },
      updatePermsTree () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':update';
      },
      deletePermsTree () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':delete';
      },
      categoryField () {
        if (this.treeOptions == null || this.treeOptions.categoryField == null) {
          return 'parentId';
        } else {
          return this.treeOptions.categoryField;
        }
      },
      isPopupEdit () {
        return this.treeOptions.editOptions && !this.treeOptions.editOptions.editPage;
      }
    },
    methods: {
      refreshTree (type) {
        this.treeOptions.selected = null;
        this.$refs.tree.queryData();
        let table = this.treeOptions.tableView;
        if (table.tableOptions != null && table.tableOptions.dataUrl === this.treeOptions.dataUrl) {
          table.tableOptions.selection = [];
          table.$refs.table.queryData();
        }
      },
      opened (from, data) {
        if (this.treeOptions.editOptions.opened) {
          this.treeOptions.editOptions.opened(from, data);
        }
      },
      tableSpan (span) {
        if (this.treeOptions == null) {
          return 24;
        } else {
          return span;
        }
      },
      search () {

      },
      getTreeSelected (showMsg) {
        if (this.treeOptions.selected == null) {
          if (showMsg == null || showMsg) {
            this.$Message.error('未选择操作项！');
          }
          return null;
        } else {
          return this.treeOptions.selected;
        }
      },
      onTreeChange (selected) {
        this.$set(this.treeOptions, 'selected', selected);
        this.$emit('on-select', selected);
      },
      editTreeSuccess (res, data) {
        this.treeOptions.selectId = data.id;
        this.refreshTree();
      },
      showEdit (postUrl, title, data) {
        let action = {
          title: title,
          postUrl: postUrl
        };
        if (this.treeOptions.editOptions.editPage === true) {
          this.treeOptions.editOptions.editSuccess = this.editSuccess;
          this.$router.push({
            path: this.$router.currentRoute.path + '/edit',
            query: {options: this.treeOptions.editOptions, action: action, data: data}
          });
        } else {
          this.$refs.treePopupEdit.open(action, data);
        }
      },
      /**
       * 添加树数据
       */
      treeAddData () {
        let selected = this.getTreeSelected(false);
        let data = {};
        if (selected != null) {
          data.parentId = selected.id;
        } else {
          data.parentId = null;
        }
        this.showEdit(this.treeOptions.createUrl, '添加' + this.treeOptions.title, data);
      },
      /**
       * 编辑树数据
       */
      treeEditData () {
        let selected = this.getTreeSelected();
        if (selected != null) {
          this.showEdit(this.treeOptions.updateUrl, '编辑' + this.treeOptions.title, selected);
        }
      },
      /**
       * 删除树数据
       */
      treeDelData () {
        let selected = this.getTreeSelected();
        if (selected != null) {
          this.treeOptions.selectId = selected.parentId;
          this.$http.apiPost(this.treeOptions.deleteUrl, {ids: selected.id}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success('删除成功');
              this.refreshTree();
            }
          });
        }
      },
      /**
       * 侧边树更新完毕
       * @param data
       */
      onTreeDataLoaded (data) {
        if (this.treeOptions.editOptions != null) {
          this.$nextTick(() => {
            this.$refs['tree'].select(this.treeOptions.selectId);
          });
        }
        this.$emit('on-data-loaded', data);
      }
    },
    mounted () {

    },
    created () {

    },
    components: {
      PermsValid, DataTree, PopupEdit
    }
  };
</script>
