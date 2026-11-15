<script setup lang="ts">
import { DefineComponent } from 'vue';
import { Icons } from '../../constants/icons';

interface Props {
    button: DefineComponent<{}, {}, any>
    label?: string
    placeholder: string
}

defineProps<Props>()

const model = defineModel<string>()

const emit = defineEmits<{
    (e: "submit"): void
    (e: "close"): void
}>()
</script>

<template>
    <div
        class="w-full min-h-full absolute z-999 bg-light-100/10 dark:bg-black/10 backdrop-blur-xs flex items-center justify-center">
        <div
            class="flex items-center justify-between gap-2 bg-light-400 dark:bg-dark-900 px-3 lg:px-5 py-1 lg:py-2 rounded-full">
            <span v-if="label" class="text-primary-600">{{ label }}</span>

            <input type="text" v-model="model" :placeholder="placeholder" class="min-w-100 lg:min-w-140 outline-none"
                @keydown.enter="emit('submit')">

            <div class="flex gap-2 items-center justify-center">
                <button @click="emit('submit')" class="cursor-pointer animatable hover:text-primary-600">
                    <component :is="button" />
                </button>
                <button @click="emit('close')" class="cursor-pointer animatable hover:text-primary-600">
                    <component :is="Icons.X" />
                </button>
            </div>
        </div>
    </div>
</template>