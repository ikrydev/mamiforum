import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '@/views/PageNotFound.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/PageHome.vue')
  },
  {
    path: '/thread/create/:id',
    name: 'ThreadCreate',
    props: true,
    component: () => import(/* webpackChunkName: "thread-create" */ '@/views/PageThreadCreate.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const froum = store.state.forums[id]
      froum ? next() : next('/404')
    }
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    props: true,
    component: () => import(/* webpackChunkName: "thread-show" */ '@/views/PageThreadShow.vue')
    // beforeEnter: (to, from, next) => {
    //   const { id } = to.params
    //   const thread = store.state.threads[id]
    //   thread ? next() : next('/404')
    // }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    props: true,
    component: () => import(/* webpackChunkName: "thread-edit" */ '@/views/PageThreadEdit.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const thread = store.state.threads[id]
      thread ? next() : next('/404')
    }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    props: true,
    component: () => import(/* webpackChunkName: "forum" */ '@/views/PageForum.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const forum = store.state.forums[id]
      forum ? next() : next('/404')
    }
  },
  {
    path: '/category/:id',
    name: 'Category',
    props: true,
    component: () => import(/* webpackChunkName: "category" */ '@/views/PageCategory.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const category = store.state.categories[id]
      category ? next() : next('/404')
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    props: { edit: true },
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
