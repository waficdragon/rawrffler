import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import App from './App.vue'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const ThemePreset = definePreset(Aura, {})

createApp(App)
.use(PrimeVue, {
    theme: {
        preset: ThemePreset,
        options: {
            darkModeSelector: '.dark-mode'
        }
    }
})
.use(ToastService)
.directive('tooltip', Tooltip)
.mount('#app')
