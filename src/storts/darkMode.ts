import { defineStore } from "pinia";
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";

export const useDarkModeStore = defineStore('darkMode', () => {
    const darkModeStore = useLocalStorage('darkMode', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const darkMode = ref(darkModeStore.value);

    const setDarkMode = () => {
        document.documentElement.classList.toggle('app-dark-mode', darkMode.value);
        darkModeStore.value = darkMode.value;
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
});