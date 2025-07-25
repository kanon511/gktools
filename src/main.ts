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
        preset: Aura
    }
});

// Pinia
import { createPinia } from 'pinia';

const pinia = createPinia();
app.use(pinia);

app.mount('#app');