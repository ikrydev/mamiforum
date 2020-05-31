import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/PageHome.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '@/views/PageNotFound.vue')
  },
  {
    path: '/thread/create/:id',
    name: 'ThreadCreate',
    props: true,
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "thread" */ '@/views/PageThreadCreate.vue')
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    props: true,
    component: () => import(/* webpackChunkName: "thread" */ '@/views/PageThreadShow.vue')
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    props: true,
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "thread" */ '@/views/PageThreadEdit.vue')
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    props: true,
    component: () => import(/* webpackChunkName: "forum" */ '@/views/PageForum.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    props: true,
    component: () => import(/* webpackChunkName: "category" */ '@/views/PageCategory.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    props: { edit: true },
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: { requiresGuest: true },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/PageRegister.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresGuest: true },
    component: () => import(/* webpackChunkName: "auth" */ '@/views/PageLogin.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      store.dispatch('logOut').then(() => next({ name: 'Home' }))
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(`🚦 navigate to ${to.name} from ${from.name}`)
  store.dispatch('auth/initAuthentication').then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
      if (user) next()
      else next({ name: 'Login', query: { redirectTo: to.path } })
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      if (user) next({ name: 'Home' })
      else next()
    } else {
      next()
    }
  })
})

export default router
