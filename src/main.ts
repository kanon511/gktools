import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
const app = createApp(App);

// Router
import Router from './router';
app.use(Router);

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark-mode',
        }
    }
});

// Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();

// Pinia plugin persisted state
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

app.mount('#app');