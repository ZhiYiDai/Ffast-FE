<style scoped>
</style>
<style>
</style>

<template>
  <div v-if="tableOptions">
    <!--数据表格-->
    <DataTable :columns="tableOptions.columns"
               :lazy="tableOptions.lazy"
               :dataUrl="tableOptions.dataUrl"
               :pageSize="tableOptions.pageSize"
               :param="tableOptions.param"
               :local="tableOptions.local"
               :height="tableOptions.height"
               :showPage="false"
               @on-selection-change="selectionChange"
               ref="table"
               @on-row-dblclick="rowDblclick"
               @on-row-click="rowClick">
      <!--工具栏-->
      <template slot="toolbar">
        <div style="min-height: 20px">
          <slot name="toolbar"></slot>
        </div>
      </template>
    </DataTable>
    <!--数据表格结束-->

  </div>
</template>
<script>
  import {FormDynamic, DataTable} from 'components/';

  export default {
    props: {
      showSearch: {
        default: true
      },
      toolbarSize: {
        default: 'default'
      },
      tableOptions: {
        labelWidth: {
          default: 60
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
    data () {
      return {
        deferred: false
      };
    },
    computed: {
      isSingle () {
        return !(this.tableOptions.selection !== null && this.tableOptions.selection.length === 1);
      },
      isMultiple () {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length > 0);
      }
    },
    methods: {
      queryData () {
        this.$refs['table'].queryData();
      },
      getData () {
        return this.$refs['table'].tableData;
      },
      clear () {
        this.$set(this.$refs['table'], 'tableData', []);
      },
      refreshTable (type) {
        this.tableOptions.selection = [];
        this.$refs.table.queryData();
      },
      opened (from, data) {
        if (this.tableOptions.editOptions.opened) {
          this.tableOptions.editOptions.opened(from, data);
        }
      },
      search () {
        this.$refs.searchFrom.submit((data) => {
          for (let i in data) {
            let val = data[i] === '' ? null : data[i];
            this.$set(this.tableOptions.param, i, val);
          }
        });
      },
      getSelection () {
        if (this.tableOptions.selection.length <= 0) {
          this.$Message.error('未选择操作项！');
          return null;
        } else {
          return this.tableOptions.selection;
        }
      },
      editSuccess (res) {
        this.refreshTable();
      },
      /**
       * 表格复选框选中事件
       */
      selectionChange (selection) {
        this.tableOptions.selection = selection;
        this.$emit('on-selection-change', selection);
      },
      /**
       * 双击表格行
       */
      rowDblclick (data) {

      },
      /**
       * 单击表格行
       */
      rowClick (data) {
      },
      insertOrUpdateData (p, loading) {
        let data = JSON.parse(JSON.stringify(p));
        let list = this.$refs['table'].tableData;
        // 本地结果集
        if (list !== null) {
          let isUpdate = false;
          for (let i = 0; i < list.length; i++) {
            if (data.id === null) {
              if (list[i].ctime != null && list[i].ctime === data.ctime) {
                isUpdate = true;
                this.$set(list, i, data);
              }
            } else if (list[i].id === data.id) {
              isUpdate = true;
              this.$set(list, i, data);
            }
          }
          if (!isUpdate) {
            data.ctime = new Date().getTime();
            list.push(data);
          }
        }
      },
      /**
       * 删除表格数据
       */
      delData (index) {
        this.$refs['table'].clearCurrentRow();
        this.$delete(this.$refs['table'].tableData, index);
      },
      /**
       * 表格字段绑定数据
       */
      columnRenderData () {
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
            } else if (col.enum) {
              // 数据枚举
              col.render = (h, params) => {
                const row = params.row;
                for (let i = 0; i < col.enum.length; i++) {
                  if (typeof col.enum[i] === 'string' && i === row[col.key]) {
                    return h('span', col.enum[i]);
                  } else if (row[col.key] === col.enum[i].id) {
                    let html = col.enum[i].el || 'span';
                    return h(html, col.enum[i].value);
                  }
                }
                return null;
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
    mounted () {
    },
    created () {
      this.columnRenderData();
      setTimeout(() => {
        this.deferred = true;
      }, 100);
    },
    components: {
      DataTable, FormDynamic
    }
  };
</script>
