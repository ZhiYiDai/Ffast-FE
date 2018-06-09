// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import App from './App';
import routes from './routes';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from './vuex/store';
import OperatorUtils from './utils/OperatorUtils';
import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './styles/index.scss';
import config from './config';
import http from './utils/HttpUtils';
import './styles/index.less';
// import mock from './mock/index.js';

iView.Message.config({duration: 2});
iView.Notice.config({top: 55});
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(http);

window.OperatorUtils = OperatorUtils;
const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  console.log(to.path);

  if (OperatorUtils.isLogined(next)) { // 判断是否有token
    if (to.path === '/login') {
      next({path: '/'});
      NProgress.done();
    }
    else if (to.path === '/') {
      let main = OperatorUtils.getMain();
      next(main);
      NProgress.done();
    }
    else {
      next();
      NProgress.done();
    }
  } else {
    if (config.whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});


router.afterEach(transition => {
  store.dispatch('showLoading', false);
  document.title = config.name + " - " + transition.name;
  NProgress.done()
});


// 自动设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN'

Vue.config.lang = lang

// 多语言配置
const locales = Locales
const mergeZH = Object.assign(zhLocale, locales['zh-CN'])
const mergeEN = Object.assign(enLocale, locales['en-US'])
Vue.locale('zh-CN', mergeZH)
Vue.locale('en-US', mergeEN)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
