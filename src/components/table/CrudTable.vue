<style scoped>
  .search-more{
    float: right;
    margin-bottom: 15px;
  }
</style>
<style>
</style>

<template>
  <div v-if="tableOptions">
    <!--弹出式编辑框-->
    <template v-if="isPopupEdit">
      <PopupEdit ref="popupEdit"
                 @on-opened="opened"
                 @on-setfrom-after="setFromAfter"
                 :width="tableOptions.editOptions.width"
                 :dynamic="tableOptions.editOptions.dynamic"
                 @on-success="editSuccess"
                 @on-submit-before="submitBefore"
                 :label-width="tableOptions.editOptions.labelWidth">
        <template slot="append">
          <slot name="popupedit-append"></slot>
        </template>
      </PopupEdit>
    </template>
    <!--搜索筛选-->
    <FormDynamic v-if="showSearch"
                 ref="searchFrom"
                 :data="searchExpand?tableOptions.searchDynamic:[tableOptions.searchDynamic[0]]"
                 :colHeight="45"
                 :paddingRight="10"
                 :placeholderLabel="true"
                 :label-width="tableOptions.searchLabelWidth">
      <template slot="append">
        <div :span="tableOptions.searchDynamic.length>1?3:1" style="padding: 1px 1px 0 0;"  :class="{'search-more': tableOptions.searchDynamic.length>1}">
          <i-button type="ghost" icon="ios-search" @click="search">查询</i-button>
          <i-button v-if="tableOptions.searchDynamic.length>1" type="text"
                    :icon="searchExpand?'ios-arrow-up':'ios-arrow-down'" @click="searchExpandClick">{{searchExpand?'收 起':'展 开'}}
          </i-button>
        </div>
      </template>

    </FormDynamic>

    <!--数据表格-->
    <DataTable ref="table"
               :columns="tableOptions.columns"
               :lazy="tableOptions.lazy"
               :dataUrl="tableOptions.dataUrl"
               :pageSize="tableOptions.pageSize"
               :param="tableOptions.param"
               :local="tableOptions.local"
               :height="tableOptions.height"
               :showPage="tableOptions.showPage"
               @on-selection-change="selectionChange"
               @on-row-dblclick="rowDblclick"
               @on-row-click="rowClick">
      <!--工具栏-->
      <template slot="toolbar">
        <div>
          <template v-if="deferred">
            <!--增删改按钮-->
            <PermsValid :perms-name="createPerms" v-if="tableOptions.createUrl">
              <i-button type="ghost" shape="circle" :size="toolbarSize" icon="plus" @click="tableAddData()">添 加
              </i-button>
            </PermsValid>
            <PermsValid :perms-name="updatePerms" v-if="tableOptions.updateUrl">
              <i-button type="ghost" shape="circle" :size="toolbarSize" icon="edit" @click="tableEditData()"
                        :disabled="isSingle">编 辑
              </i-button>
            </PermsValid>
            <PermsValid :perms-name="deletePerms" v-if="tableOptions.deleteUrl">
              <Poptip confirm title="您确认删除选中的内容吗？" @on-ok="tableDelData()" placement="bottom-start" transfer>
                <i-button type="ghost" shape="circle" icon="trash-b" :size="toolbarSize"
                          :disabled="isMultiple">删 除
                </i-button>
              </Poptip>
            </PermsValid>
            <!--增删改按钮结束-->
            <slot name="toolbar"></slot>
          </template>
        </div>
      </template>
    </DataTable>
    <!--数据表格结束-->

  </div>
</template>
<script>
  import {FormDynamic, PopupEdit, DataTable, PermsValid} from 'components/';

  export default {
    props: {
      categoryField: {},
      showSearch: {
        default: true
      },
      toolbarSize: {
        default: 'default'
      },
      tableOptions: {
        labelWidth: {
          default: 1
        },
        height: {
          default: 600
        },
        searchLabelWidth: {
          default: 1
        },
        selection: {
          default: []
        },
        editOptions: {
          labelWidth: {
            default: 60
          }
        },
        treeView: {}
      }
    },
    data() {
      return {
        deferred: false,
        searchExpand: false
      };
    },
    computed: {
      isSingle() {
        return !(this.tableOptions.selection !== null && this.tableOptions.selection.length === 1);
      },
      isMultiple() {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length > 0);
      },
      createPerms() {
        return this.tableOptions.permsPrefix == null ? null : this.tableOptions.permsPrefix + ':create';
      },
      updatePerms() {
        return this.tableOptions.permsPrefix == null ? null : this.tableOptions.permsPrefix + ':update';
      },
      deletePerms() {
        return this.tableOptions.permsPrefix == null ? null : this.tableOptions.permsPrefix + ':delete';
      },
      isPopupEdit() {
        return this.tableOptions.editOptions && !this.tableOptions.editOptions.editPage;
      },
    },
    methods: {
      searchExpandClick() {
        this.searchExpand = !this.searchExpand;
      },
      submitBefore(data) {
        if (this.tableOptions.editOptions.submitBefore) {
          this.tableOptions.editOptions.submitBefore(data);
        }
        return false;
      },
      refreshTable(type) {
        this.tableOptions.selection = [];
        this.$refs.table.queryData();
        let tree = this.tableOptions.treeView;
        if (tree != null && tree.treeOptions != null && this.tableOptions.dataUrl === tree.treeOptions.dataUrl) {
          tree.treeOptions.selected = null;
          tree.$refs['tree'].queryData();
        }
      },
      opened(from, data) {
        if (this.tableOptions.editOptions.opened) {
          this.tableOptions.editOptions.opened(from, data);
        }
      },
      setFromAfter(from, data) {
        if (this.tableOptions.editOptions.setFromAfter) {
          this.tableOptions.editOptions.setFromAfter(from, data);
        }
      },
      search() {
        this.$refs.searchFrom.submit((data) => {
          for (let i in data) {
            if (data[i] === null || data[i] === '') {
              this.$delete(this.tableOptions.param, i);
            } else {
              this.$set(this.tableOptions.param, i, data[i]);
            }
          }
        });
      },
      getSelection() {
        if (this.tableOptions.selection.length <= 0) {
          this.$Message.error('未选择操作项！');
          return null;
        } else {
          return this.tableOptions.selection;
        }
      },
      editSuccess(res) {
        this.refreshTable();
      },
      /**
       * 表格复选框选中事件
       */
      selectionChange(selection) {
        this.tableOptions.selection = selection;
        this.$emit('on-selection-change', selection);
      },
      /**
       * 双击表格行
       */
      rowDblclick(data) {
        if (this.tableOptions.updateUrl && this.tableOptions.editOptions) {
          this.$refs.popupEdit.open({
            title: '编辑' + this.tableOptions.title,
            postUrl: this.tableOptions.updateUrl
          }, data);
        }
      },
      /**
       * 单击表格行
       */
      rowClick(data) {
      },
      /**
       * 添加表格数据
       */
      showEdit(postUrl, title, data) {
        let action = {
          title: title,
          postUrl: postUrl
        };
        if (this.tableOptions.editOptions.editPage === true) {
          this.tableOptions.editOptions.editSuccess = this.editSuccess;
          this.$router.push({
            path: this.$router.currentRoute.path + '/edit',
            query: {options: this.tableOptions.editOptions, action: action, data: data}
          });
        } else {
          this.$refs.popupEdit.open(action, data);
        }
      },
      tableAddData() {
        let data = {};
        if (this.tableOptions != null) {
          data[this.categoryField] = this.tableOptions.param[this.categoryField];
        } else {
          data[this.categoryField] = null;
        }
        this.showEdit(this.tableOptions.createUrl, '添加' + this.tableOptions.title, data);
      },
      openUpdateDialog(data) {
        this.showEdit(this.tableOptions.updateUrl, '编辑' + this.tableOptions.title, data);
      },
      /**
       * 编辑表格数据
       */
      tableEditData() {
        let selection = this.getSelection();
        if (selection != null && this.tableOptions.editOptions) {
          this.openUpdateDialog(selection[0]);
        }
      },
      /**
       * 删除表格数据
       */
      tableDelData() {
        let selection = this.getSelection();
        if (selection != null) {
          let ids = [];
          for (let i = 0; i < selection.length; i++) {
            let obj = selection[i];
            ids.push(obj.id);
          }
          this.$http.apiPost(this.tableOptions.deleteUrl, {ids: ids.toString()}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success('删除成功');
              this.refreshTable();
            }
          });
        }
      },
      /**
       * 表格字段绑定数据
       */
      columnRenderData() {
        if (this.tableOptions.columns != null) {
          for (let i = 0; i < this.tableOptions.columns.length; i++) {
            let col = this.tableOptions.columns[i];
            // 数据从左边树提取
            if (col.dataFromTree) {
              col.render = (h, params) => {
                const row = params.row;
                let data = this.tableOptions.treeView.$refs['tree'].findData('id', row[col.key]);
                if (data != null && data.length > 0) {
                  let p = [];
                  for (let k = 0; k < data.length; k++) {
                    p.push(h('span', data[k].name + (data.length - 1 !== k ? ',' : '')));
                  }
                  return p;
                } else {
                  return h('span', row[col.key]);
                }
              };
            } else if (col.editable) {
              col.render = (h, params) => {
                const row = params.row;
                let dynamic = this.tableOptions.editOptions.dynamic;
                for (let k = 0; k < dynamic.length; k++) {
                  for (let j = 0; j < dynamic[k].length; j++) {
                    if (dynamic[k][j].name === col.key) {
                      switch (dynamic[k][j].type) {
                        case 'text':

                          return h('i-input', {
                            props: {
                              size: 'small',
                              value: row[col.key]
                            }
                          });
                          break;
                        case 'select':
                          return h('span', col.enum[i]);
                          break;
                        case 'treeSelect':
                          return h('span', col.enum[i]);
                          break;
                      }
                    }
                  }
                }
                ;
              };
            }
          }
        }
      }
    },
    mounted() {
    },
    created() {
      this.columnRenderData();
      setTimeout(() => {
        this.deferred = true;
      }, 100);
    },
    components: {
      PermsValid, DataTable, FormDynamic, PopupEdit
    }
  };
</script>
