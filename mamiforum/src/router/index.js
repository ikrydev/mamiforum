import Vue from 'vue'
import VueRouter from 'vue-router'
import sourceData from '@/data'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    alias: '/404',
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
      const thread = sourceData.threads[id]
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
