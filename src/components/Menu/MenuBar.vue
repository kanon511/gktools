<template>
    <Menubar :model="items" breakpoint="300px">
        <template #start>
            <Avatar class="mr-1" image="@/../public/favicon.ico" shape="circle" />
        </template>
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="hidden lg:inline">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <Button :icon="darkModeIcon" @click="toggleDarkMode()" />
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDarkModeStore } from '@/storts/darkMode';
import { storeToRefs } from "pinia";

const darkModeStore = useDarkModeStore();
const { darkMode } = storeToRefs(darkModeStore);
const { toggleDarkMode } = darkModeStore;
const darkModeIcon = ref(darkMode.value ? 'pi pi-sun' : 'pi pi-moon');

watch(darkMode, (newValue) => {
    newValue ? darkModeIcon.value = 'pi pi-sun' : darkModeIcon.value = 'pi pi-moon';
});

const items = ref([
    {
        label: '主页',
        icon: 'pi pi-home',
        route: { name: "Home" },
    },
    {
        label: '训练计算器',
        icon: 'pi pi-calculator',
        route: { name: "Calculator" },
    },
]);
</script>