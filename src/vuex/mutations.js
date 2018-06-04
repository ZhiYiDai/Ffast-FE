import http from 'utils/HttpUtils'
import DateUtils from 'utils/DateUtils'

const mutations = {
  showLeftMenu (state, status) {
    state.showLeftMenu = status
  },
  setMenus (state, menus) {
    state.menus = menus
  },
  setUser (state, user) {
    state.user = user
  },
  showLoading  (state, status) {
    state.showLoading = status
  },
  addRemind (state, obj) {
    if (state.remind[obj.key] == null) {
      state.remind[obj.key] = []
    }
    state.remind[obj.key].push(obj.id)
  },
  removeRemind (state, key) {
    state.remind[key] = null
  },
  queryWarningData (state, callback) {
    let params = {
      warningStatusArray: [0],
      warningStartDate: null,
      warningEndDate: null,
      sortField: 'id',
      sortOrder: 'asc'
    }
    http.http.apiPost('/warning/warning/list', params).then((res) => {
      if (!res.success) {
        // http.http.handleError(res)
      } else {
        let data = res.data.rows
        state.warning = data
        callback(data)
      }
    })
  },
  queryBacklogData (state, callback) {
    let params = {
      afterDate: DateUtils.getDateAmount(new Date(), -1).format('yyyy-MM-dd'),
      pageSize: 4,
      page: 1,
      status: 0
    }
    http.http.apiPost('/work/backlog/list', params).then((res) => {
      if (!res.success) {
        // http.http.handleError(res)
      } else {
        let data = res.data.rows
        state.backlog = data
        callback(data)
      }
    })
  }
}

export default mutations
