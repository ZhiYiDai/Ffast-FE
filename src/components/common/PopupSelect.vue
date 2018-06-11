<style scoped>

</style>

<style>
  .popup-select-modal .ivu-modal-wrap {
    z-index: 1054;
    border-radius: 10px;
    -webkit-box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.2);
  }

  .popup-select-modal .ivu-modal-body {
    padding: 0;
    height: calc(100vh - 300px);
    overflow: auto;
    border-radius: 0 0 5px 5px;
  }

  .popup-select-modal .ivu-modal-mask {
    z-index: 1053;
  }

  .popup-select-modal .popup-edit-modal .ivu-modal-wrap {
    z-index: 1056 !important;
  }

  .popup-select-modal .popup-edit-modal .ivu-modal-mask {
    z-index: 1055 !important;
  }

  .popup-select-modal .ivu-modal {
    top: 0;
  }

  .right-col {
    min-height: calc(100vh - 300px) !important;
  }
</style>

<template>
  <Modal :title="mTitle"
         v-model="visible"
         class-name="vertical-center-modal"
         class="popup-select-modal"
         ok-text="选择"
         :width="width"
         :loading="loading"
         @on-ok="ok">
    <div v-if="componentVisible">
      <component ref="view" :is="currentView" :selectMode="true"></component>
    </div>
    <div v-else>
      <Spin size="large" fix></Spin>
    </div>

  </Modal>
</template>

<script>
  export default {
    props: {
      width: {
        default: 1200
      },
      content: {},
      labelWidth: {
        default: 60
      },
      title: {
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        visible: false,
        loading: true,
        currentView: null,
        componentVisible: false,
        callBack: null
      };
    },
    computed: {
      mTitle () {
        return '选择' + this.title;
      }
    },
    created () {
      this.currentView = () => ({
        // 需要加载的组件。应当是一个 Promise
        component: this.content,
        // 渲染加载中组件前的等待时间。默认：200ms。
        delay: 200,
        // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
        timeout: 3000
      });
    },
    methods: {
      open (callBack) {
        this.visible = true;
        setTimeout(() => {
          this.componentVisible = true;
        }, 550);
        this.callBack = callBack;
      },
      show () {

      },
      close () {
        this.visible = false;
        this.componentVisible = false;
        this.callBack = null;
      },
      ok () {
        this.loading = false;
        // $refs['crudView'].
        let selection = this.$refs['view'].tableOptions.selection;
        if (selection.length > 0) {
          if (!this.multiple && selection.length > 1) {
            this.$Message.warning('只能选择单项！');
            setTimeout(() => {
              this.loading = true;
            }, 100);
            return;
          }
          this.$emit('on-selected', selection);
          this.callBack(selection);
          this.close();
        } else {
          this.$Message.warning('请先选择！');
          setTimeout(() => {
            this.loading = true;
          }, 100);
        }
      }
    }
  };
</script>
