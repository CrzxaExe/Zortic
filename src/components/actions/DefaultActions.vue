<script setup lang="ts">
interface Props {
    actions: Action[]
}

defineProps<Props>()
</script>

<template>
    <div class="flex gap-2">
        <button 
            v-for="action, i in actions"
            class="bg-primary-600 px-3 lg:px-5 py-1.5 flex flex-row gap-2 items-center text-white dark:text-black cursor-pointer rounded-full hover:bg-dark-900 dark:hover:bg-light-300 active:bg-black animatable"
            :key="i"
        >
            <component :is="action.icon" />
            <span>{{ action.label }}</span>
        </button>
    </div>
</template>