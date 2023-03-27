import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import '@/assets/scss/tailwind.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
