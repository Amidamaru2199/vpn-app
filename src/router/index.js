import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Configurations from '../views/Configurations.vue'
import Tarifes from '../views/Tarifes.vue'
import Servers from '../views/Servers.vue'
import Help from '../views/Help.vue'

const routes = [
  { path: '/vpn-app/', component: Home },
  { path: '/vpn-app/configurations', component: Configurations },
  { path: '/vpn-app/tarifes', component: Tarifes },
  { path: '/vpn-app/servers', component: Servers },
  { path: '/vpn-app/help', component: Help },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
