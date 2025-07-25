<template>
    <Menubar :model="items">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <!-- <template #end>
            <Button icon="pi pi-sun" />
        </template> -->
    </Menubar>
</template>

<script setup lang="ts">
import { ref } from "vue";

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