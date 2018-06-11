<style scoped>

  .crud-tree-view {
    background: #fff;
    padding: 0px 10px;
    border-radius: 4px;
  }

  .tree-toolbar {
    padding: 6px 2px 6px 2px;
  }

  .crud-tree-view-tree {
    height: 100%;
  }


</style>
<style>
  .ctv-right-title {
    padding: 0px 5px 8px 10px;
    font-size: 16px;
    border-bottom: #e0e0e0 1px solid;
  }
</style>

<template>
  <Row class='crud-tree-view'>
    <!--左边树-->
    <i-col v-if='treeOptions' :xs='8' :sm='6' :md='6' :lg='4' class='left-col'>
      <slot name='treeTop'></slot>
      <!--顶部工具栏-->
      <div class='tree-toolbar'>
        <PermsValid :perms-name='createPerms'>
          <Button size='small' shape='circle' type='ghost' icon='plus' @click='showCreate'>添加</Button>
        </PermsValid>

        <PermsValid :perms-name='deletePerms'>
          <Poptip confirm title='您确认删除选中的内容吗？' @on-ok='treeDelData()' placement='bottom-start' transfer>
            <i-button size='small' type='ghost' shape='circle' icon='trash-b' :disabled='!treeOptions.selected'>删除
            </i-button>
          </Poptip>
        </PermsValid>
      </div>
      <!--顶部工具栏结束-->
      <DataTree ref='tree'
                :param='treeOptions.param'
                :dataUrl='treeOptions.dataUrl'
                @on-select='onTreeChange'
                @on-data-loaded='onTreeDataLoaded'
                class='crud-tree-view-tree'/>
    </i-col>
    <!--左边树结束-->
    <!--右边信息栏-->
    <i-col :xs='tableSpan(16)' :sm='tableSpan(18)' :md='tableSpan(18)' :lg='tableSpan(20)'
           :xs-offset='8' :sm-offset='8' :md-offset='8' :lg-offset='8' class='right-col'>
      <template slot='toolbar'>
        <!--增删改按钮结束-->
        <slot name='toolbar'></slot>
      </template>

      <template v-if='treeOptions.selected || treeOptions.createMode'>
        <div class='ctv-right-title'>
          {{treeOptions.createMode ? '添加' : '编辑'}}
          {{treeOptions.title}}
        </div>
        <FormDynamic style='padding-top: 20px'
                     ref='dataFrom'
                     :data='treeOptions.editOptions.dynamic'
                     :label-width='treeOptions.editOptions.labelWidth'>

        </FormDynamic>

        <div style='padding:10px'>
          <div v-show='treeOptions.createMode'>
            <PermsValid :perms-name='createPerms'>
              <Button shape='circle' type='ghost' icon='plus' @click='treeAddData()'>保存添加</Button>
            </PermsValid>
          </div>
          <div v-show='treeOptions.selected && !treeOptions.createMode'>
            <PermsValid :perms-name='updatePerms'>
              <i-button type='ghost' shape='circle' icon='edit' @click='treeEditData()'>保存修改</i-button>
            </PermsValid>
          </div>
        </div>


        <div v-show='!treeOptions.createMode'>
          <slot name='append'>
          </slot>
        </div>


      </template>
      <template v-else>
        <div style='font-size: 14px'>
          <Icon type='information-circled'></Icon>
          请先选择编辑项
        </div>
      </template>

    </i-col>
    <!--右边信息栏结束-->
  </Row>
</template>
<script>
  import {FormDynamic, PopupEdit, DataSelect, DataTree, PermsValid} from 'components/';
  import utils from 'utils/common';

  export default {
    props: {
      treeOptions: {},
      tableOptions: {
        labelWidth: {
          default: 60
        },
        editOptions: {
          labelWidth: {
            default: 60
          }
        }
      }
    },
    data () {
      return {
        addedDynamic: false,
        treeCopyData: {},
        treeSelected: null
      };
    },
    computed: {
      createPerms () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':create';
      },
      updatePerms () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':update';
      },
      deletePerms () {
        return this.treeOptions.permsPrefix == null ? null : this.treeOptions.permsPrefix + ':delete';
      },
      categoryField () {
        if (this.treeOptions == null || this.treeOptions.categoryField == null) {
          return 'parentId';
        } else {
          return this.treeOptions.categoryField;
        }
      }
    },
    methods: {
      refreshTree (type) {
        this.$refs.tree.queryData();
      },
      tableSpan (span) {
        if (this.treeOptions === null) {
          return 24;
        } else {
          return span;
        }
      },
      getTreeSelected (showMsg) {
        if (this.treeOptions.selected === null) {
          if (showMsg == null || showMsg) {
            this.$Message.error('未选择操作项！');
          }
          return null;
        } else {
          return this.treeOptions.selected;
        }
      },
      editTreeSuccess (res) {
        this.refreshTree();
      },
      onTreeChange (selected) {
        this.$emit('on-tree-select', selected);
        this.$set(this.treeOptions, 'createMode', false);
        this.$set(this.treeOptions, 'selected', selected);
        let val = null;
        if (selected != null) {
          val = selected.id;
//          if (this.tableOptions != null) {
//            this.$set(this.tableOptions.param, this.categoryField, val);
//          }
        }
        this.$nextTick(() => {
          if (selected != null) {
            this.$refs.dataFrom.setFormData(selected);
          }
        });
      },
      showCreate () {
        let selected = this.getTreeSelected(false);
        let param = {};
        if (selected != null) {
          param.parentId = selected.id;
        }
        this.$set(this.treeOptions, 'createMode', true);
        this.$nextTick(() => {
          this.$refs.dataFrom.setFormData(param);
        });
      },
      /**
       * 添加树数据
       */
      treeAddData () {
        this.$refs.dataFrom.submit((param) => {
          this.$http.apiPost(this.treeOptions.createUrl, param).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.$refs.dataFrom.reset();
              this.treeOptions.selectId = res.data.id;
              this.refreshTree();
              this.$Message.success('添加成功');
            }
          });
        }, (res) => {
          this.loading = false;
        });
      },
      /**
       * 编辑树数据
       */
      treeEditData () {
        let selected = this.getTreeSelected();
        if (selected != null) {
          this.$refs.dataFrom.submit((param) => {
            this.$http.apiPost(this.treeOptions.updateUrl, param).then((res) => {
              this.loading = false;
              if (!res.success) {
                this.$http.handleError(res);
              } else {
                this.treeOptions.selectId = this.treeOptions.selected.id;
                this.refreshTree();
                this.$Message.success('修改成功');
              }
            });
          }, (res) => {
            this.loading = false;
          });
        }
      },
      /**
       * 删除树数据
       */
      treeDelData () {
        let selected = this.getTreeSelected();
        if (selected != null) {
          this.treeOptions.selectId = selected.parentId;
          this.$http.apiPost(this.treeOptions.deleteUrl, {ids: selected.id}).then((res) => {
            this.loading = false;
            if (!res.success) {
              this.$http.handleError(res);
            } else {
              this.treeOptions.selected = null;
              this.$Message.success('删除成功');
              this.refreshTree();
            }
          });
        }
      },
      /**
       * 侧边树更新完毕
       * @param data
       */
      onTreeDataLoaded (data) {
        if (this.treeOptions.editOptions != null) {
          this.bindTreeData(data, this.treeOptions.editOptions.dynamic);
          this.$nextTick(() => {
            this.$refs.tree.select(this.treeOptions.selectId);
          });
        }
      },
      /**
       * 将侧边树的数据
       * @param data
       */
      bindTreeData (data, dynamic) {
        for (let i in dynamic) {
          for (let j in dynamic[i]) {
            if (dynamic[i][j].dataFromTree) {
              if (dynamic[i][j].type === 'treeSelect') {
                this.$set(this.treeCopyData, dynamic[i][j].name, utils.constructTree(JSON.parse(JSON.stringify(data)), 'name'));
              } else if (dynamic[i][j].type === 'select') {
                this.$set(this.treeCopyData, dynamic[i][j].name, utils.constructSelect(JSON.parse(JSON.stringify(data)), 'name', 'id'));
              }
              dynamic[i][j].data = this.treeCopyData[dynamic[i][j].name];
            }
          }
        }
      }
    },
    mounted () {
    },
    components: {
      PermsValid, DataTree, FormDynamic, PopupEdit, DataSelect
    }
  };
</script>
