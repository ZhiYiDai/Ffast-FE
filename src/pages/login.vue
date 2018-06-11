<style scoped>
  .layout {
    /*background: #f5f7f9;*/
    position: relative;
    overflow: hidden;

    width: 100%;
    height: 100%;
    background-image: url(../../static/assets/img/login_bg.jpg);
    background-size: cover;
    background-position: 50%;
  }

  .login-panel {
    top: 0;
    width: 350px;
    padding: 30px 20px 16px 20px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.4);
  }

  .captchaImage {
    float: right;
    padding: 0px 1px;
    border-radius: 4px 4px 4px 4px;
    height: 28px;
    position: absolute;
    right: 1px;
    top: 3px;
  }

  .captchaImage:hover {
    cursor: pointer;
  }

  .login-title {
    text-align: center;
  }

  .layout-footer {
    position: fixed;
    bottom: 0px;
    text-align: center;
    color: #9ea7b4;
    width: 100%
  }

  .layout-login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
  }

  .layout-logo {
    height: 60px;
    background: url("../../static/assets/img/logo2.png") no-repeat center;
  }

</style>

<style>
  .login-panel .ivu-btn-primary {
    color: #fff;
    background-color: #222;
    border-color: #111;
  }

  .login-panel .ivu-btn-primary:hover {
    color: #fff;
    background-color: #444;
    border-color: #333;
  }
</style>

<template>
  <div class="layout">
    <div class="layout-login">
      <div class="login-panel">
        <i-form ref="formLogin" :model="formLogin" :rules="ruleInline">
          <FormItem class="login-title">

            <div class="layout-logo"></div>
          </FormItem>

          <FormItem prop="username">
            <i-input v-model="formLogin.username" type="text" placeholder="用户名" style="width: 100%"></i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input v-model="formLogin.password" type="password" placeholder="密码" style="width: 100%"></i-input>
          </FormItem>

          <FormItem v-if="captchaEnable" prop="captcha" class="captchaItem">
            <i-input v-model="formLogin.captcha" type="text" @change="toUpperCase(val)" :maxlength="4" placeholder="验证码"
                     style="width: 100%;">
              <!--<span slot="append"></span>-->
            </i-input>
            <img class="captchaImage" :src="captchaUrl" @click="changeCaptcha()" title="点击更换验证码">
          </FormItem>
          <FormItem>
            <i-button type="primary" style="width: 100%" @click="handleSubmit('formLogin')" long :loading="loading">
              登 录
            </i-button>
          </FormItem>
          <div style="padding: 0px 8px;">
            Username:<b>admin</b> Password:<b>123456</b>
            <router-link style="float: right;" to="/">忘记密码</router-link>
          </div>
        </i-form>
      </div>
    </div>
    <div class="layout-footer">{{footerText}}</div>

  </div>
</template>
<script>
  import config from '@/config';
  import http from '../utils/HttpUtils';

  export default {
    data () {
      return {
        captchaUrl: this.captchaUrl = HOST + config.api.captcha + new Date().getTime(),
        captchaEnable: config.captchaEnable,
        loading: false,
        footerText: config.footerText,
        formLogin: {
          username: '',
          password: '',
          captcha: ''
        },
        ruleInline: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请填写验证码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {},
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              username: this.formLogin.username,
              password: this.formLogin.password,
              captcha: this.formLogin.captcha
            };
            this.loading = true;
            this.$http.apiPost(config.api.userLogin, data).then((res) => {
              this.loading = false;
              if (!res.success) {
                this.$http.handleError(res);
                this.changeCaptcha();
              } else {
                console.log(res);
                this.$Message.success('登录成功');
                OperatorUtils.setBaseData(res.data);
                this.$router.push({path: '/'});
//                this.$store.dispatch('setUser', res.data.userData);
              }
            });
          } else {
            this.$Message.error('请填写正确再提交!');
          }
        });
      },
      changeCaptcha () {
        this.formLogin.captcha = '';
        this.captchaUrl = HOST + config.api.captcha + new Date().getTime();
      },
      toUpperCase (val) {
        console.log(val);
      }
    },
    mounted () {
      window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          this.handleSubmit('formLogin');
        }
      });
    },
    components: {}
  };
</script>
