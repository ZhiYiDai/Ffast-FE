module.exports = {
  appId: 'ffast',
  name: 'FFast',
  footerText: 'FFast',
  logo: '',
  iconFontUrl: '',
  whiteList: ['/login', '/reset'],
  apiPrefix: '/api',
  // devHost: 'http://127.0.0.1:8080',
  devHost: 'http://39.107.104.190:6060',
  pubHost: 'http://39.107.104.190:6060',
  captchaEnable: true,
  api: {
    userLogin: '/auth/login',
    userLogout: '/auth/logout',
    captcha: '/auth/captcha?',
    isLogined: '/auth/isLogined',
    dict: '/sys/dict/get?type='
  }
}
