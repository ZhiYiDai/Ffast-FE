<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row style="height: 700px">
      <i-col span="18">
        <formDynamic ref="generatorDynamic" :data="generatorDynamic" :label-width="100">
        </formDynamic>
        <Tabs v-model="curTab">
          <TabPane label="表格参数" name="t1" :disabled="pageType!=1 && pageType!=2">
            <formDynamic ref="dynamic" :data="dynamic1" :label-width="100">
            </formDynamic>
            <LocalTable ref="table" :tableOptions='tableOptions'>
            </LocalTable>
            <PopupEdit ref="tablePopupEdit"
                       :width="450"
                       :dynamic="tableDynamic"
                       :label-width="100">
            </PopupEdit>
          </TabPane>
          <TabPane label="搜索参数" name="t2" :disabled="pageType==0">
            <LocalTable ref="tableSearch" :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="表格表单参数" name="t3">
            <formDynamic ref="dynamic3" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable ref="tableEdit" :tableOptions='tableEditOptions'>
            </LocalTable>
            <PopupEdit ref="tableFormPopupEdit"
                       :width="450"
                       :dynamic="tableFormDynamic"
                       :label-width="100">
            </PopupEdit>
          </TabPane>

          <TabPane label="树参数" name="t4" :disabled="pageType!=3 && pageType!=4">
            <formDynamic ref="dynamic4" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>
          <TabPane label="树表单参数" name="t4" :disabled="pageType!=3 && pageType!=4">
            <formDynamic ref="dynamic6" :data="dynamic3" :label-width="100">
            </formDynamic>
            <LocalTable :tableOptions='tableEditOptions'>
            </LocalTable>
          </TabPane>
        </Tabs>

      </i-col>
      <i-col span="6">


      </i-col>

    </row>
    <row>
      <i-col span="24">
        <i-button type='ghost' icon='folder' @click='save'>
          保 存
        </i-button>
        <i-button type='ghost' icon='eye' @click='show'>
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

  const tableFormDynamic = [[
    {name: 'id', hidden: true},
    {name: 'columnName', hidden: true},
    {name: 'dataType', hidden: true},
    {name: 'ordinalPosition', hidden: true},
    {
      name: 'span',
      type: 'number',
      span: 24,
      value: 6,
      label: '格数'
    },
    {
      name: 'name',
      type: 'text',
      span: 24,
      label: '标题'
    }, {
      name: 'formType',
      type: 'select',
      span: 24,
      label: '表单类型',
      data: [
        {label: 'text', value: 1},
        {label: 'number', value: 2},
        {label: 'select', value: 3},
        {label: 'radio', value: 4},
        {label: 'treeSelect', value: 5},
        {label: 'date', value: 6},
        {label: 'dateTime', value: 7},
        {label: 'datetimerange', value: 8},
        {label: 'switch', value: 9},
        {label: 'imgUpload', value: 10},
        {label: 'title', value: 11}
      ],
      onChange: (val, from, data) => {
        self.$set(data.min, 'hidden', true);
        self.$set(data.max, 'hidden', true);
        if (val.value === 2) {
          self.$set(data.min, 'hidden', false);
          self.$set(data.max, 'hidden', false);
        }
      }
    }, {
      name: 'max',
      type: 'number',
      span: 24,
      hidden: true,
      label: '最大值'
    }, {
      name: 'min',
      type: 'number',
      span: 24,
      hidden: true,
      label: '最小值'
    }]
  ];

  /**
   * 表格编辑表单参数
   */
  const tableEditOptions = {
    selection: [],
    param: {},
    height: 400,
    columns: [
      {key: 'ordinalPosition', title: '排序', width: 80},
      {key: 'span', title: '格数', width: 70},
      {key: 'dataType', title: '数据库字段类型', width: 160},
      {key: 'name', title: '标题', width: 260},
      {
        key: 'formType', title: '表单类型', width: 120,
        data: [{label: 'text', id: 1},
          {value: 'number', id: 2},
          {value: 'select', id: 3},
          {value: 'radio', id: 4},
          {value: 'treeSelect', id: 5},
          {value: 'date', id: 6},
          {value: 'dateTime', id: 7},
          {value: 'datetimerange', id: 8},
          {value: 'switch', id: 9},
          {value: 'imgUpload', id: 10},
          {value: 'title', id: 11}
        ]
      },
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
              click (e, d) {
                console.log(e, d);
                self.$refs.tableFormPopupEdit.open({
                  title: '编辑',
                  postUrl: null
                }, row);
                self.$refs.tableFormPopupEdit.setSubmitBeforeCallBack((param) => {
                  console.log(param);

                  self.$refs[self.curTab === 't2' ? 'tableSearch' : 'tableEdit'].insertOrUpdateData(param);
                  self.$refs.tableFormPopupEdit.close();
                });
              }
            }
          }, '编辑');
          let delBtn = h('i-button', {
            props: {size: 'small'},
            on: {
              click () {
                console.log(params);
                alert(self.curTab);
                self.$refs[self.curTab === 't2' ? 'tableSearch' : 'tableEdit'].delData(params.index);
              }
            }
          }, '删除');
          return h('div', null, [editorBtn, ' ', delBtn]);
        }
      }
    ]
  };

  const tableDynamic = [[
    {name: 'id', hidden: true},
    {name: 'columnName', hidden: true},
    {name: 'columnType', hidden: true},
    {name: 'ordinalPosition', hidden: true},
    {
      name: 'name',
      type: 'text',
      span: 24,
      label: '标题'
    }, {
      name: 'width',
      type: 'number',
      span: 24,
      label: '宽度'
    }, {
      name: 'dataType',
      type: 'select',
      span: 24,
      label: '显示类型',
      data: [{label: '绑定枚举', value: 1}, {label: '绑定字典', value: 2}, {label: '绑定左边树', value: 3}, {
        label: '查看图片',
        value: 4
      }],
      onChange: (val, from, data) => {
        self.$set(data.dictType, 'hidden', true);
        if (val.value === 2) {
          self.$set(data.dictType, 'hidden', false);
        }
      }
    }, {
      name: 'dictType',
      type: 'text',
      span: 24,
      hidden: true,
      label: '字典类型'
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
        name: 'table',
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
            res.data.rows.forEach((value, key) => {
              value.id = key;
              value.name = utils.camelCase(value.columnComment);
              value.width = 100;
              value.span = 6;
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
        value: 1,
        hidden: true,
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

  const dynamic3 = [
    [
      {
        name: 'editType',
        type: 'radio',
        span: 6,
        value: 0,
        label: '编辑表单方式',
        data: [
          {label: '弹出式', value: 0}, {label: '跳转式', value: 1}
        ],
        onChange: (val, from, data) => {
          if (val === 1) {
            self.$set(data.width, 'hidden', true);
          } else {
            self.$set(data.width, 'hidden', false);
          }
        }
      },
      {
        name: 'labelWidth',
        type: 'number',
        span: 6,
        label: '标签宽度',
        value: 100
      },
      {
        name: 'width',
        type: 'number',
        span: 6,
        label: '表单宽度',
        value: 800
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
                  console.log(param);
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

  export default {
    data () {
      return {
        dbTable: null,
        PageTypeList,
        pageType: 1,
        pageOptions: {},
        tableOptions,
        generatorDynamic,
        tableEditOptions,
        dynamic1,
        dynamic2,
        dynamic3,
        tableDynamic,
        tableFormDynamic,
        curTab: 't1'
      };
    },
    computed: {},
    methods: {
      tableSuccess (data) {
        console.log(data);
      },
      save () {
        alert(JSON.stringify(this.$refs.dynamic.getData()));
        alert(JSON.stringify(this.$refs.generatorDynamic.getData()));
        alert(JSON.stringify(this.$refs.dynamic3.getData()));


        alert(JSON.stringify(this.$refs.tableSearch.getData()));
        alert(JSON.stringify(this.$refs.tableEdit.getData()));
        alert(JSON.stringify(this.$refs.table.getData()));

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
