<template>
    <div class="flex flex-row my-4">
        <FloatLabel variant="on">
            <InputNumber v-model="parameters['vocal']" :useGrouping="false" :invalid="parameters['vocal'] === null"
                fluid />
            <label for="on_label">Vocal</label>
        </FloatLabel>
        <FloatLabel class="mx-2" variant="on">
            <InputNumber v-model="parameters['dance']" :useGrouping="false" :invalid="parameters['dance'] === null"
                fluid />
            <label for="on_label">Dance</label>
        </FloatLabel>
        <FloatLabel variant="on">
            <InputNumber v-model="parameters['visual']" :useGrouping="false" :invalid="parameters['visual'] === null"
                fluid />
            <label for="on_label">Visual</label>
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