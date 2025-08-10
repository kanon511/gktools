<template>
    <div ref="triggerRef" class="relative inline-block" @click="handleClick" @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <Badge value="?" style="font-size: 1rem;" severity="contrast" size="small" />
        <!-- Tooltip -->
        <transition name="fade">
            <div v-if="isVisible" ref="tooltipRef" class="absolute z-50 text-sm w-max max-w-xs" :class="positionClass"
                :style="tooltipStyle">
                <Card class="border border-gray-500" :class="positionClass">
                    <template #content>
                        <slot />
                    </template>
                </Card>
            </div>

        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const isHovering = ref(false)
const isClicked = ref(false)
const isVisible = ref(false)

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)

const positionClass = ref('top-0 left-full ml-2') // 默认显示在右侧
const tooltipStyle = ref<Record<string, string>>({})

const handleClick = () => {
    if (isClicked.value) {
        isClicked.value = false
        isVisible.value = false
    } else {
        isClicked.value = true
        isVisible.value = true
    }
}

const handleMouseEnter = () => {
    if (!isClicked.value) {
        isHovering.value = true
        isVisible.value = true
    }
}

const handleMouseLeave = () => {
    if (!isClicked.value) {
        isHovering.value = false
        isVisible.value = false
    }
}

const handleClickOutside = (e: MouseEvent) => {
    if (
        triggerRef.value &&
        !triggerRef.value.contains(e.target as Node)
    ) {
        isClicked.value = false
        isVisible.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

let triggerRect: DOMRect | null

watch(isVisible, (newValue) => {
    const trigger = triggerRef.value
    if (!trigger) return
    triggerRect = trigger.getBoundingClientRect()
    if (newValue) {
        nextTick(adjustPosition)
    }
    else {
        tooltipStyle.value = {}
    }
})

// 自动调整位置
const adjustPosition = () => {
    const tooltip = tooltipRef.value
    if (!tooltip || !triggerRect) return

    const tooltipRect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let horizontal = 'left-full ml-2'
    let verticalOffset = 0

    // 判断是否越过右边界
    if (triggerRect.right + tooltipRect.width + 8 > viewportWidth) {
        horizontal = 'right-full mr-2'
    }

    // 调整纵向位置
    if (triggerRect.top + tooltipRect.height >= viewportHeight) {
        verticalOffset = viewportHeight - (triggerRect.top + tooltipRect.height) - 8
    } else if (triggerRect.top < 0) {
        verticalOffset = -triggerRect.top + 8
    }

    positionClass.value = `top-0 ${horizontal}`
    tooltipStyle.value = {
        transform: `translateY(${verticalOffset}px)`
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
