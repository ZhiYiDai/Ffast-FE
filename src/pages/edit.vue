<style rel="stylesheet/scss" lang="scss" scoped>
  .edit-row {
    padding-bottom: 45px;
  }
</style>

<template>
  <div class="main-view main-view-full" style="padding-top: 20px">
    <row style="height: 80px">
      <Button type="text" icon='chevron-left' @click='back'>返 回</Button>
    </row>
    <row class="edit-row" type="flex" justify="center">
      <i-col span="22">

        <formDynamic ref="dynamicForm" :data="options.dynamic" :label-width="options.labelWidth">
        </formDynamic>

        <div :style="{marginLeft: options.labelWidth+'px'}">
          <i-button type='primary' icon='folder' @click='ok' :loading="loading">
            保 存
          </i-button>
        </div>

      </i-col>
    </row>

  </div>
</template>

<script>
  import {FormDynamic, PermsValid, CrudView} from 'components/';

  export default {
    props: {},
    data () {
      return {
        options: {},
        action: {},
        data: {},
        loading: false
      };
    },
    computed: {},
    methods: {
      ok () {
        this.$refs.dynamicForm.submit((param) => {
          console.log(param);
          debugger;
          if (this.options.submitBeforeCallBack) {
            if (!this.options.submitBeforeCallBack(param)) {
              return;
            }
          }
          if (this.options.submitBefore) {
            this.options.submitBefore(param);
          }
          // 发送请求
          if (this.action.postUrl !== null) {
            this.loading = true;
            this.$http.apiPost(this.action.postUrl, param).then((res) => {
              this.loading = false;
              if (!res.success) {
                this.$http.handleError(res);
              } else {
                this.$Message.success('提交成功');
                if (res.data.id != null) {
                  param.id = res.data.id;
                }
                if (this.options.editSuccess != null) {
                  this.options.editSuccess();
                }
                if (this.options.successBack == null || this.options.successBack) {
                  this.$router.go(-1);
                }
              }
            });
          }
        }, (res) => {
          // 表单验证失败
        });
      },
      back () {
        this.$router.go(-1);
      }
    },
    mounted () {

    },
    activated () {
      this.options = this.$route.query.options;
      this.action = this.$route.query.action;
      this.data = this.$route.query.data;
      console.log(this.$route);
      console.log(this.options);
      console.log(this.data);
      this.$nextTick(() => {
        this.$refs['dynamicForm'].setFormData(this.data);
      });
    },
    components: {CrudView, FormDynamic, PermsValid}
  };
</script>
