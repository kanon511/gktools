<template>
    <FloatLabel class="my-2" variant="on">
        <Select v-model="select_option" :options="idol_options" optionLabel="name" :invalid="select_option === null"
            :loading="loading" fluid>
            <template #value="slotProps">
                <div class="flex items-center h-8">
                    <img v-if="slotProps.value && slotProps.value.icon" class="mr-2 h-full"
                        :src="idols_icon_data_folder + slotProps.value?.icon" />
                    <div>{{ slotProps.value?.name }}</div>
                </div>
            </template>
            <template #option="slotProps">
                <div class="flex items-center h-8">
                    <img v-if="slotProps.option.icon" class="mr-2 h-full"
                        :src="idols_icon_data_folder + slotProps.option.icon" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Select>
        <label for="on_label">偶像</label>
    </FloatLabel>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

import { Select } from "primevue"

const idols_data_folder = import.meta.env.VITE_DATA_URL + "idols/"
const idols_icon_data_folder = idols_data_folder + "icons/"

const loading = ref(true)
const idol_options = ref([])
const select_option = ref(null)

onMounted(async () => {
    const data: never[] = await fetch(idols_data_folder + "idols.json")
        .then(res => res.json())
    idol_options.value = data
    // select_option.value = data[0]
    loading.value = false
})

defineExpose({ select_option })
</script>