<style scoped>
  .curd-view-left-col {
    padding: 10px 8px 0px 0px;
    /*border-right: #F5F7F9 2px solid;*/
  }

  .curd-view-right-col {
    padding: 10px 20px;
    margin-left: -2px;
    /*border-left: #F5F7F9 2px solid;*/
  }

  .tree-toolbar {
    padding: 6px 2px 10px 2px;
  }

  .curd-view {

  }

</style>
<style>

</style>

<template>
  <Row class="curd-view main-view" :class="{'main-view-full': full}">
    <!--左边树-->
    <i-col v-if="treeOptions" :xs="8" :sm="4" :md="4" :lg="3" class="curd-view-left-col"
           :class="{'curd-view-full': full}">
      <CrudTree ref="crudTree" :treeOptions="treeOptions" @on-data-loaded="onTreeDataLoaded" @on-select="onTreeChange">
        <template slot="treeTop">
          <slot name="treeTop"></slot>
        </template>
      </CrudTree>
    </i-col>
    <!--左边树结束-->
    <!--右边信息栏-->
    <i-col :xs="rightSpan(16)" :sm="rightSpan(20)" :md="rightSpan(20)" :lg="rightSpan(21)" :xs-offset="8" :sm-offset="8"
           :md-offset="8" :lg-offset="8" class="curd-view-right-col" :class="{'curd-view-full': full}">
      <template v-if="tableOptions">
        <!--数据表格开始-->
        <CrudTable ref="crudTable"
                   :tableOptions="tableOptions"
                   :categoryField="categoryField"
                   :showSearch="tableOptions.showSearch"
                   @on-selection-change="onTableChange"
                   :toolbarSize="tableOptions.toolbarSize">
          <template slot="toolbar">
            <slot name="toolbar"></slot>
          </template>
          <template slot="popupedit-append">
            <slot name="popupedit-append"></slot>
          </template>
        </CrudTable>
        <!--数据表格结束-->

        <slot name='append'>
        </slot>
      </template>

    </i-col>
    <!--右边信息栏结束-->

  </Row>
</template>
<script>
  import {FormDynamic, PopupEdit, DataSelect, CrudTree, CrudTable, DataTree, DataTable, PermsValid} from 'components/';
  import utils from 'utils/common';

  export default {

    props: {
      treeOptions: {},
      tableOptions: {},
      full: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        treeCopyData: {}
      };
    },
    computed: {
      isSingle () {
        return !(this.tableOptions.selection !== null && this.tableOptions.selection.length === 1);
      },
      isMultiple () {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length > 0);
      },
      categoryField () {
        if (this.treeOptions == null || this.treeOptions.categoryField == null) {
          return 'parentId';
        } else {
          return this.treeOptions.categoryField;
        }
      }
    },
    methods: {
      opened (from, data) {
        if (this.tableOptions.editOptions.opened) {
          this.tableOptions.editOptions.opened(from, data);
        }
      },
      rightSpan (span) {
        if (this.treeOptions == null) {
          return 24;
        } else {
          return span;
        }
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
      getSelection () {
        if (this.tableOptions.selection.length <= 0) {
          this.$Message.error('未选择操作项！');
          return null;
        } else {
          return this.tableOptions.selection;
        }
      },
      onTableChange (selection) {
        this.$emit('on-selection-change', selection);
      },
      onTreeChange (selected) {
        let val = null;
        if (selected != null) {
          val = selected.id;
        }
        this.$refs['crudTable'].$refs['table'].pageParam.page = 1;
        this.$set(this.tableOptions.param, this.categoryField, val);
      },
      /**
       * 侧边树更新完毕
       * @param data
       */
      onTreeDataLoaded (data) {
        if (this.tableOptions != null && this.tableOptions.editOptions != null) {
          this.bindTreeData(data, this.tableOptions.editOptions.dynamic);
        }
        if (this.treeOptions.editOptions != null) {
          this.bindTreeData(data, this.treeOptions.editOptions.dynamic);
        }
      },
      /**
       * 绑定侧边树的数据
       * @param data
       */
      bindTreeData (data, dynamic) {
        for (let i in dynamic) {
          for (let j in dynamic[i]) {
            if (dynamic[i][j].dataFromTree) {
              if (dynamic[i][j].type === 'treeSelect') {
                this.$set(this.treeCopyData, dynamic[i][j].name, utils.constructTree(JSON.parse(JSON.stringify(data)), 'name'));
              } else if (dynamic[i][j].type === 'select') {
                this.$set(this.treeCopyData, dynamic[i][j].name, utils.constructSelect(JSON.parse(JSON.stringify(data)), 'name', 'id'));
              }
              dynamic[i][j].data = this.treeCopyData[dynamic[i][j].name];
            }
          }
        }
      }
    },
    mounted () {
      this.tableOptions.treeView = this.$refs['crudTree'];
      if (this.treeOptions) {
        this.treeOptions.tableView = this.$refs['crudTable'];
      }
    },
    created () {
    },
    components: {
      PermsValid, DataTable, DataTree, FormDynamic, PopupEdit, DataSelect, CrudTable, CrudTree
    }
  };
</script>
