<template>
    <FloatLabel variant="on">
        <Select v-model="select_option" :options="idol_options" optionLabel="name" class="w-full" />
        <label for="on_label">偶像</label>
    </FloatLabel>
</template>

<script setup lang="ts">
import { ref } from "vue"
import data from "@/data/idols/idols.json"

import { Select } from "primevue"

const idol_options = ref(data)
const select_option = ref(data[0])

defineExpose({ select_option })
</script>