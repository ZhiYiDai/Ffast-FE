<style scoped>

</style>

<template>
  <CrudView ref="crudView" :tableOptions="tableOptions" :treeOptions="treeOptions">
  </CrudView>
</template>
<script>
  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    width: 450,
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'code', type: 'text', span: 20, label: '编号'},
        {
          name: 'dictTypeId',
          type: 'treeSelect',
          span: 20,
          label: '分类',
          dataFromTree: true,
          rules: {required: true, type: 'number'}
        },
        {name: 'name', type: 'text', span: 20, label: '名称', rules: {required: true}},
        {name: 'note', type: 'text', textarea: {minRows: 2, maxRows: 3}, span: 20, label: '备注'}
      ]
    ]
  };
  /**
   * 弹出式表单参数
   */
  const treeEditOptions = {
    width: 400,
    labelWidth: 80,
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'parentId', type: 'treeSelect', dataFromTree: true, span: 24, label: '父类标识'},
        {name: 'identity', type: 'text', span: 24, label: '分类标识', rules: {required: true}}
      ],
      [
        {name: 'name', type: 'text', span: 24, label: '分类名称', rules: {required: true}}
      ]
    ]
  };
  /**
   * 树参数
   */
  const treeOptions = {
    showToolbar: true,
    editOptions: treeEditOptions,
    categoryField: 'dictTypeId',
    dataUrl: '/sys/dictType/list',
    createUrl: '/sys/dictType/create',
    deleteUrl: '/sys/dictType/delete',
    updateUrl: '/sys/dictType/update',
    title: '字典分类'
  };
  /**
   * 表格参数
   */
  const tableOptions = {
    selection: [],
    pageSize: 20,
    title: '基础字典',
    permsPrefix: 'dict',
    editOptions: tableEditOptions,
    dataUrl: '/sys/dict/list',
    createUrl: '/sys/dict/create',
    deleteUrl: '/sys/dict/delete',
    updateUrl: '/sys/dict/update',
    param: {},
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'dictTypeId', dataFromTree: true, title: '分类', width: 120},
      {key: 'code', title: '编号', width: 120},
      {key: 'name', title: '名称', width: 120},
      {key: 'note', title: '备注'}
    ],
    searchDynamic: [
      [
        {name: 'code', label: '编号', span: 6, type: 'text'},
        {name: 'name', label: '名称', span: 6, type: 'text'}
      ]
    ]
  };
  import {CrudView} from 'components/';

  export default {
    data () {
      return {
        tableOptions,
        treeOptions
      };
    },
    computed: {},
    methods: {},
    mounted () {
    },
    components: {CrudView}
  };
</script>
