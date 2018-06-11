<style scoped>
  .data-tree-panel {
    width: 100%;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tree-spin {
    position: absolute;
    left: 40%;
    top: 50%;
  }

</style>

<style>
  .data-tree-panel .tree-loading {
    opacity: 0.5
  }

  .data-tree-panel .ivu-tree .ivu-tree-title {
    font-size: 13px;
  }

  .data-tree-panel .ivu-tree .ivu-tree-arrow {
    font-size: 14px;
  }
</style>

<template>
  <div class="data-tree-panel">
    <Tree ref="tree" :showCheckbox="showCheckbox" :data="treeData" :class="{'tree-loading': loading}" size="large"
          @on-select-change="onSelectChange" @on-check-change="onCheckChange"></Tree>
    <spin v-if="loading" size="large" class="tree-spin"></spin>
  </div>
</template>

<script>
  import utils from '@/utils/common';

  export default {
    props: {
      dataUrl: {},
      param: {},
      showCheckbox: {
        type: Boolean,
        default: false
      },
      constructTree: {
        type: Boolean,
        default: true
      },
      lastStep: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        total: 0,
        loading: false,
        treeData: [],
        mData: []
      };
    },
    methods: {
      /**
       * 获取数据
       */
      queryData (param) {
        if (this.dataUrl == null) {
          return;
        }
        this.loading = true;
        param = Object.assign(param || {}, this.param);
        this.$http.apiPost(this.dataUrl, param).then((res) => {
          this.loading = false;
          if (!res.success) {
            this.$http.handleError(res);
          } else {
            this.$emit('on-data-loaded', res.data.rows, res);
            if (this.constructTree) {
              this.treeData = utils.constructTree(res.data.rows, 'name', false, res.data.selected);
            } else {
              this.treeData = res.data.rows;
            }
            this.mData = res.data.rows;
          }
        });
      },
      onSelectChange (slected) {
        if (slected.length > 0) {
          this.$set(slected[0], 'expand', true);
          this.$emit('on-select', slected[0]);
        } else {
          this.$emit('on-select', null);
        }
      },
      onCheckChange () {

      },
      /**
       * 选中结果包含父节点
       * @param parentId
       * @param data
       */
      containParent (parentId, data) {
        if (parentId == null) {
          return;
        }
        for (let k = 0; k < this.mData.length; k++) {
          if (parentId == this.mData[k].id) {
            let exist = false;
            // 判断是否存在
            for (let j = 0; j < data.length; j++) {
              if (data[j].id == parentId) {
                exist = true;
                j = data.length;
              }
            }
            if (!exist) {
              data.push(this.mData[k]);
            }
            // 继续寻父
            if (this.mData[k].parentId != null) {
              this.containParent(this.mData[k].parentId, data);
            }
          }
        }
      },
      getCheckedNodes (containParent = false) {
        let result = this.$refs.tree.getCheckedNodes();

        if (containParent) {
          for (let i = 0; i < result.length; i++) {
            this.containParent(result[i].parentId, result);
          }
        }

        return result;
      },
      findData (valKey, val) {
        if (val == null || val.length < 0) {
          return [];
        }
        val = val.toString();
        let arr = null;
        if (val.indexOf(',') > 0) {
          arr = val.split(',');
        }
        let result = [];
        for (let i = 0; i < this.mData.length; i++) {
          if ((arr != null && arr.contains(this.mData[i][valKey])) ||
            (arr == null && this.mData[i][valKey] == val)) {
            result.push(this.mData[i]);
          }
        }
        return result;
      },
      getData () {
        return this.mData;
      },
      select (id, notSelected) {
        for (let i = 0; i < this.mData.length; i++) {
          if (this.mData[i].id == id) {
            if (this.mData[i].parentId != null) {
              this.expand(this.mData[i].parentId);
            }
            if (notSelected == null || !notSelected) {
              this.$set(this.mData[i], 'selected', true);
              this.$set(this.mData[i], 'expand', true);
              this.$emit('on-select', this.mData[i]);
            }

            return this.mData[i];
          }
        }
      },
      expand (id) {
        for (let i = 0; i < this.mData.length; i++) {
          if (this.mData[i].id == id) {
            this.$set(this.mData[i], 'expand', true);
            if (this.mData[i].parentId != null) {
              this.expand(this.mData[i].parentId);
            }
          }
        }
      }
    },
    created () {
      if (!this.lazy) {
        this.queryData();
      }
    },
    watch: {
      param: {
        handler (curVal, oldVal) {
          this.queryData();
        },
        deep: true
      },
      value: {
        handler (curVal, oldVal) {
          console.log(curVal);
        },
        deep: true
      }
    },
    components: {}
  };
</script>


