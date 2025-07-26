<template>
    <div class="flex-1 flex flex-col mt-40 items-center">
        <Image src="@/../404.png" height="178" width="140" />
        <h1 class="text-3xl font-bold mt-4">糟糕，找不到指定的页面</h1>
        <router-link :to="{ name: 'Home' }" class="mt-4">
            <Button>返回主页</Button>
        </router-link>
    </div>
</template>

<script setup lang="ts">

</script>