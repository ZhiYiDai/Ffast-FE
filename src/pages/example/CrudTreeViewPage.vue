<style scoped>

</style>

<template>
  <CrudTreeView :treeOptions="treeOptions">
  </CrudTreeView>
</template>
<script>
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
    permsPrefix: 'dict',
    categoryField: 'dictTypeId',
    dataUrl: '/sys/dictType/list',
    createUrl: '/sys/dictType/create',
    deleteUrl: '/sys/dictType/delete',
    updateUrl: '/sys/dictType/update',
    title: '字典分类'
  };

  import {CrudTreeView} from 'components/';

  export default {
    data () {
      return {
        treeOptions
      };
    },
    computed: {},
    methods: {},
    mounted () {
    },
    components: {CrudTreeView}
  };
</script>
