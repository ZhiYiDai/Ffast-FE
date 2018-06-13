<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row style="height: 700px">
      <i-col span="18">
        <formDynamic ref="generatorDynamic" :data="generatorDynamic" :label-width="100">
        </formDynamic>
        <Tabs>
          <TabPane label="表格参数" name="t1" :disabled="pageType!=1 && pageType!=2">
            <formDynamic ref="dynamic" :data="dynamic1" :label-width="100">
            </formDynamic>
            <LocalTable ref="table" :tableOptions='tableOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="搜索参数" name="t2" :disabled="pageType==0">
            <!--<formDynamic ref="dynamicSearch" :data="dynamic2" :label-width="100">-->
            <!--</formDynamic>-->
            <LocalTable ref="tableSearch" :tableOptions='tableSearchOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="表格表单参数" name="t3">
            <formDynamic ref="dynamic3" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableEdit" :tableOptions='tableEditOptions'>
            </LocalTable>
            <PopupEdit ref="tablePopupEdit"
                       :width="800"
                       :dynamic="tableDynamic"

                       :label-width="100">
            </PopupEdit>
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

  const tableDynamic = [[
    {name: 'id', hidden: true},
    {name: 'columnName', hidden: true},
    {name: 'columnType', hidden: true},
    {name: 'ordinalPosition', hidden: true},
    {
      name: 'name',
      type: 'text',
      span: 12,
      label: '标题'
    }, {
      name: 'width',
      type: 'number',
      span: 12,
      label: '宽度'
    }, {
      name: 'dataType',
      type: 'select',
      span: 12,
      label: '显示类型',
      data: [{label: '绑定枚举', value: 1}, {label: '绑定字典', value: 2}, {label: '绑定左边树', value: 3}, {label: '查看图片', value: 4}]
    }, {
      name: 'title',
      type: 'text',
      span: 12,
      label: '模块名称'
    }]
  ];

  const PageTypeList = {
    CRUD_SIMPLE: {
      id: 0,
      name: '简单增删改页面'
    },
    CRUD_TABLE: {
      id: 1,
      name: '表格增删改页面'
    },
    CRUD_TREEANDTABLE: {
      id: 2,
      name: '表格&树增删改页面'
    },
    CRUD_TREE: {
      id: 3,
      name: '树增删改页面'
    }
  };
  const getPageTypeListData = () => {
    let result = [];
    for (let obj in Object.assign(PageTypeList)) {
      result.push({label: PageTypeList[obj].name, id: PageTypeList[obj].id});
    }
    return result;

  };

  const generatorDynamic = [
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
          self.$refs['generatorDynamic'].setFormData({
            title: item.tableComment.replace('_', '')
          });
          self.$http.apiPost('/generator/table/columns', {tableName: item.tableName}).then((res) => {
            console.log(res.data.rows);
            res.data.rows.forEach((value, key) => {
              value.id = key;
              value.name = utils.camelCase(value.columnComment);
              value.width = 100;
              self.$refs['table'].insertOrUpdateData(value);
              self.$refs['tableEdit'].insertOrUpdateData(value);
              self.$refs['tableSearch'].insertOrUpdateData(value);
            });
          });
        }
      },
      {
        name: 'title',
        type: 'text',
        span: 6,
        label: '模块名称'
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
        label: '表格高度'
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

  const dynamic4 = [
    {
      name: 'PackageParent',
      type: 'text',
      span: 4,
      label: '父包名'
    },
    {
      name: 'copyright',
      type: 'text',
      span: 4,
      label: '公司名称'
    },
    {
      name: 'author',
      type: 'text',
      span: 4,
      label: '作者'
    }
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
      {key: 'columnName', title: '字段名', width: 160},
      {key: 'dataType', title: '字段类型', width: 160},
      {key: 'name', title: '标题', width: 160},
      {
        key: 'dataType',
        title: '显示类型',
        width: 160,
        enum: [{value: '绑定枚举', id: 1}, {value: '绑定字典', id: 2}, {value: '绑定左边树', id: 3}, {value: '查看图片', id: 4}]
      },
      {key: 'width', title: '宽度', width: 80},
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
                self.$refs.tablePopupEdit.open({
                  title: '编辑',
                  postUrl: null
                }, row);
                self.$refs.tablePopupEdit.setSubmitBeforeCallBack((param) => {
                  console.log(param)
                  self.$refs['table'].insertOrUpdateData(param);
                  self.$refs.tablePopupEdit.close();
                });
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
      {key: 'enumData', title: '枚举数据', width: 120},
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
                self.$refs.tablePopupEdit.open({
                  title: '编辑',
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
      {key: 'enumData', title: '枚举数据', width: 120},
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
        generatorDynamic,
        tableEditOptions,
        tableSearchOptions,
        dynamic1,
        dynamic2,
        dynamic3,
        tableDynamic
      };
    },
    computed: {},
    methods: {
      tableSuccess (data) {
        console.log(data);

      }
    },
    mounted () {
      self = this;
    },
    components: {
      DataSelect, LocalTable, FormDynamic, PopupEdit
    }
  };
</script>

<style scoped>

</style>
