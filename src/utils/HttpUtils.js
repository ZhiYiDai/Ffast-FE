import axios from 'axios';
import {Message} from 'iview';
import querystring from 'querystring';
import config from '../config';


const timeoutMsg = () => {
  Message.warning('请求超时，请检查网络')
};

const http = {
  apiGet(url, data) {
    return new Promise((resolve, reject) => {
      axios.get(url, data).then((response) => {
        resolve(response.data);
      }, (response) => {
        reject(response);
        timeoutMsg();
      });
    });
  },
  apiUpload(url, data, file) {
    return new Promise((resolve, reject) => {
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      };
      let param = new FormData(); // 创建form对象
      param.append('file', file, file.name)// 通过append向form对象添加数据
      for (let key in data) {
        param.append(key, data[key])// 通过append向form对象添加数据
      }
      axios.post(url, param, config).then((response) => {
        resolve(response.data);
      }).catch((response) => {
        console.log(response);
        resolve(response);
        timeoutMsg();
      });
    });
  },
  apiDownload(url, data, fileName) {
    return new Promise((resolve, reject) => {
      let config = {
        responseType: 'blob'
      };
      data = querystring.stringify(data);
      axios.post(url, data, config).then((response) => {
        resolve(response.data);
        console.log(response);
        const content = response.data
        const elink = document.createElement('a') // 创建a标签
        elink.download = fileName // 文件名
        elink.style.display = 'none'
        const blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click() // 触发点击a标签事件
        document.body.removeChild(elink)
      }).catch((response) => {
        console.log(response);
        resolve(response);
        timeoutMsg();
      });
    });
  },
  apiPost(url, data, config) {
    return new Promise((resolve, reject) => {
      data = querystring.stringify(data);
      axios.post(url, data, config).then((response) => {
        resolve(response.data);
      }).catch((response) => {
        console.log(response);
        resolve(response);
        timeoutMsg();
      });
    });
  },
  apiDelete(url, id) {
    return new Promise((resolve, reject) => {
      axios.delete(url + id).then((response) => {
        resolve(response.data);
      }, (response) => {
        reject(response);
        timeoutMsg();
      });
    });
  },
  apiPut(url, id, obj) {
    return new Promise((resolve, reject) => {
      axios.put(url + id, obj).then((response) => {
        resolve(response.data);
      }, (response) => {
        timeoutMsg();
        reject(response);
      });
    });
  },
  handleError(res) {
    if (res.errNo != null) {
      switch (res.errNo) {
        case 1000:
          OperatorUtils.clear();
          this.$router.push('/login');
          break;
        default:
          break;
      }
    }
    if (res.message != null && res.message != 'Network Error') {
      Message.warning(res.message)
    }
  }
}

const HttpUtils = {
  http
};

const appendHeaders = (headers) => {
  let header = {
    Authorization: OperatorUtils.getToken()
  }
  Object.assign(headers, header);
}


HttpUtils.install = function (Vue, options) {
  axios.defaults.baseURL = HOST;
  axios.defaults.timeout = 1000 * 360;
  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.withCredentials = true;

  // 请求拦截（配置发送请求的信息）
  axios.interceptors.request.use(function (config) {
    // 处理请求之前的配置
    appendHeaders(config.headers);
    return config;
  }, function (error) {
    // 请求失败的处理
    return Promise.reject(error);
  });
  Vue.prototype.$http = http;
};

export default HttpUtils;
