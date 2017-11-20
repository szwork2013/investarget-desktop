import { i18n } from "./utils/util";

export const PATH_LIST = [
  {
    key: 'home',
    name: i18n('common.home'),
    path: '/app',
    realpath: '/',
    parent: null
  },
  {
    key: 'dashboard',
    name: i18n('menu.dashboard'),
    path: '/app',
    realpath: '/app',
    parent: 'home'
  },
  {
    key: 'project_library',
    name: i18n('menu.project_library'),
    path: '/app/projects/library',
    realpath: '/app/projects/library',
    parent: 'home'
  },
  {
    key: 'project_library_detail',
    name: i18n('project.project_detail'), // todo
    path: /^\/app\/projects\/library\/(\d+)$/,
    realpath: /^\/app\/projects\/library\/(\d+)$/,
    parent: 'project_library',
  },
  {
    key: 'project_management',
    name: i18n('menu.project_management'),
    path: '/app/projects/list',
    realpath: null,
    parent: 'home'
  },
  {
    key: 'platform_projects',
    name: i18n('menu.platform_projects'),
    path: '/app/projects/list',
    realpath: '/app/projects/list',
    parent: 'project_management',
  },
  {
    key: 'project_detail',
    name: i18n('project.details'),
    path: /^\/app\/projects\/(\d+)$/,
    realpath: /^\/app\/projects\/(\d+)$/,
    parent: 'project_management',
  },
  {
    key: 'recommend_project',
    name: i18n('project.recommended_projects'),
    path: /^\/app\/projects\/recommend\/(\d+)$/,
    realpath: /^\/app\/projects\/recommend\/(\d+)$/,
    parent: 'platform_projects',
  },
  {
    key: 'upload_project',
    name: i18n('project.upload_project'),
    path: '/app/projects/add',
    realpath: '/app/projects/add',
    parent: 'platform_projects',
  },
  {
    key: 'edit_project',
    name: i18n('project.edit_project'),
    path: /^\/app\/projects\/edit\/(\d+)$/,
    realpath: /^\/app\/projects\/edit\/(\d+)$/,
    parent: 'platform_projects',
  },
  {
    key: 'upload_marketplace',
    name: i18n('project.upload_marketplace'),
    path: '/app/marketplace/add',
    realpath: '/app/marketplace/add',
    parent: 'platform_projects',
  },
  {
    key: 'edit_marketplace',
    name: i18n('project.edit_marketplace'),
    path: /^\/app\/marketplace\/edit\/(\d+)$/,
    realpath: /^\/app\/marketplace\/edit\/(\d+)$/,
    parent: 'platform_projects',
  },
  {
    key: 'marketplace_detail',
    name: i18n('project.marketplace_detail'),
    path: /^\/app\/marketplace\/(\d+)$/,
    realpath: /^\/app\/marketplace\/(\d+)$/,
    parent: 'platform_projects',
  },
  {
    key: 'interested_projects',
    name: i18n('project.interested_projects'),
    path: '/app/projects/list/interest',
    realpath: '/app/projects/list/interest',
    parent: 'platform_projects',
  },
  {
    key: 'recommended_projects',
    name: i18n('project.recommon_projects'),
    path: '/app/projects/list/recommend',
    realpath: '/app/projects/list/recommend',
    parent: 'platform_projects',
  },
  {
    key: 'published_projects',
    name: i18n('project.published_projects'),
    path: '/app/projects/list/published',
    realpath: '/app/projects/list/published',
    parent: 'platform_projects',
  },
  {
    key: 'favorite_projects',
    name: i18n('project.favorite_projects'),
    path: '/app/projects/list/favor',
    realpath: '/app/projects/list/favor',
    parent: 'platform_projects',
  },
  {
    key: 'bd_management',
    name: i18n('menu.bd_management'),
    path: '/app/organization/list',
    realpath: null,
    parent: 'home',
  },
  {
    key: 'organization_bd',
    name: i18n('menu.organization_bd'),
    path: '/app/organization/list',
    realpath: '/app/organization/list',
    parent: 'bd_management',
  },
  {
    key: 'organization_detail',
    name: i18n('organization.org_detail'),
    path: /^\/app\/organization\/(\d+)$/,
    realpath: /^\/app\/organization\/(\d+)$/,
    parent: 'organization_bd',
  },
  {
    key: 'organization_investors',
    name: i18n('user.org_investors'),
    path: '/app/orguser/list',
    realpath: '/app/orguser/list',
    parent: 'organization_bd', // todo ?
  },
  {
    key: 'organization_select_investor',
    name: i18n('user.select_investor'),
    path: '/app/organization/selectuser',
    realpath: '/app/organization/selectuser',
    parent: 'organization_bd',
  },
  {
    key: 'add_organization',
    name: i18n('organization.new_org'),
    path: '/app/organization/add',
    realpath: '/app/organization/add',
    parent: 'organization_bd',
  },
  {
    key: 'edit_organization',
    name: i18n('organization.edit_org'),
    path: /^\/app\/organization\/edit\/(\d+)$/,
    realpath: /^\/app\/organization\/edit\/(\d+)$/,
    parent: 'organization_bd',
  },
  {
    key: 'project_bd',
    name: i18n('menu.project_bd'),
    path: '/app/projects/bd',
    realpath: '/app/projects/bd',
    parent: 'bd_management',
  },
  {
    key: 'add_project_bd',
    name: i18n('project_bd.add_project_bd'),
    path: '/app/projects/bd/add',
    realpath: '/app/projects/bd/add',
    parent: 'project_bd',
  },
  {
    key: 'edit_project_bd',
    name: i18n('project_bd.edit_project_bd'),
    path: /^\/app\/projects\/bd\/edit\/(\d+)$/,
    realpath: /^\/app\/projects\/bd\/edit\/(\d+)$/,
    parent: 'project_bd',
  },
  {
    key: 'email_management',
    name: i18n('menu.email_management'),
    path: '/app/email/list',
    realpath: '/app/email/list',
    parent: 'home',
  },
  {
    key: 'email_detail',
    name: i18n('email.investors'),
    path: /^\/app\/email\/detail\/(\d+)$/,
    realpath: /^\/app\/email\/detail\/(\d+)$/,
    parent: 'email_management',
  },
  {
    key: 'schedule_management',
    name: i18n('menu.schedule_management'),
    path: '/app/schedule/list', // TODO 默认指向
    realpath: null,
    parent: 'home',
  },
  {
    key: 'schedule_list',
    name: i18n('menu.schedule_list'),
    path: '/app/schedule/list',
    realpath: '/app/schedule/list',
    parent: 'schedule_management',
  },
  {
    key: 'my_schedule',
    name: i18n('menu.my_schedule'),
    path: '/app/schedule',
    realpath: '/app/schedule',
    parent: 'schedule_management',
  },
  {
    key: 'user_management',
    name: i18n('menu.user_management'),
    path: '/app/user/list',
    realpath: '/app/user/list',
    parent: 'home',
  },
  {
    key: 'user_detail',
    name: i18n('user.user_detail'),
    path: /^\/app\/user\/(\d+)$/,
    realpath: /^\/app\/user\/(\d+)$/,
    parent: 'user_management',
  },
  {
    key: 'add_user',
    name: i18n('user.add_user'),
    path: '/app/user/add',
    realpath: '/app/user/add',
    parent: 'user_management',
  },
  {
    key: 'edit_user',
    name: i18n('user.edit_user'),
    path: '/app/user/edit',
    realpath: '/app/user/edit',
    parent: 'user_management',
  },
  {
    key: 'myinvestor',
    name: i18n('menu.myinvestor'),
    path: '/app/investor/my',
    realpath: '/app/investor/my',
    parent: 'home',
  },
  {
    key: 'mytrader',
    name: i18n('menu.mytrader'),
    path: '/app/trader/my',
    realpath: '/app/trader/my',
    parent: 'home',
  },
  {
    key: 'add_trader',
    name: i18n('user.select_trader'),
    path: '/app/trader/add',
    realpath: '/app/trader/add',
    parent: 'mytrader',
  },
  {
    key: 'timeline_management',
    name: i18n('menu.timeline_management'),
    path: '/app/timeline/list',
    realpath: null,
    parent: 'home',
  },
  {
    key: 'timeline_detail',
    name: i18n('timeline.timeline_detail'),
    path: /^\/app\/timeline\/(\d+)$/,
    realpath: /^\/app\/timeline\/(\d+)$/,
    parent: 'timeline_management',
  },
  {
    key: 'add_timeline',
    name: i18n('timeline.add_timeline'),
    path: '/app/timeline/add',
    realpath: '/app/timeline/add',
    parent: 'timeline_management',
  },
  {
    key: 'edit_timeline',
    name: i18n('timeline.edit_timeline'),
    path: /^\/app\/timeline\/edit\/(\d+)$/,
    realpath: /^\/app\/timeline\/edit\/(\d+)$/,
    parent: 'timeline_management',
  },
  {
    key: 'dataroom_management',
    name: i18n('menu.dataroom_management'),
    path: '/app/dataroom/list',
    realpath: '/app/dataroom/list',
    parent: 'home',
  },
  {
    key: 'dataroom',
    name: i18n('dataroom.dataroom'),
    path: '/app/dataroom/detail',
    realpath: '/app/dataroom/detail',
    parent: 'dataroom_management',
  },
  {
    key: 'add_dataroom',
    name: i18n('project.create_dataroom'),
    path: '/app/dataroom/add',
    realpath: '/app/dataroom/add',
    parent: 'dataroom_management',
  },
  {
    key: 'inbox_management',
    name: i18n('menu.inbox_management'),
    path: '/app/inbox/list',
    realpath: null,
    parent: 'home',
  },
  {
    key: 'message_list',
    name: i18n('inbox.message_list'),
    path: '/app/inbox/list',
    realpath: '/app/inbox/list',
    parent: 'inbox_management',
  },
  {
    key: 'user_center',
    name: i18n('menu.user_center'),
    path: '/app/personal_info', // TODO 默认指向
    realpath: null,
    parent: 'home',
  },
  {
    key: 'change_password',
    name: i18n('menu.change_password'),
    path: '/app/modify_password',
    realpath: '/app/modify_password',
    parent: 'user_center',
  },
  {
    key: 'profile',
    name: i18n('menu.profile'),
    path: '/app/personal_info',
    realpath: '/app/personal_info',
    parent: 'user_center',
  },
  {
    key: 'permission_management',
    name: i18n('menu.permission_management'),
    path: '/app/perm/list',
    realpath: '/app/perm/list',
    parent: 'home',
  },
  {
    key: 'log',
    name: i18n('menu.log'),
    path: '/app/log/list',
    realpath: '/app/log/list',
    parent: 'home',
  },
  {
    key: 'market_news',
    name: i18n('market_news'),
    path: '/app/wxmsg',
    realpath: '/app/wxmsg',
    parent: 'home',
  },
]
