<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row style="height: 700px">
      <i-col span="18">
        <formDynamic ref="dynamic" :data="generatorOtioons" :label-width="100">
        </formDynamic>
        <Tabs>
          <TabPane label="表格参数" name="t1" :disabled="pageType!=2 && pageType!=3">
            <formDynamic ref="dynamic" :data="dynamic1" :label-width="100">
            </formDynamic>
            <LocalTable ref="table" :tableOptions='tableOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="搜索参数" name="t2" :disabled="pageType==0">
            <formDynamic ref="dynamicSearch" :data="dynamic2" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableSearch" :tableOptions='tableSearchOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="表格表单参数" name="t3">
            <formDynamic ref="dynamic3" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableEdit" :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>

          <TabPane label="树参数" name="t4" :disabled="pageType!=3 && pageType!=4">
            <formDynamic ref="dynamic3" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableEdit" :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="树表单参数" name="t4" :disabled="pageType!=3 && pageType!=4">
            <formDynamic ref="dynamic3" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableEdit" :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>
        </Tabs>

      </i-col>
      <i-col span="6">


      </i-col>

    </row>
    <row>
      <i-col span="24">
        <i-button type='ghost' icon='android-archive' @click='toggleLocation'>
          生成代码
        </i-button>
        <i-button type='ghost' icon='folder' @click='toggleLocation'>
          保 存
        </i-button>
        <i-button type='ghost' icon='eye' @click='toggleLocation'>
          预 览
        </i-button>
      </i-col>
    </row>
  </div>
</template>

<script>
  import {FormDynamic, PopupEdit, DataTable, DataSelect, LocalTable} from 'components';
  import utils from 'utils/common';

  let self = null;

  const PageTypeList = {
    CRUD_SIMPLE: {
      id: 0,
      name: '简单增删改页面'
    },
    CRUD_TABLE: {
      id: 1,
      name: '简单增删改页面'
    },
    CRUD_TREEANDTABLE: {
      id: 2,
      name: '表格增删改页面'
    },
    CRUD_TREE: {
      id: 3,
      name: '表格&树增删改页面'
    }
  };
  const getPageTypeListData = () => {
    let result = [];
    for (let obj in Object.assign(PageTypeList)) {
      result.push({label: PageTypeList[obj].name, id: PageTypeList[obj].id});
    }
    return result;

  };

  const generatorOtioons = [
    [
      {
        name: 'pollingPlanDate',
        type: 'select',
        span: 6,
        label: '生成表',
        model: 12,
        dataUrl: '/generator/table/list',
        textField: 'tableName',
        valField: 'tableName',
        onChange (item) {
          console.log(item);
          self.$refs['dynamicSearch'].setFormData({
            title: item.tableComment
          });
          self.$http.apiPost('/generator/table/columns', {tableName: item.tableName}).then((res) => {
            console.log(res.data.rows);
            res.data.rows.forEach((value, key) => {
              value.id = key;
              value.name = utils.camelCase(value.columnName);
              self.$refs['table'].insertOrUpdateData(value);
              self.$refs['tableEdit'].insertOrUpdateData(value);
              self.$refs['tableSearch'].insertOrUpdateData(value);
            });
          });
        }
      },
      {
        name: 'pageTypeList',
        type: 'radio',
        span: 12,
        label: '页面模板',
        data: getPageTypeListData(),
        onChange (value) {
          self.pageType = value;
        }
      }
    ]
  ];

  const dynamic1 = [
    [
      {
        name: 'height',
        type: 'number',
        span: 4,
        label: '高度'
      },
      {
        name: 'pageSize',
        type: 'number',
        span: 4,
        label: '每页数量',
        value: 20
      }
    ]
  ];

  const dynamic2 = [
    [
      {
        name: 'title',
        type: 'text',
        span: 4,
        label: '标题'
      },
      {
        name: 'height',
        type: 'number',
        span: 4,
        label: '高度'
      },
      {
        name: 'pageSize',
        type: 'number',
        span: 4,
        label: '每页数量',
        value: 20
      }
    ]
  ];

  const dynamic3 = [
    [
      {
        name: 'height',
        type: 'number',
        span: 4,
        label: '高度'
      },
      {
        name: 'pageSize',
        type: 'number',
        span: 4,
        label: '每页数量',
        value: 20
      }
    ]
  ];

  /**
   * 表格参数
   */
  const tableOptions = {
    selection: [],
    param: {},
    height: 400,
    columns: [
      {key: 'ordinalPosition', title: '排序', width: 80},
      {key: 'columnName', title: '数据库字段', width: 200},
      {key: 'name', title: '字段名', width: 200},
      {key: 'dataType', title: '数据库字段类型', width: 160},
      {key: 'columnComment', title: '标题', width: 260},
      {key: 'columnType', title: '显示类型', width: 120},
      {key: 'columnType', title: '枚举数据', width: 120},
      {
        key: '',
        title: '操作',
        width: 120,
        render: (h, params) => {
          const row = params.row;
          let editorBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                self.$refs.detailPopupEdit.open({
                  title: '编辑选项设备',
                  postUrl: null
                }, row);
              }
            }
          }, '编辑');
          let delBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                console.log(params);
                self.$refs['table'].delData(params.index);
              }
            }
          }, '删除');
          return h('div', null, [editorBtn, ' ', delBtn]);
        }
      }
    ]
  };

  /**
   * 表格参数
   */
  const tableEditOptions = {
    selection: [],
    param: {},
    height: 400,
    columns: [
      {key: 'ordinalPosition', title: '排序', width: 80},
      {key: 'columnName', title: '数据库字段', width: 200},
      {key: 'name', title: '字段名', width: 200},
      {key: 'dataType', title: '数据库字段类型', width: 160},
      {key: 'columnComment', title: '标题', width: 260},
      {key: 'columnType', title: '显示类型', width: 120},
      {key: 'columnType', title: '枚举数据', width: 120},
      {
        key: '',
        title: '操作',
        width: 120,
        render: (h, params) => {
          const row = params.row;
          let editorBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                self.$refs.detailPopupEdit.open({
                  title: '编辑选项设备',
                  postUrl: null
                }, row);
              }
            }
          }, '编辑');
          let delBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                console.log(params);
                self.$refs['tableEdit'].delData(params.index);
              }
            }
          }, '删除');
          return h('div', null, [editorBtn, ' ', delBtn]);
        }
      }
    ]
  };

  /**
   * 表格参数
   */
  const tableSearchOptions = {
    selection: [],
    param: {},
    height: 400,
    columns: [
      {key: 'ordinalPosition', title: '排序', width: 80},
      {key: 'span', title: '分格数量', width: 200},
      {key: 'name', title: '字段名', width: 200},
      {key: 'dataType', title: '数据库字段类型', width: 160},
      {key: 'columnComment', title: '标题', width: 260},
      {key: 'columnType', title: '显示类型', width: 120},
      {key: 'columnType', title: '枚举数据', width: 120},
      {
        key: '',
        title: '操作',
        width: 120,
        render: (h, params) => {
          const row = params.row;
          let editorBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                self.$refs.detailPopupEdit.open({
                  title: '编辑选项设备',
                  postUrl: null
                }, row);
              }
            }
          }, '编辑');
          let delBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                console.log(params);
                self.$refs['tableSearch'].delData(params.index);
              }
            }
          }, '删除');
          return h('div', null, [editorBtn, ' ', delBtn]);
        }
      }
    ]
  };

  export default {
    data () {
      return {
        dbTable: null,
        PageTypeList,
        pageType: -1,
        pageOptions: {},
        tableOptions,
        generatorOtioons,
        tableEditOptions,
        tableSearchOptions,
        dynamic1,
        dynamic2,
        dynamic3
      };
    },
    computed: {},
    methods: {},
    mounted () {
      self = this;
    },
    components: {
      DataSelect, LocalTable, FormDynamic
    }
  };
</script>

<style scoped>

</style>
