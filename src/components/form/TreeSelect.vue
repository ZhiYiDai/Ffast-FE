<style scoped>
  .tree-panel {
    padding: 0px 10px;
    width: 100%;
    height: 200px;
    overflow-y: auto;
  }

  .tree-select-panel .ivu-select-selection .ivu-select-dropdown {
    display: none;
  }

  .tree-select-panel {
    width: 100%;
  }
</style>

<style>
  .tree-panel input {
    cursor: pointer;
  }

  .tree-panel .ivu-tree ul li {
    margin: 0px 0px;
  }

  .ivu-form-item-content .tree-select-panel {
    line-height: 24px !important;
  }

  .ivu-dropdown-transfer {
    z-index: 1060;
  }
</style>


<template>
  <Dropdown
    trigger="custom"
    :visible="visible"
    class="tree-select-panel"
    v-clickoutside="handleClose">
    <a href="javascript:void(0)" @click="handleOpen">
      <i-input v-model="selectedText"
               :icon="visible?'arrow-up-b':'arrow-down-b'"
               :placeholder="placeholder"
               @on-click.stop="iconClick"
               readonly>

      </i-input>
    </a>
    <DropdownMenu slot="list">
      <div class="tree-panel">
        <Tree v-model="value" :showCheckbox="showCheckbox" :multiple="multiple" :data="treeData"
              @on-select-change="selectChange" @on-check-change="checkChange"></Tree>
      </div>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  import clickoutside from 'iview/src/directives/clickoutside';
  import utils from '@/utils/common';

  export default {
    directives: {clickoutside},
    name: 'TreeSelect',
    props: {
      value: {},
      valField: {
        default: 'id'
      },
      textField: {
        default: 'name'
      },
      data: {
        type: Array
      },
      placeholder: {
        default: '请选择'
      },
      constructTree: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      lastStep: {
        type: Boolean,
        default: false
      },
      param: {},
      dataUrl: {}
    },
    data () {
      return {
        mData: [],
        tData: [],
        visible: false,
        selected: null,
        selectedText: ''
      };
    },
    computed: {
      treeData () {
        return this.data == null ? this.tData : this.data;
      }
    },
    methods: {
      /**
       * 获取数据
       */
      queryData () {
        if (this.dataUrl == null) {
          return;
        }
        this.loading = true;
        let param = Object.assign({}, this.param);
        this.$http.apiPost(this.dataUrl, param).then((res) => {
          this.loading = false;
          if (!res.success) {
            this.$http.handleError(res);
          } else {
            this.mData = res.data.rows;
            this.$emit('on-data-loaded', res.data.rows, res);
            if (this.constructTree) {
              this.tData = utils.constructTree(res.data.rows, this.textField, true);
            } else {
              this.tData = res.data.rows;
            }
            if (this.value != null) {
              this.findSelected(this.value, this.treeData);
            }
          }
        });
      },
      selectChange (selected) {
        if (this.showCheckbox) {
          return;
        }

        if (selected == null || selected.length <= 0) {
          this.selected = null;
          this.selectedText = '';
          this.$emit('input', null);
        } else {
          if (this.lastStep && selected[0].children != null && selected[0].children.length > 0) {
            return;
          }

          this.selected = selected[0];
          this.selectedText = this.selected[this.textField].toString();
          this.$emit('input', this.selected[this.valField]);
        }
        this.visible = false;
        this.$emit('on-change', this.selected);
      },
      checkChange (checked) {
        if (checked == null || checked.length <= 0) {
          this.selected = null;
          this.selectedText = '';
          this.$emit('input', null);
        } else {
          let textArr = [];
          let valArr = [];
          for (let i = 0; i < checked.length; i++) {
            if (!this.lastStep || checked[i].children == null || checked[i].children.length <= 0) {
              textArr.push(checked[i][this.textField]);
              valArr.push(checked[i][this.valField]);
            }
          }
          this.selectedText = textArr.join(',');
          this.selected = checked;
          this.$emit('input', valArr);
        }
        this.$emit('on-change', this.selected);
      },
      checkAll () {
        let checkData = [];
        this.checkChildren(this.mData, checkData);
        this.checkChange(checkData);
      },
      checkChildren (data, checkData) {
        for (let i = 0; i < data.length; i++) {
          this.$set(data[i], 'checked', true);
          checkData.push(data[i]);
          if (data[i].children) {
            this.checkChildren(data[i].children, checkData);
          }
        }
      },
      unAllSelect () {
        for (let i = 0; i < this.mData.length; i++) {
          if (this.mData[i].selected) {
            this.$set(this.mData[i], 'selected', false);
          }
        }
      },
      handleOpen () {
        this.visible = true;
      },
      handleClose () {
        this.visible = false;
      },
      iconClick (e) {
        e.stopPropagation();
        this.visible = !this.visible;
      },
      findSelected (val, data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i][this.valField] == val) {
            data[i].selected = true;
            this.selected = data[i];
            this.selectedText = this.selected[this.textField].toString();
            return;
          }
          if (data[i].children != null) {
            this.findSelected(val, data[i].children);
          }
        }
      }
    },
    created () {
      this.queryData();
    },
    watch: {
      value (newVal, oldVal) {
        this.unAllSelect();
        this.selected = null;
        this.findSelected(newVal, this.treeData);
      }
    },
    components: {}
  };
</script>


