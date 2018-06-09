import Lockr from 'lockr';
import config from '../config';
import http from './HttpUtils';
import axios from "axios/index";

const prefix = config.appId + '_';
let isPost = false;
let routerPush = null;

const OperatorUtils = {
  userData: null,
  menuData: null,
  permsData: null,
  token: null,
  main: null,
  postLogined() {
    if (!isPost) {
      isPost = true;
      http.http.apiPost(config.api.isLogined).then((res) => {
        if (!res.success) {
          OperatorUtils.clear();
          routerPush('/login');
        }
      });
    }
  },
  isLogined(router) {
    routerPush = router;
    this.postLogined();
    return Lockr.get(prefix + 'token') ? true : false
  },
  setBaseData(data) {
    Lockr.set(prefix + 'token', data.token);
    Lockr.set(prefix + 'userData', data.userData);
    Lockr.set(prefix + 'menuData', data.menuData);
    Lockr.set(prefix + 'permsData', data.permsData);
    this.userData = null;
    this.menuData = null;
    this.permsData = null;
    this.token = null;
  },
  clear() {
    Lockr.set(prefix + 'token', null)
    Lockr.set(prefix + 'userData', null)
    Lockr.set(prefix + 'menuData', null)
    Lockr.set(prefix + 'permsData', null)
    this.userData = null
    this.menuData = null
    this.permsData = null
    this.token = null
    this.main = null
  },
  getUserData() {
    return this.userData || Lockr.get(prefix + 'userData')
  },
  getMenuData() {
    return this.menuData || Lockr.get(prefix + 'menuData')
  },
  getPermsData() {
    return this.permsData || Lockr.get(prefix + 'permsData')
  },
  getToken() {
    return this.token || Lockr.get(prefix + 'token')
  },
  getMain() {
    if (this.main === null) {
      let main = JSON.parse(this.getUserData().main);
      if (main === null || main.length === 0 || main[0] === null) {
        this.main = '/index';
      } else {
        this.main = main[0];
      }
    }

    return this.main;
  }
}

export default OperatorUtils

