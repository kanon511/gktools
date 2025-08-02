<template>
    <FloatLabel variant="on">
        <Select v-model="select_option" :options="idol_options" optionLabel="name" class="w-full" />
        <label for="on_label">偶像</label>
    </FloatLabel>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import { Select } from "primevue"

const idol_options = ref()
const select_option = ref()

onMounted(async () => {
    const data: any[] = await fetch(import.meta.env.VITE_DATA_URL + "idols/idols.json")
        .then(res => res.json())
    idol_options.value = data
    select_option.value = data[0]
})

defineExpose({ select_option })
</script>