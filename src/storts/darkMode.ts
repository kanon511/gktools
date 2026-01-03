import { defineStore } from "pinia";
import { ref } from "vue";

export const useDarkModeStore = defineStore('darkMode', () => {
    const darkMode = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const setDarkMode = () => {
        document.documentElement.classList.toggle('app-dark-mode', darkMode.value);
    };

    const toggleDarkMode = () => {
        darkMode.value = !darkMode.value;
        setDarkMode();
    };

    return {
        darkMode,
        setDarkMode,
        toggleDarkMode
    };
}, {
    persist: true
});