<template>
    <div class="flex flex-row my-4">
        <FloatLabel variant="on">
            <InputNumber v-model="parameters['vocal']" :maxFractionDigits="1" :useGrouping="false"
                :pt="{ pcInputText: { root: { inputmode: 'decimal' } } }" :invalid="parameters['vocal'] === null"
                fluid />
            <label for="on_label">Vocal%</label>
        </FloatLabel>
        <FloatLabel class="mx-2" variant="on">
            <InputNumber v-model="parameters['dance']" :maxFractionDigits="1" :useGrouping="false"
                :pt="{ pcInputText: { root: { inputmode: 'decimal' } } }" :invalid="parameters['dance'] === null"
                fluid />
            <label for="on_label">Dance%</label>
        </FloatLabel>
        <FloatLabel variant="on">
            <InputNumber v-model="parameters['visual']" :maxFractionDigits="1" :useGrouping="false"
                :pt="{ pcInputText: { root: { inputmode: 'decimal' } } }" :invalid="parameters['visual'] === null"
                fluid />
            <label for="on_label">Visual%</label>
        </FloatLabel>
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps({
    parameters: {
        type: Object,
        required: true
    },
})
</script>