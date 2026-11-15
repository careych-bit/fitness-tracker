import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'
import TitlePage from './TitlePage.vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({components, directives})
const app = createApp(App)
// const app = createApp(TitlePage)

const pinia = createPinia()

app.use(pinia)

app.use(vuetify)

const authStore = useAuthStore()

authStore.initializeAuth()

app.use(router)

app.mount('#app')
