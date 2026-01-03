<template>
    <div>

    </div>
</template>

<script setup lang="ts">
const worker = new Worker('./src/pages/simulator/a.ts', {
    type: 'module' // 让 Worker 支持 import/export
})

worker.postMessage([1, 2, 3, 4])

worker.onmessage = (e: MessageEvent<number>) => {
    console.log('计算结果', e.data)
}
</script>