/**
 * Created by dzy on 2017/12/7.
 */
import { Notice } from 'iview'
import DateUtils from 'utils/dateUtils'

const warningLevel = [
  {},
  {label: '预警', color: 'default', duration: 10},
  {label: '次要', color: 'blue', duration: 30},
  {label: '重要', color: 'yellow', duration: 120},
  {label: '严重', color: 'orange', duration: 300},
  {label: '紧急', color: 'red', duration: 600}
]

const warningUtils = {
  getWarningText (id) {
    return warningLevel[id].label
  },
  getWarningDuration (id) {
    return warningLevel[id].duration
  },
  getWarningColor (id) {
    if (id == null || warningLevel[id] == null) {
      return 'default'
    }
    return warningLevel[id].color
  },
  gotoWarning (router, warning) {
    router.push({
      path: '/warning/warning',
      name: '报警列表',
      params: {
        warning
      }
    })
  },
  openNotice (data) {
    Notice.close('warning_' + data.id);
    let warning = '<div class="ivu-tag ivu-tag-checked ivu-tag-' + warningUtils.getWarningColor(data.warningLevel) + '">' +
      '<span class="ivu-tag-text">' + warningUtils.getWarningText(data.warningLevel) + '</span></div>'
    let title = '<span style="font-weight: 200;float: right;padding-right: 10px">' +
      DateUtils.getSimpleDate(data.warningTime) + '</span> ' + warning + data.deviceName
    let desc = data.description + '<button class="ivu-btn ivu-btn-ghost ivu-btn-circle ivu-btn-small" ' +
      'style="float: right" id="warning_' + data.id + '">处理</s>'
    // 打开通知消息
    Notice.open({
      title: title,
      name: 'warning_' + data.id,
      duration: warningUtils.getWarningDuration(data.warningLevel),
      desc: desc
    })
  }
}

export default warningUtils
