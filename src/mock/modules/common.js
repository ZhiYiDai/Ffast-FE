const loginData = {
  'success': true,
  'data': {
    'menuData': [{'id': 17, 'name': '用户管理', 'icon': '', 'url': '/user', 'parentId': 1}, {
      'id': 1,
      'name': '系统管理',
      'icon': 'gear-b',
      'url': ''
    }, {'id': 2, 'name': '权限菜单', 'icon': '', 'url': '/res', 'parentId': 1}, {
      'id': 12,
      'name': '角色管理',
      'icon': '',
      'url': '/role',
      'parentId': 1
    }, {'id': 7, 'name': '基础字典', 'icon': '', 'url': '/dict', 'parentId': 1}, {
      'id': 22,
      'name': '系统日志',
      'url': '/sysLog',
      'parentId': 1
    }, {'id': 27, 'name': '接口测试', 'url': '/request', 'parentId': 1}, {
      'id': 231,
      'name': '代码生成',
      'icon': '',
      'url': '/generator',
      'parentId': 1
    }, {'id': 28, 'name': '附件管理', 'url': '/attach', 'parentId': 1}],
    'userData': {'roleName': '[超级管理员]', 'main': '[null]', 'userName': 'admin'},
    'permsData': ['user:list', 'dict:create', 'user:delete', 'role:update', 'res:list', 'sysLog:list',
      'sysLog:update', 'res:update', 'user:update', 'dict:delete', 'sysLog:create', 'res:delete',
      'user:create', 'dict:update', 'role:create', 'dict:list', 'role:list', 'role:delete',
      'res:create', 'sysLog:delete'],
    'token': 'bb05bbea76b91863cb2d06eae40c7bac'
  }
}

// 登录
export function login() {
  return {
    url: '/auth/login',
    type: 'post',
    data: loginData
  }
}

// 退出
export function logout() {
  return {
    url: '/auth/logout',
    type: 'post',
    data: {
      'msg': 'success',
      'success': true
    }
  }
}
