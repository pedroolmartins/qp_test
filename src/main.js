import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import Tooltip from 'primevue/tooltip'

import "primevue/resources/themes/lara-light-indigo/theme.css"
import "primevue/resources/primevue.min.css"
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import 'bulma/css/bulma.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.directive('tooltip', Tooltip)

app.mount('#app')
