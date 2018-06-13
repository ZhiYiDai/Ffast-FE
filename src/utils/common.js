Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  }
  return fmt;
};

Array.prototype.contains = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return true;
    }
  }
  return false;
};

export default {
  /**
   * 寻父归类
   * @param data
   * @param name
   * @returns {Array}
   */
  constructTree: function (data, name, expand) {
    for (let i in data) {
      if (data[i].parentId > 0) {
        for (let j in data) {
          if (data[j].id == data[i].parentId) {
            if (data[j].children == null) {
              data[j].children = [];
            }
            data[j].children.push(data[i]);
          }
        }
      } else {
        if (expand == true) {
          data[i].expand = true;
        }
      }
    }
    // 过滤已经子类
    let result = [];
    for (let i = 0; i < data.length; i++) {
      data[i].title = data[i][name];
      if (data[i].parentId == null || data[i].parentId == 0) {
        result.push(data[i]);
      }
    }
    return result;
  },
  /**
   * 构造select可用的数据
   * @param data
   * @param name
   * @returns {Array}
   */
  constructSelect: function (data, titleName, valName) {
    for (let i = 0; i < data.length; i++) {
      let value = data[i][valName];
      let label = data[i][titleName];
      if (value != null) {
        data[i].value = value;
      } else {
        data[i].value = i;
      }
      if (label != null) {
        data[i].label = label.toString();
      }
    }
    return data;
  },
  getQueryStringByName: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    let context = '';
    if (r !== null) {
      context = r[2];
    }
    reg = null;
    r = null;
    return context === null || context === '' || context === 'undefined' ? '' : context;
  },
  cloneObj (obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
      }
    }
    return newobj;
  },
  /**
   * 时间字符串转时间对象
   * @param dateStr
   * @returns {string}
   */
  strToDate (dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    return date;
  },
  isArray (obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  },
  //  判断对象是否是字符串
  isString (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },
  /**
   * 判断是否为数字
   * @param value
   * @returns {boolean}
   */
  isNumber (value) {
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value === '') {
      return false;
    } else {
      return true;
    }
  },
  isNotChilden (rows, id) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].parentId === id) {
        return true;
      }
    }
    return false;
  },
  camelCase (value) {
    // Support: IE9-11+
    return value.replace(/_([a-z])/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }
};
