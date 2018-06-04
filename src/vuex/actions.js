const actions = {
  showLeftMenu ({commit}, status) {
    commit('showLeftMenu', status)
  },
  showLoading ({commit}, status) {
    commit('showLoading', status)
  },
  setMenus ({commit}, menus) {
    commit('setMenus', menus)
  },
  setUser ({commit}, user) {
    commit('setUser', user)
  },
  queryWarningData ({commit}, callback) {
    commit('queryWarningData', callback)
  },
  queryBacklogData ({commit}, callback) {
    commit('queryBacklogData', callback)
  },
  addRemind ({commit}, obj) {
    commit('addRemind', obj)
  },
  removeRemind ({commit}, key) {
    commit('removeRemind', key)
  },
  addWarningRemind ({commit}, id) {
    commit('addWarningRemind', id)
  },
  setBacklog ({commit}, backlog) {
    commit('setBacklog', backlog)
  }
}

export default actions
