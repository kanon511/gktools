<template>
    <FloatLabel class="my-2" variant="on">
        <Select v-model="select_option" :options="idol_options" optionLabel="name"
            :invalid="select_option === undefined" :loading="loading" fluid>
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
interface IdolData {
    id: number
    name: string
    icon: string
    type: string
    specialty: { [key: string]: number }
}

import { onMounted, ref, watchEffect } from "vue"

import { Select } from "primevue"

const { idol_id } = defineProps({
    idol_id: {
        type: Number,
    }
})

const idols_data_folder = import.meta.env.VITE_DATA_URL + "idols/"
const idols_icon_data_folder = idols_data_folder + "icons/"

const loading = ref(true)
const idol_options = ref<IdolData[]>()
const select_option = defineModel()

watchEffect(() => {
    select_option.value = idol_options.value?.find(idol => idol.id === idol_id)
})

onMounted(async () => {
    const data: IdolData[] = await fetch(idols_data_folder + "idols.json")
        .then(res => res.json())
    idol_options.value = data
    loading.value = false
})
</script>