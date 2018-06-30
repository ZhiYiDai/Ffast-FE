<style scoped>
  .table-spin {
    position: absolute;
    left: 50%;
    top: 48%;
  }
</style>

<style>

  .table-panel .ivu-table-small th {
    height: 40px;
    font-size: 13px;
  }

  .table-panel .ivu-table-small td {
    height: 36px;
  }

  .table-panel .ivu-table-wrapper {
  border-color: #f4f4f4;
  }

  .table-panel .ivu-table:after {
  display: none;
  background-color: #f4f4f4;
  }

  .table-panel .ivu-table:before {
  background-color: #e9eaec;
  display: none;
  }

  .table-panel .ivu-table:before {
  background-color: #f8f8f9;
  }

  td {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  }

  .table-loading .ivu-table-body, .table-loading .ivu-table-tip {
    opacity: 0.5
  }

  .table-panel ::-webkit-scrollbar-thumb {
    background-color: #f8f8f9;
  }



  .table-panel .ivu-table-wrapper {
    border: none;
  }


</style>

<template>
  <div class="table-panel">

    <div style="display: inline-block;width: 100%">
      <div style="float: left">
        <slot name="toolbar"></slot>
      </div>
      <div style="float: right;padding-top: 8px" v-if="showSettingToolbar">
        <Button type="ghost" size="small" @click="queryData" icon="loop"></Button>
        <Poptip placement="bottom-end" width="200">
          <Button size="small" type="ghost" icon="funnel"></Button>
          <div slot="content" style="margin: 5px 0">
            <div v-for="col in columns">
              <Checkbox @on-change="columnsChange"
                        :true-value="false"
                        :false-value="true"
                        v-if="col.title"
                        v-model="col.hidden"
                        :label="col.title">
                {{col.title}}
              </Checkbox>
            </div>
            <div></div>
          </div>
        </Poptip>
      </div>
    </div>
    <div>
      <i-table :data="tableData"

               :columns="mColumns"
               ref="table"
               @on-row-click="rowClick"
               @on-row-dblclick="rowDblclick"
               @on-selection-change="selectionChange"
               @on-sort-change="onSortChange"
               :size="tableSize"
               :class="{'table-loading': loading}"
               :height="height"
               highlight-row>
        <template slot="footer" v-if="showFooter">
          <slot name="footer"></slot>
        </template>
      </i-table>
      <spin v-if="loading" size="large" class="table-spin"></spin>
    </div>
    <div v-if="showPage" style="margin: 10px;overflow: hidden">
      <div :style="'text-align: '+this.pageAlign">
        <Page :total="total" :page-size="pageParam.pageSize" placement="top" :current="pageParam.page"
              @on-change="changePage" @on-page-size-change="changePageSize" :size="tableSize"
              show-total show-sizer show-elevator>
        </Page>
      </div>
    </div>

  </div>
</template>

<script>
  export default {

    props: {
      pageAlign: {
        default: 'center'
      },
      tableSize: {
        default: 'small'
      },
      pageSize: {
        default: 10
      },
      showSettingToolbar: {
        type: Boolean,
        default: true
      },
      showFooter: {
        type: Boolean,
        default: false
      },
      showPage: {
        type: Boolean,
        default: true
      },
      lazy: {
        type: Boolean,
        default: false
      },
      columns: {},
      dataUrl: {},
      param: {},
      height: {
        default: 600
      }
    },
    data () {
      return {
        total: 0,
        loading: false,
        searchTimer: null,
        mColumns: [],
        selection: [],
        pageParam: {
          page: 1,
          pageSize: 10,
          sortField: 'id',
          sortOrder: 'desc'
        },
        tableData: []
      };
    },
    computed: {
      isSingle () {
        return !(this.selection !== null && this.selection.length === 1);
      },
      isMultiple () {
        return !(this.selection != null && this.selection.length > 0);
      }
    },
    methods: {
      /**
       * 获取数据
       */
      queryData () {
        this.selection = null;
        this.$emit('on-selection-change', null);
        if (this.dataUrl == null || this.loading === true) {
          return;
        }
        this.loading = true;
        let param = Object.assign(JSON.parse(JSON.stringify(this.pageParam)), this.param);
        this.$http.apiPost(this.dataUrl, param).then((res) => {
          this.loading = false;
          if (!res.success) {
            this.$http.handleError(res);
          } else {
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        });
      },
      changePage (page) {
        this.pageParam.page = page;
        this.queryData();
      },
      changePageSize (pageSize) {
        this.pageParam.pageSize = pageSize;
        this.queryData();
      },
      selectionChange (selection) {
        this.selection = selection;
        this.$emit('on-selection-change', this.selection);
      },
      rowDblclick (data, index) {
        this.$emit('on-row-dblclick', data, index);
      },
      rowClick (data, index) {
        this.$refs.table.selectAll(false);
        this.$refs.table.toggleSelect(index);
        this.$emit('on-row-click', data, index);
      },
      clearCurrentRow () {
        this.$refs['table'].clearCurrentRow();
      },
      onSortChange (data) {
        this.pageParam.sortField = data.key;
        this.pageParam.sortOrder = data.order;
        this.queryData();
      },
      columnsChange () {
        let list = [];
        for (let key = 0; key < this.columns.length; key++) {
          if (this.columns[key] instanceof Object && (this.columns[key].hidden == null || !this.columns[key].hidden)) {
            list.push(this.columns[key]);
          }
        }
        this.mColumns = list;
        this.$nextTick(() => {
          this.mColumns = list;
        });
      },
      /**
       * 表格字段绑定数据
       */
      columnRenderData () {
        if (this.mColumns != null) {
          for (let i = 0; i < this.mColumns.length; i++) {
            let col = this.mColumns[i];
            // 数据枚举
            if (col.enum) {
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
            }
            else {

            }
          }
        }
      }
    },
    created () {
      this.mColumns = this.columns;
      this.columnRenderData();
      if (this.pageSize != null) {
        this.pageParam.pageSize = this.pageSize;
      }
      if (!this.lazy) {
        this.queryData();
      }
      if (!this.showPage) {
        this.pageParam.pageSize = 1000;
      }
    },
    watch: {
      param: {
        handler (curVal, oldVal) {
          this.queryData();
        },
        deep: true
      },
      columns: {
        handler (curVal, oldVal) {
          this.mColumns = curVal;
        },
        deep: true
      }
    },
    components: {}
  };
</script>


