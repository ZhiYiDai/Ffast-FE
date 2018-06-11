<style scoped>
</style>

<style>
  .popup-edit-modal .ivu-modal-wrap {
    z-index: 1051;
    border-radius: 10px;
    -webkit-box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.2);
  }

  .popup-edit-modal .ivu-modal-body {
    max-height: calc(100vh - 200px);
    overflow: auto;
  }

  .popup-edit-modal .ivu-modal-mask {
    z-index: 1050;
  }

  .popup-edit-modal .ivu-modal {
    top: 0;
  }

</style>

<template>
  <Modal :title="title"
         v-model="visible"
         class-name="vertical-center-modal"
         class="popup-edit-modal"
         :okText="okText"
         :width="width"
         :loading="loading"
         @on-ok="ok">
    <FormDynamic :data="dynamic"
                 ref="dataFrom"
                 v-if="popupOpened"
                 :label-width="labelWidth">
    </FormDynamic>
    <slot name="append">
    </slot>
    <div slot="footer">
      <Button type="primary" size="large" :loading="loading" @click="ok">{{okText}}</Button>
    </div>
  </Modal>
</template>

<script>
  import {FormDynamic} from 'components/';

  export default {
    props: {
      okText: {
        default: '确定'
      },
      width: {
        default: 580
      },
      dynamic: {},
      labelWidth: {
        default: 60
      },
      postCloseModal: {
        default: true
      }
    },
    data () {
      return {
        visible: false,
        loading: false,
        defaultVal: null,
        title: '',
        popupOpened: false,
        submitCallBack: null,
        submitBeforeCallBack: null
      };
    },
    created () {
    },
    mounted () {
    },
    methods: {
      open (options, fromData) {
        this.show();
        this.title = options.title;
        this.postUrl = options.postUrl;
        if (this.popupOpened) {
          this.$refs.dataFrom.setFormData(fromData);
          this.$emit('on-setfrom-after', this.dynamic, this.$refs.dataFrom.getData());
        } else {
          this.popupOpened = true;
          this.$nextTick(() => {
            this.$refs.dataFrom.setFormData(fromData);
            this.$emit('on-setfrom-after', this.dynamic, this.$refs.dataFrom.getData());
          });
        }
      },
      show () {
        this.visible = true;
        this.$nextTick(() => {
          this.$emit('on-opened', this.dynamic, this.$refs.dataFrom.getData());
        });
      },
      close () {
        this.visible = false;
      },
      getFromData () {
        return this.$refs.dataFrom.getData();
      },
      setFromData (fromData) {
        let data = this.$refs.dataFrom.getData();
        for (let key in fromData) {
          this.$set(data, key, fromData[key]);
        }
      },
      setSubmitCallBack (submitCallBack) {
        this.submitCallBack = submitCallBack;
      },
      setSubmitBeforeCallBack (submitCallBack) {
        this.submitBeforeCallBack = submitCallBack;
      },
      ok () {
        this.$refs.dataFrom.submit((param) => {
          // console.log(param);
          if (this.submitBeforeCallBack) {
            if (!this.submitBeforeCallBack(param)) {
              return;
            }
          }
          this.$emit('on-submit-before', param);
          // 发送请求
          if (this.postUrl !== null) {
            this.loading = true;
            this.$http.apiPost(this.postUrl, param).then((res) => {
              this.loading = false;
              if (!res.success) {
                this.$http.handleError(res);
              } else {
                this.$Message.success('提交成功');
                if (res.data.id != null) {
                  param.id = res.data.id;
                }
                this.$emit('on-success', res, param);
                if (this.postCloseModal) {
                  this.close();
                }
              }
              if (this.submitCallBack) {
                this.submitCallBack(res, param);
              }
            });
          }
        }, (res) => {
          // 表单验证失败
          this.$Message.error('请填写正确再提交！');
        });
      }
    },
    components: {
      FormDynamic
    }
  };
</script>
