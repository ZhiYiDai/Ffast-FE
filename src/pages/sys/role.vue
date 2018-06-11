<style scoped>
  .sd {
    display: block;
  }
</style>

<template>
  <CrudView ref='crudView' :tableOptions='tableOptions'>
    <template slot='toolbar'>
      <Modal title='角色资源' v-model='editVisible'
             class-name='vertical-center-modal'
             width='400'
             :loading='editLoading'
             @on-ok='roleResEditOk'>

        <DataTree v-model='resIds'
                  ref='resTree'
                  style='height:400px;overflow: auto'
                  dataUrl='/sys/roleRes/getRoleRes'
                  @on-data-loaded='treeLoaded'
                  show-checkbox
                  lazy>

        </DataTree>
      </Modal>
      <i-button type='ghost' shape='circle' icon='ios-list-outline' @click='roleResEdit()' :disabled='isSingle'>角色资源
      </i-button>
    </template>
  </CrudView>
</template>
<script>
  /**
   * 弹出式表单参数
   */
  const tableEditOptions = {
    editPage: true,
    width: 1200,
    labelWidth: 70,
    title: '角色',
    dynamic: [
      [
        {name: 'id', hidden: true},
        {name: 'name', type: 'text', span: 24, label: '角色名', rules: {required: true}},
        {name: 'description', type: 'editor', textarea: {minRows: 2, maxRows: 3}, span: 24, label: '角色描述'},
        {
          name: 'status',
          openText: '启用',
          closeText: '禁用',
          type: 'switch',
          span: 24,
          label: '角色状态',
          value: 1,
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
    dataUrl: '/sys/role/list'
  };
  /**
   * 表格参数
   */

  const tableOptions = {
    selection: [],
    pageSize: 20,
    labelWidth: 70,
    title: '角色管理',
    permsPrefix: 'role',
    editOptions: tableEditOptions,
    dataUrl: '/sys/role/list',
    createUrl: '/sys/role/create',
    deleteUrl: '/sys/role/delete',
    updateUrl: '/sys/role/update',
    param: {},
    columns: [
      {type: 'selection', width: 60, align: 'center'},
      {key: 'name', title: '角色名', align: 'center', width: 180},
      {
        key: 'status',
        title: '角色状态',
        align: 'center',
        width: 180,
        enum: [{value: '启用', id: 1}, {value: '禁用', id: 0}]
      },
      {key: 'description', title: '角色描述', align: 'center'}
    ],
    searchDynamic: [
      [
        {name: 'name', type: 'text', span: 6, label: '角色名'},
        {name: 'description', label: '角色描述', span: 6, type: 'text'},
        {
          name: 'status',
          label: '角色状态',
          span: 6,
          type: 'select',
          data: [{label: '启用', value: 1}, {label: '禁用', value: 0}]
        }
      ]
    ]
  };

  import {CrudView, DataTree} from 'components/';
  import utils from '@/utils/common';

  export default {
    data () {
      return {
        tableOptions,
        treeOptions,
        editVisible: false,
        editLoading: true,
        resIds: []
      };
    },
    computed: {
      isSingle () {
        return !(this.tableOptions.selection != null && this.tableOptions.selection.length === 1);
      }
    },
    methods: {
      treeLoaded (rows, res) {
        for (let i = 0; i < rows.length; i++) {
          if ((rows[i].resType === 2 || !utils.isNotChilden(rows, rows[i].id)) && res.data.selected != null && res.data.selected.contains(rows[i].id)) {
            console.log(rows[i]);
            this.$set(rows[i], 'checked', true);
          }
        }
      },
      roleResEdit () {
        let selection = this.$refs.crudView.getSelection();
        if (selection != null) {
          this.$refs.resTree.queryData({roleId: selection[0].id});
          this.editVisible = true;
        }
      },
      roleResEditOk () {
        let selection = this.$refs.crudView.getSelection();
        let checkedNodes = this.$refs.resTree.getCheckedNodes(true);
        let ids = [];
        for (let i = 0; i < checkedNodes.length; i++) {
          ids.push(checkedNodes[i].id);
        }
        let param = {
          ids: ids.toString(),
          roleId: selection[0].id
        };
        this.$http.apiPost('/sys/roleRes/saveRes', param).then((res) => {
          this.editLoading = false;
          if (!res.success) {
            this.$http.handleError(res);
            setTimeout(() => {
              this.editLoading = true;
            }, 100);
          } else {
            this.$Message.success('提交成功');
            this.editVisible = false;
          }
        });
      }
    },
    mounted () {
    },
    components: {CrudView, DataTree}
  };
</script>
