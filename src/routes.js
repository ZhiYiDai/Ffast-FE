import {Main} from 'pages/layout/';

const Err404 = resolve => require(['pages/error/404'], resolve);
const Login = resolve => require(['pages/login'], resolve);
const sysIndex = resolve => require(['pages/index/index'], resolve);

const EditPage = resolve => require(['pages/edit'], resolve);

const DictPage = resolve => require(['pages/sys/dict'], resolve);
const UserPage = resolve => require(['pages/sys/user'], resolve);
const RolePage = resolve => require(['pages/sys/role'], resolve);
const ResPage = resolve => require(['pages/sys/res'], resolve);
const SysLogPage = resolve => require(['pages/sys/sysLog'], resolve);
const RequestPage = resolve => require(['pages/sys/request'], resolve);
const AttachPage = resolve => require(['pages/sys/attach'], resolve);
const GeneratorPage = resolve => require(['pages/sys/generator'], resolve);

const BacklogPage = resolve => require(['pages/work/backlog'], resolve);

const FormDynamicPage = resolve => require(['pages/example/FormDynamicPage'], resolve);
const CrudTreeViewPage = resolve => require(['pages/example/CrudTreeViewPage'], resolve);
const CrudTablePage = resolve => require(['pages/example/CrudTablePage'], resolve);
const CrudTreePage = resolve => require(['pages/example/CrudTreePage'], resolve);
const PermsValidPage = resolve => require(['pages/example/PermsValidPage'], resolve)
const DataSelectPage = resolve => require(['pages/example/DataSelectPage'], resolve);

const routes = [
  {
    path: '/',
    component: Main,
    hidden: true,
    name: '首页',
    children: [
      {path: '/index', component: sysIndex, name: '首页'},
      {path: '/404', component: Err404, hidden: true, name: '找不到页面'},
      {path: '/*/edit', component: EditPage, name: '编辑'},
      /**
       * 系统管理
       */
      {path: '/res', component: ResPage, name: '权限菜单'},
      {path: '/role', component: RolePage, name: '角色管理'},
      {path: '/user', component: UserPage, name: '用户管理'},
      {path: '/dict', component: DictPage, name: '基础字典'},
      {path: '/sysLog', component: SysLogPage, name: '系统日志'},
      {path: '/attach', component: AttachPage, name: '附件管理'},
      {path: '/request', component: RequestPage, name: '接口测试'},
      {path: '/generator', component: GeneratorPage, name: '代码生成'},
      /**
       * 办公
       */
      {path: '/work/backlog', component: BacklogPage, name: '待办事项'},
      /**
       * 组件
       */
      {path: '/example/formDynamic', component: FormDynamicPage, name: 'FormDynamic'},
      {path: '/example/crudTreeView', component: CrudTreeViewPage, name: 'CrudTreeViewPage'},
      {path: '/example/crudTable', component: CrudTablePage, name: 'CrudTablePage'},
      {path: '/example/crudTree', component: CrudTreePage, name: 'CrudTreePage'},
      {path: '/example/permsValid', component: PermsValidPage, name: 'PermsValidPage'},
      {path: '/example/dataSelect', component: DataSelectPage, name: 'DataSelectPage'}
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {path: '*', redirect: '/404', hidden: true}
];

export default routes;
