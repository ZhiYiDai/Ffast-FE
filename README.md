# Ffast-FE

> 基于vue iview后台管理系统前端快速开发解决方案

## Build Setup

``` bash
# install dependencies
npm install or yarn

# serve with hot reload at localhost:8000
npm run dev

# build for production with minification
npm run build

```

# Ffast-FE 是什么
``` bash
Ffast-FE 是一套基于vue iview后台管理系统前端快速开发解决方案,已实现基本的系统管理页面,您可以用其中的组件快速开发属于你的页面。
已实现页面（整体布局界面，用户管理，角色管理，字典管理，权限菜单，接口测试，系统日志）
开发中的页面（代码生成）
演示地址 http://www.ffast.cn/  备用地址http://39.107.104.190/ffast
```


## 一个简单的增删改表格页面
``` bash
<template>
  <CrudView :tableOptions="tableOptions" :treeOptions="treeOptions"></CrudView>
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
        {name: 'weight', type: 'text', span: 12, label: '权重'}
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
   * 树参数
   */
  const treeOptions = {
    title: '权限菜单',
    // 左边树数据地址
    dataUrl: '/sys/res/list',
    // 左边树增加数据地址
    createUrl: '/sys/res/create',
    // 左边树删除数据地址
    deleteUrl: '/sys/res/delete',
    // 左边树更新数据地址
    updateUrl: '/sys/res/update',
    // 是否显示工具栏
    showToolbar: true,
    editOptions: tableEditOptions
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
        //类型枚举 （自动将值（id）转换为对应标签value）
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
        {name: 'url', label: 'Url', span: 4, type: 'text'},
        {name: 'status', label: '状态', span: 3, type: 'text'},
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
        tableOptions,
        treeOptions
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




# 灵活丰富的动态表单组件(FormDynamic)

## 支持十多种表单组件：
> 1.input text(单行输入框)

> 2.input textarea(多行输入框)

> 3.select(下拉选择框)

> 4.radio(单选框)

> 5.checkbox(多选框)

> 6.treeSelect(选择树)

> 7.input number(数字输入框)

> 8.date(日期选择)

> 9.datetime(日期时间选择)

> 10 datetimerange(日期时间段选择)

> 11.ImgUpload(图片上传表单组件)

> 12.editor(基于vue-quill-editor富文本)

## 代码样例
``` bash
<template>
  <FormDynamic ref="dynamic" :data="dynamicData" :label-width="100"></formDynamic>
</template>
<script>
    dynamicData: [
      [
        {name: 'id', hidden: true},
        {
          name: 'name',
          type: 'text',
          span: 12,
          label: '资源名',
          // 表单验证
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
        {name: 'weight', type: 'text', span: 12, label: '权重'}
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

  import FormDynamic from 'components/FormDynamic'

  export default {
    data() {
      return {
        dynamicData,
      }
    },
    computed: {},
    methods: {},
    mounted() {
    },
    components: {FormDynamic}
  }
</script>
```

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

# 您还可以使用基于动态表单组件开发的其他组件
> 1.弹出式编辑表单（PopupEdit）
> 2.跳转式编辑表单 (edit.vue)

# 还有什么？
> CrudTreeView（树编辑布局）

> PhotoViewer（图片预览组件）

> DataTree（数据树）

> DataSelect（数据下拉框,支持直接填入字典标识）

> DataTable（数据表格）

> CrudTree(增删改查树)

> CrudTable(增删表格)

> PermsValid(权限验证)

...

# 引用关系
``` bash
CrudView -> CrudTable -> DataTable  -> IView Table
                      -> PopupEdit  -> FormDynamic
                      -> Edit       -> FormDynamic

         -> CrudTree  -> DataTree   -> IView Tree
                      -> PopupEdit  -> FormDynamic
                      -> Edit       -> FormDynamic
```
# 后端解决方案
> （Ffast java）文档整理中...
