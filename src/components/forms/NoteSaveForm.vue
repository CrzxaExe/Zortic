<script setup lang="ts">
import SaveIcon from '../icons/SaveIcon.vue';

const model = defineModel<Note>({ required: true })

const emit = defineEmits<{
    (e: "save"): void
}>()
</script>

<template>
    <div class="relative flex w-full flex-1 min-h-0 flex-col px-3 lg:px-4 py-2">
        <input type="text" v-model="model.filename" hidden>

        <input v-model="model.title" required type="text" placeholder="Title"
            class="shrink-0 text-xl font-semibold outline-none">

        <textarea v-model="model.content" required name="" id="" placeholder="Text"
            class="block w-full flex-1 text-dark-800 dark:text-dark-500 min-h-0 resize-none overflow-y-auto text-sm outline-none mt-2"></textarea>

        <div class="shrink-0 pt-2 lg:pt-4">
            <button
                class="bg-primary-600 hover:bg-light-500 dark:hover:bg-dark-800 px-3 lg:px-4 py-1 flex items-center gap-1 rounded-lg animatable cursor-pointer"
                @click="emit('save')">
                <SaveIcon /> Save
            </button>
        </div>
    </div>
</template>