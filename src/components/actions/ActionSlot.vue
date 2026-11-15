<script setup lang="ts">
import { Icons } from '../../constants/icons';

interface Props {
    title: string
}

defineProps<Props>()

const emit = defineEmits<{
    (e: "close"): void
}>()
</script>

<template>
    <div
        class="w-full min-h-full absolute z-999 bg-light-100/10 dark:bg-black/10 backdrop-blur-xs flex items-center justify-center">
        <div class="flex flex-col justify-between gap-2 px-3 lg:px-5 py-1 lg:py-2 rounded-full min-w-120 lg:min-w-160">
            <div
                class="w-full sticky top-0 z-1 flex justify-between bg-light-500/50 dark:bg-dark-800/50 backdrop-blur-lg px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-lg animatable">
                <span class="tracking-tighter">{{ title }}</span>

                <button @mousedown.stop @click.stop="emit('close')">
                    <component :is="Icons.X" />
                </button>
            </div>

            <div
                class="relative flex flex-1 min-h-0 max-h-full w-full flex-col border border-light-500 dark:border-dark-800 shadow-lg rounded-lg bg-light-400/30 dark:bg-dark-900/30 backdrop-blur-lg mt-1">
                <slot></slot>
            </div>
        </div>
    </div>
</template>