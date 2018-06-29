<style scoped>

</style>
<style>
  .vertical-center-modal {
    z-index: 1058 !important;
  }
</style>

<template>
  <div class="schedule-centent">
    <CrudView ref='crudView' :tableOptions='tableOptions'>

      <template slot='toolbar'>


        <i-button @click="runClick" type='ghost' shape='circle' icon='paper-airplane' :disabled='isMultiple'>执行
        </i-button>
        <i-button @click="resumeClick" type='ghost' shape='circle' icon='play' :disabled='isMultiple'>运行
        </i-button>
        <i-button @click="pauseClick" type='ghost' shape='circle' icon='pause' :disabled='isMultiple'>暂停
        </i-button>
        <i-button @click="logClick" type='ghost' shape='circle' icon='clipboard' :disabled='isSingle'>执行日志
        </i-button>


      </template>


    </CrudView>
    <!-- @close="cronPopover=false"-->
    <Modal class-name="vertical-center-modal" width="500" title="Cron选择" v-model="cronSelect" @on-ok="changeCron">
      <Cron ref='cron'></Cron>
    </Modal>

    <Modal class-name="vertical-center-modal" width="1000" title="定时任务执行日志" v-model="logModalVisible">
      <DataTable :height="450" :columns="logColumns" dataUrl="/sys/scheduleLog/list"></DataTable>
      <div slot="footer">

      </div>
    </Modal>


  </div>

</template>

<script>
  let self = null;

  const logColumns = [
    {type: 'selection', width: 60, align: 'center'},
    {key: 'name', title: '任务名称', width: 200},
    {key: 'beanName', title: 'bean名称', width: 250},
    {key: 'methodName', title: '方法名称', width: 200},
    {key: 'params', title: '参数', width: 200},
    {key: 'times', title: '耗时(毫秒)', width: 140},
    {
      key: 'status', title: '执行状态', width: 140, enum: ['失败', '成功']
    },
    {
      key: 'createTime',
      title: '创建时间',
      width: 200
    }
  ];

  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    width: 600,
    labelWidth: 90,
    opened () {
      self.$refs['cron'].reset();
    },
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'name', type: 'text', span: 24, label: '任务名称', rules: {required: true}},
        {name: 'beanName', type: 'text', span: 24, label: 'bean名称', rules: {required: true}},
        {name: 'methodName', type: 'text', span: 24, label: '方法名称', rules: {required: true}},
        {name: 'params', type: 'text', span: 24, label: '参数名称', rules: {required: true}},
        {
          name: 'cronExpression',
          type: 'popText',
          span: 24,
          label: 'cron表达式',
          rules: {required: true},
          textField: 'cronExpression',
          onClick (fromData) {
            self.cronSelect = true;
            self.fromData = fromData;
            self.cronVal = '';
          }
        },
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
    title: '定时任务',
    permsPrefix: 'schedule',
    dataUrl: '/sys/schedule/list',
    createUrl: '/sys/schedule/create',
    deleteUrl: '/sys/schedule/delete',
    updateUrl: '/sys/schedule/update',
    param: {},
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'name', title: '任务名称', width: 200},
      {key: 'beanName', title: 'bean名称', width: 250},
      {key: 'methodName', title: '方法名称', width: 200},
      {key: 'params', title: '参数', width: 200},
      {key: 'cronExpression', title: 'cron表达式', width: 200},
      {
        align: 'center',
        key: 'status',
        title: '运行状态',
        width: 120,
        render: (h, params) => {
          const row = params.row;
          return h('i-switch', {
            props: {size: 'large', falseValue: 0, trueValue: 1, value: row.status},
            on: {
              'on-change': (value) => {
                row.status = value;
                self.$http.apiPost('/sys/schedule/update', row).then((res) => {
                  console.log(res);
                  if (!res.success) {
                    this.$http.handleError(res);
                  } else {
                    self.$refs['crudView'].$refs['crudTable'].refreshTable();
                  }
                });
              }
            }
          }, [
            h('span', {
              slot: 'open'
            }, '正常'),
            h('span', {
              slot: 'close'
            }, '暂停')
          ]);
        }
      },
      {key: 'createTime', title: '创建时间', width: 160},
      {key: 'note', title: '备注', minWidth: 100}
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

  import {CrudView, DataTable} from 'components/';
  import Cron from 'components/form/Cron';

  export default {
    data () {
      return {
        tableOptions,
        cronSelect: false,
        cronVal: '',
        fromData: null,
        logModalVisible: false,
        logColumns
      };
    },
    computed: {
      isSingle () {
        return !(this.tableOptions.selection !== null && this.tableOptions.selection.length === 1);
      },
      isMultiple () {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length > 0);
      }
    },
    methods: {
      logClick () {
        this.logModalVisible = true;
      },
      changeCron () {
        this.$nextTick(() => {
          this.fromData.cronExpression = this.$refs['cron'].getValue();
        });
      },
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
      self = this;
    },
    components: {CrudView, Cron, DataTable}
  };
</script>
