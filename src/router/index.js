import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Configurations from '../views/Configurations.vue'
import Tarifes from '../views/Tarifes.vue'
import Servers from '../views/Servers.vue'
import Help from '../views/Help.vue'
import OpenApp from '../views/OpenApp.vue'
import Settings from '../views/Settings.vue'
import CryptoPayment from '../views/CryptoPayment.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/configurations', component: Configurations },
  { path: '/tarifes', component: Tarifes },
  { path: '/servers', component: Servers },
  { path: '/help', component: Help },
  { path: '/openapp', component: OpenApp },
  { path: '/settings', component: Settings },
  { path: '/crypto-payment', name: 'crypto-payment', component: CryptoPayment },
]

const router = createRouter({
  history: createWebHistory('/vpn-app/'),
  routes,
})

export default router
