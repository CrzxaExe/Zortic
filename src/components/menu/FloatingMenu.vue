<script setup lang="ts">
interface Props {
    actions: Action[];
    x: number,
    y: number
}

defineProps<Props>()
</script>

<template>
    <div class="fixed min-w-40 z-10 bg-light-200 dark:bg-dark-950 rounded-lg border border-light-300 text-sm font-light dark:border-dark-800 overflow-hidden" :style="{ left: `${x}px`, top: `${y}px` }">
        <button v-for="{ icon, label }, i in actions" :key="i" class="w-full flex gap-2 items-center px-2 py-0.5 hover:text-primary-600 hover:bg-light-100 dark:hover:bg-black">
            <component :is="icon" class="scale-75" />
            <span>{{ label }}</span>
        </button>
    </div>
</template>