const nowDate = new Date() // 当前日期
const lastMonthDate = new Date() // 上月日期
lastMonthDate.setDate(1)
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
const DateUtils = {
  now: {
    nowDayOfWeek: nowDate.getDay() - 1, //今天本周的第几天
    nowDay: nowDate.getDate(), // 当前日
    nowMonth: nowDate.getMonth(), // 当前月
    nowYear: nowDate.getYear(), // 当前年
    lastYear: lastMonthDate.getYear(),
    lastMonth: lastMonthDate.getMonth(),
    date: nowDate
  },
  /**
   * 获取现在时间戳
   * @param dateStr
   * @returns {string}
   */
  getLocalTime(nS, formatStr){
    return new Date(parseInt(nS) * 1000).format(formatStr)
  },
  /**
   * 时间对象转时间戳
   * @param dateStr
   * @returns {string}
   */
  get_unix_time (dateStr) {
    let date = DateUtils.strToDate(dateStr)
    let time_str = date.getTime().toString()
    return time_str.substr(0, 10)
  },
  /**
   * 时间字符串转时间对象
   * @param dateStr
   * @returns {string}
   */
  strToDate (dateStr) {
    let newstr = dateStr.replace(/-/g, '/')
    let date = new Date(newstr)
    return date
  },
  formatNum (str) {
    return str.replace(/[^\d.]/g, '')
  },
  /**
   * 获取中文周几
   * @param day
   * @returns {*}
   */
  getWeek (day) {
    let weekArr = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')
    return weekArr[day.getDay()]
  },
  /**
   * 获得某月的天数
   */
  getMonthDays (myYear, myMonth) {
    if (myMonth === 2) {
      return myYear % 4 === 0 ? 29 : 28
    } else if (myMonth === 1 || myMonth === 3 || myMonth === 5 ||
      myMonth === 7 || myMonth === 8 || myMonth === 10 || myMonth === 12) {
      return 31
    } else {
      return 30
    }
  },
  /**
   * 获得本季度的开始月份
   */
  getQuarterStartMonth () {
    let quarterStartMonth = 0
    let nowMonth = DateUtils.now.nowMonth
    if (nowMonth < 3) {
      quarterStartMonth = 0
    }
    if (2 < nowMonth && nowMonth < 6) {
      quarterStartMonth = 3
    }
    if (5 < nowMonth && nowMonth < 9) {
      quarterStartMonth = 6
    }
    if (nowMonth > 8) {
      quarterStartMonth = 9
    }
    return quarterStartMonth
  },
  /**
   * 获得本周的开始日期
   */
  getWeekStartDate () {
    let weekStartDate = new Date(DateUtils.now.nowYear, DateUtils.now.nowMonth, DateUtils.now.nowDay - DateUtils.now.nowDayOfWeek)
    return weekStartDate
  },
  /**
   * 获得本周的结束日期
   */
  getWeekEndDate () {
    let weekEndDate = new Date(DateUtils.now.nowYear, DateUtils.now.nowMonth, DateUtils.now.nowDay + (6 - DateUtils.now.nowDayOfWeek))
    return weekEndDate
  },
  /**
   * 获得本月的开始日期
   */
  getMonthStartDate (year, month) {
    let myYear = year || DateUtils.now.nowYear
    let myMonth = month == null ? DateUtils.now.nowMonth : month - 1
    let monthStartDate = new Date(myYear, myMonth, 1)
    return monthStartDate
  },
  /**
   * 获得本月的结束日期
   */
  getMonthEndDate  (year, month) {
    let myYear = year || DateUtils.now.nowYear
    let myMonth = month == null ? DateUtils.now.nowMonth : month - 1
    let monthEndDate = new Date(myYear, myMonth, DateUtils.getMonthDays(myYear, myMonth + 1))
    return monthEndDate
  },
  /**
   * 获得上月开始时间
   */
  getLastMonthStartDate  () {
    let lastMonthStartDate = new Date(DateUtils.now.nowYear, DateUtils.now.lastMonth, 1)
    return lastMonthStartDate
  },
  /**
   * 获得上月结束时间
   */
  getLastMonthEndDate  () {
    let lastMonthEndDate = new Date(DateUtils.now.nowYear, DateUtils.now.lastMonth, DateUtils.getMonthDays(DateUtils.now.nowYear, DateUtils.now.lastMonth))
    return lastMonthEndDate
  },
  /**
   *  获得本季度的开始日期
   */
  getQuarterStartDate  () {

    let quarterStartDate = new Date(DateUtils.now.nowYear, DateUtils.getQuarterStartMonth(), 1)
    return quarterStartDate
  },
  /**
   *获得本季度的结束日期
   */
  getQuarterEndDate  () {
    let quarterEndMonth = DateUtils.getQuarterStartMonth() + 2
    let quarterStartDate = new Date(DateUtils.now.nowYear, quarterEndMonth, DateUtils.getMonthDays(DateUtils.now.nowYear, quarterEndMonth + 1))
    return quarterStartDate
  },
  /**
   * amount加减数获取时间
   * @param date 日期
   * @param amount 加减数
   * @return
   */
  getDateAmount  (date, amount) {
    return new Date(date.getTime() + (amount * 24 * 60 * 60 * 1000))
  },
  /**
   * 格式化简单时间
   * @param date
   * @returns {string}
   */
  getSimpleDate (date) {
    let d = DateUtils.strToDate(date)
    let time = parseInt(d.getTime().toString())
    let now = new Date()
    let nowTime = now.getTime()
    let jl = (nowTime - time) / 1000
    let result = ''
    if (jl < 60) {
      result = Math.floor(jl) + '秒前'
    } else if (jl / 60 <= 60) {
      result = Math.floor(jl / 60) + '分钟前'
    } else if (jl / 60 / 60 <= 2) {
      result = Math.floor(jl / 60 / 60) + '小时' + Math.floor((jl / 60 % 60)) + '分钟前'
    } else if (now.getDate() == d.getDate()) {
      result = '今天 ' + d.format('hh:mm')
    } else if (now.format('yyyy-MM-dd') == DateUtils.getDateAmount(d, +1).format('yyyy-MM-dd')) {
      result = '昨天 ' + d.format('hh:mm')
    } else {
      result = d.format('MM月dd日 hh:mm')
    }
    result = result.replace(' 00:00', '')
    return result
  },

  /**
   * 格式化简单时间
   * @param date
   * @returns {string}
   */
  getSimpleDate2 (date) {
    let d = DateUtils.strToDate(date)
    let now = new Date()
    let result = ''
    if (now.getDate() == d.getDate()) {
      result = '今天 ' + d.format('hh:mm')
    } else if (now.format('yyyy-MM-dd') == DateUtils.getDateAmount(d, +1).format('yyyy-MM-dd')) {
      result = '昨天 ' + d.format('hh:mm')
    } else if (now.format('yyyy-MM-dd') == DateUtils.getDateAmount(d, -1).format('yyyy-MM-dd')) {
      result = '明天 ' + d.format('hh:mm')
    } else {
      result = d.format('MM月dd日 hh:mm')
    }
    result = result.replace(' 00:00', '')
    return result
  }
}
/**
 * 时间对象的格式化;
 */
Date.prototype.format = function (format) {
  /*
   * eg:format="YYYY-MM-dd hh:mm:ss";
   */
  let o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds()
    // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '')
      .substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
DateUtils.now.nowYear += (DateUtils.now.nowYear < 2000) ? 1900 : 0
export default DateUtils

