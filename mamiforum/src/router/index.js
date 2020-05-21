import Vue from 'vue'
import VueRouter from 'vue-router'
import { threads, forums } from '@/data'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "pageNotFound" */ '@/views/PageNotFound.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "pageHome" */ '@/views/PageHome.vue')
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    props: true,
    component: () => import(/* webpackChunkName: "pageThreadShow" */ '@/views/PageThreadShow.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const thread = threads[id]
      thread ? next() : next('/404')
    }
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    props: true,
    component: () => import(/* webpackChunkName: "pageForum" */ '@/views/PageForum.vue'),
    beforeEnter: (to, from, next) => {
      const { id } = to.params
      const thread = forums[id]
      thread ? next() : next('/404')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
