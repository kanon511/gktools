<template>
    <MenuBar />
    <Suspense>
        <router-view />
    </Suspense>

</template>

<script setup lang="ts">
import { useDarkModeStore } from '@/storts/darkMode';

const darkModeStore = useDarkModeStore();

const { setDarkMode } = darkModeStore;

setDarkMode();
</script>