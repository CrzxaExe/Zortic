<script setup lang="ts">
interface Props {
    actions: Action[]
    hideLabel?: boolean
}

defineProps<Props>()
</script>

<template>
    <div class="flex gap-2 lg:gap-3">
        <button 
            v-for="action, i in actions"
            class="flex flex-row gap-2 items-center text-dark-600 dark:text-light-200 hover:text-primary-600 cursor-pointer animatable"
            :key="i"
        >
            <component :is="action.icon" />
            <span v-if="!hideLabel">{{ action.label }}</span>
        </button>
    </div>
</template>