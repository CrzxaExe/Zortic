<script setup lang="ts">
const model = defineModel<Note>({ required: true })

const emit = defineEmits<{
    (e: "save"): void
}>()
</script>

<template>
    <div class="flex flex-col px-3 lg:px-4 py-2 min-h-full">
        <input type="text" v-model="model.filename" hidden>

        <input v-model="model.title" required type="text" placeholder="Title" class="text-xl outline-none">

        <textarea v-model="model.content" required name="" id="" placeholder="Text"
            class="block text-sm resize-none outline-none w-full min-h-full field-sizing-content overflow-y-auto"></textarea>

        <div class="pt-2">
            <button class="bg-primary-600 px-2 py-1" @click="emit('save')">Save</button>
        </div>
    </div>
</template>