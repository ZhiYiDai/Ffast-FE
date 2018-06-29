<style scoped>

</style>

<template>
  <div>
    <CrudView ref='crudView' :tableOptions='tableOptions'>

      <template slot='toolbar'>


        <i-button @click="runClick" type='ghost' shape='circle' icon='paper-airplane' :disabled='isSelected'>执行
        </i-button>
        <i-button @click="resumeClick" type='ghost' shape='circle' icon='play' :disabled='isSelected'>运行
        </i-button>
        <i-button @click="pauseClick" type='ghost' shape='circle' icon='pause' :disabled='isSelected'>暂停
        </i-button>

      </template>


    </CrudView>
    <!--@change="changeCron" @close="cronPopover=false"-->
    <Cron :data="cron" ></Cron>
  </div>

</template>

<script>
  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    width: 600,
    labelWidth: 90,
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'name', type: 'text', span: 24, label: '任务名称', rules: {required: true}},
        {name: 'beanName', type: 'text', span: 24, label: 'bean名称', rules: {required: true}},
        {name: 'methodName', type: 'text', span: 24, label: '方法名称', rules: {required: true}},
        {name: 'cronExpression', type: 'text', span: 24, label: 'cron表达式', rules: {required: true}},
        {
          name: 'status',
          span: 24,
          label: '运行状态',
          type: 'switch',
          openText: '开启',
          closeText: '暂停',
          value: 1,
          trueValue: 1,
          falseValue: 0,
          rules: {required: true, type: 'number'}
        },
        {name: 'note', type: 'text', textarea: {minRows: 2, maxRows: 3}, span: 24, label: '备注'}
      ]
    ]
  };

  /**
   * 表格参数
   */
  const tableOptions = {
    editOptions: tableEditOptions,
    selection: [],
    labelWidth: 70,
    pageSize: 20,
    title: '用户',
    permsPrefix: 'user',
    dataUrl: '/sys/schedule/list',
    createUrl: '/sys/schedule/create',
    deleteUrl: '/sys/schedule/delete',
    updateUrl: '/sys/schedule/update',
    param: {},
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'name', title: '任务名称', width: 200},
      {key: 'beanName', title: 'bean名称', width: 200},
      {key: 'methodName', title: '方法名称', width: 200},
      {key: 'status', title: '参数', width: 200},
      {key: 'cronExpression', title: 'cron表达式', width: 200},
      {key: 'status', title: '运行状态', width: 150, enum: [{value: '正常', id: 1}, {value: '暂停', id: 0}]},
      {key: 'createTime', title: '创建时间', width: 160},
      {key: 'note', title: '备注', width: 250}
    ],
    searchDynamic: [
      [
        {name: 'name', label: '任务名称', span: 5, type: 'text'},
        {name: 'note', label: '备注', span: 5, type: 'text'},
        {
          name: 'status',
          label: '运行状态',
          span: 5,
          type: 'select',
          data: [{label: '正常', value: 1}, {label: '暂停', value: 0}]
        },
        {name: 'createTime', label: '创建时间', span: 5, type: 'date'}
      ]
    ]
  };

  import {CrudView} from 'components/';
  import Cron from 'components/form/Cron';


  export default {
    data () {
      return {
        tableOptions,
        cron:""
      };
    },
    computed: {
      isSelected () {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length > 0);
      }
    },
    methods: {
      resumeClick () {
        let selection = this.tableOptions.selection;
        if (selection != null) {
          let ids = [];
          for (let i = 0; i < selection.length; i++) {
            ids.push(selection[i].id);
          }
          console.log(ids);
          this.$http.apiPost('/sys/schedule/resume', {ids: ids}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success('运行成功');
              this.$refs['crudView'].$refs['crudTable'].refreshTable();
            }
          });
        }
      },
      pauseClick () {
        let selection = this.tableOptions.selection;
        if (selection != null) {
          let ids = [];
          for (let i = 0; i < selection.length; i++) {
            ids.push(selection[i].id);
          }
          console.log(ids);
          this.$http.apiPost('/sys/schedule/pause', {ids: ids}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success('暂停成功');
              this.$refs['crudView'].$refs['crudTable'].refreshTable();
            }
          });
        }
      },
      runClick () {
        let selection = this.tableOptions.selection;
        if (selection != null) {
          let ids = [];
          for (let i = 0; i < selection.length; i++) {
            ids.push(selection[i].id);
          }
          this.$http.apiPost('/sys/schedule/run', {ids: ids}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success('执行成功');
              this.$refs['crudView'].$refs['crudTable'].refreshTable();
            }
          });
        }
      }
    },
    created () {
    },
    components: {CrudView,Cron}
  };
</script>
