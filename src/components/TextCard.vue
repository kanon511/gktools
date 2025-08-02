<template>
    <div :class="[
        'p-1 border-b-3 rounded-t-sm w-full m-1',
        {
            'bg-blue-100 border-blue-600 text-blue-600': theme === 'blue',
            'bg-green-100 border-green-600 text-green-600': theme === 'green',
            'bg-pink-100 border-pink-600 text-pink-600': theme === 'red',
            'bg-yellow-100 border-yellow-600 text-orange-600': theme === 'yellow',
        }
    ]">
        <p class="text-lg text-center font-semibold">
            <slot />
        </p>
    </div>
</template>

<script setup lang="ts">
defineProps({
    theme: {
        type: String,
        required: true
    },
})
</script>
