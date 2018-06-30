<style rel="stylesheet/scss" lang="scss" scoped>

</style>

<template>
  <CrudView :tableOptions="tableOptions"></CrudView>
</template>

<script>
  /**
   * 表格参数
   */
  const tableOptions = {
    title: '操作日志表',
    pageSize: 20,
    labelWidth: 65,
    permsPrefix: 'device',
    dataUrl: '/sys/log/list',
    selection: [],
    param: {},
    columns: [
      {key: 'createTime', title: '时间', width: 160,sortable: true},
      {key: 'creatorName', title: '操作人', width: 100},
      {key: 'operation', title: '操作项', width: 100},
      {key: 'content', title: '内容'}
    ],
    searchDynamic: [
      [
        {name: 'content', label: '日志内容', span: 4, type: 'text'},
        {name: 'operation', label: '操作项', span: 4, type: 'text'},
        {name: 'creatorName', label: '操作人', span: 4, type: 'text'},
        {name: 'createTime', label: '时间', span: 4, type: 'date'}
      ]
    ]
  };
  import {CrudView} from 'components/';

  export default {
    data () {
      return {
        tableOptions
      };
    },
    computed: {},
    methods: {},
    mounted () {
    },
    components: {CrudView}
  };
</script>
