<template>
    <p>难度</p>
    <SelectButton class="my-2" v-model="difficulty_id" :options="difficulty_options" optionLabel="name" optionValue="id"
        optionDisabled="disabled" :allowEmpty="false" fluid />
</template>

<script setup lang="ts">
interface DifficultyOption {
    id: Number,
    name: String,
    page_name: RouteRecordName,
    disabled: Boolean,
}

import { computed, ref, watch } from 'vue'
import router from '@/router'
import type { RouteRecordName } from 'vue-router'

const { select_id, difficulty_options } = defineProps({
    select_id: {
        type: Number,
        required: true
    },
    difficulty_options: {
        type: Array as () => DifficultyOption[],
        required: true
    }
})
const difficulty_id = ref(select_id)
const difficulty = computed(() => (difficulty_options as DifficultyOption[]).find(item => item.id === difficulty_id.value))

watch(difficulty_id, () => {
    router.push({ name: difficulty.value?.page_name })
})
</script>