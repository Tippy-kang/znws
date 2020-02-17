import Vue from 'vue'
import Router from 'vue-router'

const routerIndex = () =>
  import('@/components/index.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: '登录',
      meta:{title: '登录' },
      path: '/login',
      component: () =>import('@/components/login.vue') //登录
    },
    {
      path: '/',
      name: '系统管理',
      meta:{title: '系统管理'},
      component: routerIndex,
      children: [
        {
          name: '系统版本',
          meta:{title: '系统版本'},
          path: '/systemVersion',
          component: () =>import("../views/basic/sysManager/systemVersion") //系统版本
        },
        {
          name: '菜单管理',
          meta:{title: '菜单管理'},
          path: '/menuManager',
          component: () =>import("../views/basic/sysManager/menuManager") //菜单管理
        },
        {
          name: '角色管理',
          meta:{title: '角色管理'},
          path: '/roleManager',
          component: () =>import("../views/basic/sysManager/roleManager") //角色管理
        },
        {
          name:'用户管理',
          meta:{title: '用户管理'},
          path:'/examUser',
          component: () =>import("../views/basic/sysManager/userManager") //考核用户
        },
        {
          name: '模块配置',
          meta:{title: '模块配置'},
          path: '/modelAllocation',
          component: () => import('@/views/basic/sysManager/modelAllocation/index.vue') //模块配置
        },
        {
          name: '日志管理',
          meta:{title: '日志管理'},
          path: '/logManager',
          component: () =>import("../views/basic/sysManager/logManager") //日志管理
        },
        {
          name: '意见反馈',
          meta:{title: '意见反馈'},
          path: '/feedback',
          component: () =>import("../views/basic/sysManager/feedback/index.vue") //日志管理
        },
        {
          name: '用户协议',
          meta:{title: '用户协议'},
          path: '/useragreement',
          component: () =>import("../views/basic/sysManager/useragreement/index.vue") //日志管理
        },
        {
          name: '404',
          meta:{title: '404页面'},
          path: '/404',
          component: () =>import('../components/NotFound.vue') //找不到页面
        },
        {
          name: '首页',
          meta:{title: '首页'},
          path: '/index',
          component: () =>import('../components/home.vue') //首页
        }
      ]
    },
    
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
