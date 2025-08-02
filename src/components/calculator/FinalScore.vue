<template>
    <p class="text-4xl text-center mt-8 mb-4">最终评价：{{ final_score !== -1 ? final_score.toString() + " " + rank : '-' }}
    </p>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'

const { final_score } = defineProps({
    final_score: {
        type: Number,
        required: true
    },
})

const rank_data: { [key: string]: number } = await fetch(import.meta.env.VITE_DATA_URL + "rank.json")
    .then(res => res.json())

let rank = ""

watchEffect(() => {
    rank = Object.keys(rank_data).reduce((acc, cur) => {
        if (final_score >= rank_data[cur]) {
            return cur
        }
        return acc
    }, "")
})
</script>