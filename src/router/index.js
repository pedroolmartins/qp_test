import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/Home.vue')
    },
    {
      path: '/choose-trip/:from/:to/:travelDate',
      name: 'choose-trip',
      component: () => import('@/components/ChooseTrip.vue')
    },
    {
      path: '/seats/:travelId',
      name: 'seats',
      component: () => import('@/components/Seats.vue')
    },
  ]
})

export default router
