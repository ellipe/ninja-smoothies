import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/Index.vue'
import AddSmoothie from '@/components/AddSmoothie.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/add-smoothie',
    name: 'AddSmoothie',
    component: AddSmoothie,
  },
  {
    path: '/edit-smoothie/:smoothie_slug',
    name: 'EditSmoothie',
    component: AddSmoothie,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
