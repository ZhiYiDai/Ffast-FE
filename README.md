# Ffast-FE

> 基于vue iview后台管理系统前端快速开发解决方案

## Install

``` bash
# install dependencies
npm install or yarn

# serve with hot reload at localhost:8000
npm run dev

# build for production with minification
npm run build

```

## 简介
``` bash
Ffast-FE 是一套基于vue iview后台管理系统前端快速开发解决方案,以JSON数据驱动页面,几句代码即可快速开发属于你的页面。
```

## 演示地址
* http://demo.ffast.cn/
* http://39.107.104.190/ffast/
* http://118.126.66.11/ffast/

## 技术栈
  vue2 + vuex + vue-router + webpack + ES6 + axios + iview

## 后端解决方案Ffast-Java
>  https://github.com/ZhiYiDai/Ffast-Java

### 已实现模块
* 整体布局界面
* 用户管理
* 角色管理
* 字典管理
* 权限菜单
* 接口测试
* 系统日志
* 待办事项
### 开发中的模块
* 代码生成

## 一个简单的增删改表格页面
``` bash
<template>
  <CrudView :tableOptions="tableOptions" ></CrudView>
</template>
<script>
  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    // 是否启用跳转到编辑页面，为空或false则用弹出模态框进行编辑
    editPage: true,
    // 模态框宽度
    width: 600,
    // 表单标签宽度
    labelWidth: 70,
    // 表单数据
    dynamic: [
      [
        {name: 'id', hidden: true},
        {
          name: 'name',
          type: 'text',
          span: 12,
          label: '资源名',
          rules: {required: true}
        },
        {name: 'parentId', type: 'treeSelect', dataFromTree: true, span: 12, label: '父资源'}
      ],
      [
        {name: 'url', type: 'text', span: 24, label: '菜单Url'}
      ],
      [
        {name: 'identity', type: 'text', span: 12, label: '标识符'},
        {name: 'icon', type: 'text', span: 12, label: '图标'}
      ],
      [
        {
          name: 'status',
          openText: '显示',
          closeText: '隐藏',
          type: 'switch',
          span: 12,
          label: '状态',
          value: 1,
          trueValue: 1,
          falseValue: 0
        },
        {
          name: 'resType',
          type: 'radio',
          span: 12,
          label: '类型',
          value: 1,
          data: [{label: '菜单', value: 1}, {label: '权限', value: 2}],
          rules: {required: true, type: 'number'}
        }
      ],
      [
        {
          name: 'addBaseCrud',
          type: 'switch',
          openText: '是',
          closeText: '否',
          span: 12,
          label: '添加基础权限',
          value: false
        }
      ]
    ]
  }

  /**
   * 表格参数
   */
  const tableOptions = {
    editOptions: tableEditOptions,
    selection: [],
    pageSize: 20,
    // 表单窗口标题
    title: '权限菜单',
    // 权限前缀
    permsPrefix: 'res',
    // 表格数据地址
    dataUrl: '/sys/res/list',
    // 表格数据增加地址
    createUrl: '/sys/res/create',
    // 表格数据删除地址
    deleteUrl: '/sys/res/delete',
    // 表格数据更新地址
    updateUrl: '/sys/res/update',
    // 查询请求参数
    param: {},
    // 表格列数据
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'name', title: '资源名', minWidth: 160, maxWidth: 280},
      {
        key: 'resType',
        width: 80,
        title: '类型',
        // 类型枚举 （自动将值（id）转换为对应标签value）
        enum: [{value: '菜单', id: 1, el: 'strong'}, {value: '权限', id: 2}]
      },
      {key: 'identity', title: '标识符', width: 200},
      {key: 'url', title: '菜单Url', minWidth: 200, maxWidth: 400},
      {key: 'parentId', title: '父资源', width: 160, dataFromTree: true},
      {
        key: 'icon',
        width: 100,
        title: '菜单图标',
        render: (h, params) => {
          const row = params.row
          return h('Icon', {
            props: {
              type: row.icon
            }
          })
        }
      },
      {key: 'weight', title: '权重', width: 80},
      {
        key: 'status',
        width: 80,
        title: '状态',
        enum: ['隐藏', '显示']
      }
    ],
    // 表格搜索表单
    searchDynamic: [
      [
        {name: 'name', label: '资源名', span: 4, type: 'text'},
        {name: 'identity', label: '标识符', span: 4, type: 'text'},
        {
          name: 'resType',
          type: 'select',
          data: [{label: '菜单', value: 1}, {label: '权限', value: 2}],
          span: 3,
          label: '类型'
        }
      ]
    ]
  }

  import CrudView from 'components/views/CrudView'
  export default {
    data() {
      return {
        tableOptions
      }
    },
    computed: {},
    methods: {},
    mounted() {
    },
    components: {CrudView}
  }
</script>
```

## 灵活丰富的动态表单组件(FormDynamic)

### 支持十多种表单组件：
* input text(单行输入框)
* input textarea(多行输入框)
* select(下拉选择框)
* radio(单选框)
* checkbox(多选框)
* treeSelect(选择树)
* input number(数字输入框)
* date(日期选择)
* datetime(日期时间选择)
* datetimerange(日期时间段选择)
* ImgUpload(图片上传表单组件)
* editor(基于vue-quill-editor富文本)
* PopupSelect(弹出式选择)
* Switch(开关选择)


## 代码样例
``` bash
<template>
  <div class="main-view main-view-full" style="padding-top: 50px">
    <row>
      <i-col span="24">
        <FormDynamic ref="dynamic1" v-model="fromData" :data="dynamic1" :label-width="120">
        </FormDynamic>
      </i-col>
    </row>
    <PopupEdit ref="popupEdit"
               :width="1000"
               :dynamic="dynamic1"
               @on-success="editSuccess"
               :label-width="120">
    </PopupEdit>
    <PopupSelect ref="popSelect" :content="userPage"></PopupSelect>
  </div>
</template>
<script>
  import {FormDynamic, PopupEdit, PopupSelect} from 'components/';
  let self = null;
  const dynamic1 = [
      [
        {type: 'title', span: 24, text: 'Input'}
      ],
      [
        {
          name: 'numberData',
          type: 'number',
          span: 6,
          // 最小值
          min:1,
          // 最大值
          max:80010
          label: 'Number'
        },
        {
          name: 'textData',
          type: 'text',
          span: 6,
          label: 'text',
          value: 'DefaultValue',
          rules: {required: true, type: 'string'}
        },
        {
          name: 'passwordData',
          type: 'text',
          span: 6,
          password: true,
          label: 'PasswordText',
          rules: {required: true, type: 'string', message: '密码不能为空'}
        },
        {
          name: 'textarea',
          type: 'text',
          placeholder: '多行文本输入框',
          span: 6,
          label: 'TextareaLabel',
          textarea: {minRows: 1, maxRows: 6}
        }
      ], [
        {type: 'title', span: 24, text: 'date'}
      ], [
        {name: 'date1', type: 'date', span: 6, label: 'DateLabel'},
        {name: 'date2', type: 'datetime', span: 6, label: 'DateTimeLabel'},
        {name: 'date3', type: 'datetimerange', span: 6, label: 'Datetimerange'}
      ],
      [
        {type: 'title', span: 24, text: 'DataSelect'}
      ],
      [
        {
          name: 'selectData',
          type: 'select',
          span: 8,
          value: 0,
          label: 'SelectLabel',
          data: [
            {label: '选项1', value: 0}, {label: '选项2', value: 1},
            {label: '选项3', value: 2}, {label: '选项4', value: 3}
          ],
          onChange: (val, from, data) => {
            alert('onChange');
          }
        },
        {
          name: 'selectData2',
          type: 'select',
          span: 6,
          value: 0,
          label: 'URLSelectLabel',
          // value 字段名
          valField: 'id',
          // label 字段名
          textField: 'name',
          // 通过设置数据url地址进行获取
          dataUrl: '/sys/dict/get?type=job',
          onChange: (val, from, data) => {
            alert('onChange');
          }
        },
        {
          name: 'selectData3',
          type: 'select',
          span: 6,
          value: 0,
          label: 'DictSelectLabel',
          // 直接取字典数据
          dict: 'job',
          onChange: (val, from, data) => {
            alert('onChange');
          }
        }
      ], [
        {type: 'title', span: 24, text: 'Title'}
      ], [
        {
          name: 'radioData',
          type: 'radio',
          span: 6,
          value: 0,
          label: 'RadioLabel',
          data: [
            {label: '选项1', value: 0}, {label: '选项2', value: 1},
            {label: '选项3', value: 2}, {label: '选项4', value: 3}
          ],
          onChange: (val, from, data) => {
            alert('onChange');
          }
        },
        {
          name: 'checkboxData',
          type: 'checkbox',
          span: 8,
          label: 'CheckboxLabel',
          data: [
            {label: '选项1', value: 0}, {label: '选项2', value: 1},
            {label: '选项3', value: 2}, {label: '选项4', value: 3}
          ],
          enableCheckAll: true,
          checkAllLabel: '全选',
          checkAll: true,
          onChange: (val, from, data) => {
            alert('onChange');
          }
        },
        {
          name: 'deviceTypeId',
          type: 'treeSelect',
          span: 8,
          label: 'TreeSelectLabel',
          // 如果是CrudView 支持从左边树绑定数据，select组件同样支持
          dataFromTree: true,
          textField: 'name',
          valField: 'id',
          dataUrl: '/sys/res/list',
          onChange: (val, from, data) => {
            alert('onChange');
          }
        },
        {
          name: 'popSelectId',
          span:
            8,
          label:
            'PopupSelectLabel',
          type:
            'popText',
          textField:
            'popSelectName',
          onClick(fromData) {
            self.$refs['popSelect'].open((selection) => {
              console.log(selection[0].id);
              self.$set(fromData, 'popSelectId', selection[0].id);
              self.$set(fromData, 'popSelectName', selection[0].username);
            })
          }
        }
      ],
      [
        {
          name: 'imgData',
          // 最多只能上传2张
          max: 2,
          type: 'imgUpload',
          span: 24,
          label: 'ImgUploadLabel'
        },
        {name: 'editor', type: 'editor', span: 24, label: 'EditorLabel', placeholder: '富文本编辑器'}
      ],
      [
        {
          name: 'button', type: 'buttons',
          span: 24,
          data: [
            {
              label: 'SetData',
              onClick() {
                // 给表单设置数据
                self.$refs.dynamic1.setFormData({numberData: 10001, textData: 'SetData'})
              }
            },
            {
              label: 'GetFormData',
              onClick() {
                self.$refs.dynamic1.submit((param) => {
                  console.log(param);
                  alert(JSON.stringify(param))
                }, (res) => {
                  // 表单验证失败
                });
              }
            },
            {
              // 弹出窗口编辑表单
              label: 'PopupWindow',
              onClick() {
                self.$refs.popupEdit.open({
                  title: 'PopupEditWindow',
                  // 确认提交url
                  postUrl: null
                }, self.fromData);
              }
            },
            {
              label: 'GotoEditPage',
              onClick() {
                self.editOptions.editSuccess = self.editSuccess;
                let action = {
                  // 窗口标题
                  title: 'title',
                  // 确认提交请求url
                  postUrl: ''
                }
                self.$router.push({
                  path: self.$router.currentRoute.path + '/edit',
                  query: {options: self.editOptions, action: action, data: self.fromData}
                })
              }
            }
          ]
        }
      ]
    ];
  /**
   * 弹出式表单参数
   */
  const editOptions = {
    width: 1200,
    labelWidth: 120,
    dynamic: dynamic1
  };

  export default {
    data() {
      return {
        editOptions,
        dynamic1,
        fromData: {}
      }
    },
    computed: {
      // 弹出选择页面
      userPage() {
        return import('pages/sys/user');
      }
    },
    methods: {
      // 编辑成功
      editSuccess(res) {
        console.log(res);
      }
    },
    mounted() {
      self = this;
    },
    components: {
      FormDynamic, PopupEdit, PopupSelect
    }
  }
</script>
```

## 排版规则
``` bash
[
  [{}...],//第一行
  [],     //第二行
  [],     //第三行
]
也可以设置为span：24 独占一行
```
## 表单验证
``` bash
rules: {
      required: true, //开启表单验证
      type: 'number', //验证类型
      message: '分类不能为空'//提示信息
}
具体请看https://github.com/yiminghe/async-validator
```

## 您还可以使用基于动态表单组件开发的其他组件
* 弹出式编辑表单（PopupEdit）
* 跳转式编辑表单 (edit.vue)

## 还有什么？
* CrudTreeView（树编辑布局）
* PhotoViewer（图片预览组件）
* DataTree（数据树）
* DataSelect（数据下拉框,支持直接填入字典标识）
* DataTable（数据表格）
* CrudTree(增删改查树)
* CrudTable(增删表格)
* PermsValid(权限验证)
...
## 引用关系
``` bash
CrudView -> CrudTable -> DataTable  -> IView Table
                      -> PopupEdit  -> FormDynamic
                      -> Edit       -> FormDynamic

         -> CrudTree  -> DataTree   -> IView Tree
                      -> PopupEdit  -> FormDynamic
                      -> Edit       -> FormDynamic
```
