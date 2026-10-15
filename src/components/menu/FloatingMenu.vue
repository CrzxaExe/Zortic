<script setup lang="ts">
interface Props {
    listActions: {
        label?: string
        actions: Action[]
    }[]
    title?: string
    x: number
    y: number
}

defineProps<Props>()
</script>

<template>
    <div class="fixed min-w-45 z-10 bg-light-200 dark:bg-dark-950 rounded-lg border border-light-300 text-sm font-light dark:border-dark-800 overflow-hidden" :style="{ left: `${x}px`, top: `${y}px` }">
        <div class="flex flex-col px-2 py-1.25 border-b border-light-300 dark:border-dark-800" v-if="title">
            <span class="block text-xs opacity-80">{{ title }}</span>
        </div>

        <div v-for="{ label, actions} in listActions" class="not-last:pb-2 not-last:border-b border-light-300 dark:border-dark-800 not-first:pt-1">
            <span class="block text-xs opacity-80 px-2 pb-px" v-if="label">{{ label }}</span>

            <button v-for="{ icon, label }, i in actions" :key="i" class="w-full flex gap-2 items-center px-2 py-0.5 hover:text-primary-600 hover:bg-light-100 dark:hover:bg-black cursor-pointer">
                <component :is="icon" class="scale-75" />
                <span>{{ label }}</span>
            </button>
        </div>
    </div>
</template>