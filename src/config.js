module.exports = {
  appId: 'ffast',
  name: 'FFast',
  footerText: '2012-2017 © FFast',
  logo: '',
  iconFontUrl: '',
  whiteList: ['/login', '/authredirect', '/reset', '/sendpwd'],
  apiPrefix: '/api',
  devHost: 'http://127.0.0.1:8080',
  pubHost: '/zzbim-web',
  captchaEnable: true,
  api: {
    userLogin: '/auth/login',
    userLogout: '/auth/logout',
    captcha: '/auth/captcha?',
    isLogined: '/auth/isLogined',
    dict: '/sys/dict/get?type='
  }
}
