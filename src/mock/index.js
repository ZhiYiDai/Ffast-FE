import Mock from 'mockjs'
import http from '@/utils/HttpUtils'
import merge from 'lodash/merge'
import * as common from './modules/common'


// tips
// 1. 关闭[业务模块集]拦截, create方法[第2个参数]设置. (默认开启)
// 2. 关闭[业务模块对象]拦截, 通过模块返回对象中的[isOpen属性, 默认开启]设置. (默认开启)
createMock(common, true)      // 公共
/**
 * 创建mock模拟数据
 * @param {*} mods 模块集
 * @param {*} isOpen 是否开启?
 */
function createMock(mods, isOpen = true) {
  if (isOpen) {
    for (var key in mods) {
      var mod = mods[key]() || {}
      if (mod.isOpen !== false) {
        // 添加默认[mock]属性, 方便调试
        mod.data = merge({'mock': true}, mod.data)

        // 2种url拦截方式
        Mock.mock(mod.url, mod.type, mod.data)
        Mock.mock(new RegExp(mod.url, 'g'), mod.type, mod.data)
      }
    }
  }
}
