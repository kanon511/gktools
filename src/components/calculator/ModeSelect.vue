<template>
    <p>剧本</p>
    <SelectButton class="my-2" v-model="mode_id" :options="mode_options" optionLabel="name" optionValue="id"
        optionDisabled="disabled" :allowEmpty="false" fluid />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import mode_data from '@/data/mode.json'
import router from '@/router'

const { select_id } = defineProps({
    select_id: {
        type: Number,
        required: true
    },
})
const mode_options = ref(mode_data)
const mode_id = ref(select_id)
const mode = computed(() => mode_options.value.find(item => item.id === mode_id.value))

watch(mode_id, () => {
    mode.value && router.push({ name: mode.value.page_name })
})
</script>