<style scoped>

</style>

<template>
  <CrudView ref='crudView' :tableOptions='tableOptions' :treeOptions='treeOptions'>

    <template slot='toolbar'>

      <Poptip confirm title='您确认重置当前选中账号的密码吗？' @on-ok='roleResPassword()' placement='bottom-start' transfer>
        <i-button type='ghost' shape='circle' icon='ios-locked-outline' :disabled='isSingle'>重置密码
        </i-button>
      </Poptip>

    </template>

  </CrudView>
</template>

<script>
  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    width: 600,
    labelWidth: 70,
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'username', type: 'text', span: 12, label: '用户名', rules: {required: true}},
        {name: 'name', type: 'text', span: 12, label: '姓名', rules: {required: true}}
      ], [
        {
          name: 'email',
          type: 'text',
          span: 12,
          label: '邮箱',
          rules: {required: true, type: 'email', message: '请填写正确的电子邮箱!'}
        },
        {name: 'tel', type: 'text', span: 12, label: '手机号码'}
      ], [
        {
          name: 'roleId',
          type: 'select',
          span: 24,
          label: '角色',
          dataUrl: '/sys/role/list',
          textField: 'name',
          valField: 'id',
          multiple: true
        }
      ], [
        {
          name: 'status',
          span: 6,
          label: '用户状态',
          type: 'switch',
          openText: '启用',
          closeText: '禁用',
          value: 1,
          trueValue: 1,
          falseValue: 0,
          rules: {required: true, type: 'number'}
        },
        {
          name: 'isLock',
          span: 6,
          label: '锁定',
          type: 'switch',
          openText: '是',
          closeText: '否',
          value: 0,
          trueValue: 1,
          falseValue: 0,
          rules: {required: true, type: 'number'}
        }
      ]
    ]
  };
  /**
   * 树参数
   */
  const treeOptions = {
    dataUrl: '/sys/role/list',
    categoryField: 'roleId',
    manageUrl: '/role',
    showToolbar: true
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
    dataUrl: '/sys/user/list',
    createUrl: '/sys/user/create',
    deleteUrl: '/sys/user/delete',
    updateUrl: '/sys/user/update',
    param: {},
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'username', title: '用户名', width: 150},
      {key: 'name', title: '姓名', width: 150},
      {key: 'roleId', title: '角色', dataFromTree: true, width: 150},
      {key: 'status', title: '状态', width: 150, enum: [{value: '正常', id: 1}, {value: '禁用', id: 0}]},
      {key: 'email', title: '邮箱', width: 150},
      {key: 'tel', title: '手机号码', width: 150},
      {key: 'isLock', title: '是否锁定', width: 150, enum: [{value: '是', id: 1}, {value: '否', id: 0}]},
      {key: 'lockTime', title: '锁定时间', width: 150},
      {key: 'loginCount', title: '登录次数', width: 150},
      {key: 'loginFailureCount', title: '失败次数', width: 150},
      {key: 'loginIp', title: '登录Ip', width: 150},
      {key: 'loginTime', title: '登录时间', width: 150}
    ],
    searchDynamic: [
      [
        {name: 'username', label: '用户名', span: 6, type: 'text'},
        {name: 'email', label: '邮箱', span: 6, type: 'text'},
        {name: 'tel', label: '手机号码', span: 6, type: 'text'},
        {name: 'loginIp', label: '登录Ip', span: 6, type: 'text'}
      ], [
        {
          name: 'status',
          label: '状态',
          span: 6,
          type: 'select',
          data: [{label: '启用', value: 1}, {label: '禁用', value: 0}]
        },
        {
          name: 'isLock',
          label: '是否锁定',
          span: 6,
          type: 'select',
          data: [{label: '是', value: 1}, {label: '否', value: 0}]
        }
      ]
    ]
  };

  import {CrudView} from 'components/';

  export default {
    data() {
      return {
        tableOptions,
        treeOptions
      };
    },
    computed: {
      isSingle() {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length === 1);
      }
    },
    methods: {
      roleResPassword() {
        let selection = this.tableOptions.selection;
        if (selection != null) {
          this.$http.apiPost('/sys/user/reseting', {id: selection[0].id}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$Message.success({
                content: res.message,
                duration: 6
              });
            }
          });
        }
      }
    },
    created() {
    },
    components: {CrudView}
  };
</script>
