<script setup lang="ts">
import { ref } from 'vue';
import { Icons } from '../../constants/icons';
import { useNotesStore } from '../../stores/notes';
import { useWindowsMenu } from '../../stores/windows';

const store = useNotesStore()
const windows = useWindowsMenu()

const isDragging = ref(false)
const refInputElement = ref<HTMLInputElement | null>(null)

const hasContent = ref(false)
const content = ref({ title: '', content: '', type: '' })

const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
}
const onDragLeave = (e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement && e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return
    isDragging.value = false
}
const onDrop = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (file) processFile(file)
}
const onChangeFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) processFile(file)
}
async function processFile(file: File) {
    hasContent.value = true
    content.value.type = file.type
    const text = await file.text()

    switch (file.type) {
        case "text/markdown":
            content.value.title = file.name
            content.value.content = text
            break;
        case "application/json":
            const json = JSON.parse(text);
            content.value.title = json.title
            content.value.content = json.content
            break;
    }
}

const onSubmit = async () => {
    try {
        const note = await store.saveNote({ ...content.value }, () => {
            console.log('submit')
            windows.setState("import", false)
        })
        if (!note) throw new Error("File not saved")

        console.log('success')
    } catch (error: unknown) {
        if (!(error instanceof Error)) return
        console.error(error)
    }
}
</script>

<template>
    <section class="w-full h-full min-h-100 relative flex flex-col" @dragover="onDragOver" @dragleave="onDragLeave"
        @drop="onDrop">
        <div @click="() => (refInputElement as HTMLInputElement).click()"
            class="bg-light-500/60 dark:bg-dark-900/60 w-full flex absolute min-h-full items-center justify-center backdrop-blur-md"
            v-show="isDragging || !hasContent">
            <span>{{ isDragging ? 'Drag Here' : 'Click or Drop file here' }}</span>
            <input type="file" hidden ref="refInputElement" @change="onChangeFile" accept=".md,.json">
        </div>

        <div class="flex flex-1 min-h-0 h-full flex-col px-3 lg:px-4 py-2">
            <span class="text-xs lg:text-sm opacity-60 block">File: {{ content.type ?? 'none' }}</span>

            <input type="text" id="title" v-model="content.title" placeholder="Note title">

            <label for="content" class="mt-2 text-xs lg:text-sm opacity-60">Content</label>
            <textarea type="text" id="content" class="-mt-1 flex-1 min-h-0 resize-none" v-model="content.content"
                placeholder="Content" />

            <div class="mt-2">
                <button
                    class="bg-primary-600 hover:bg-light-500 dark:hover:bg-dark-800 px-3 lg:px-4 py-1 flex items-center gap-1 rounded-lg animatable cursor-pointer"
                    @click="onSubmit">
                    <component :is="Icons.Save" />Save
                </button>
            </div>
        </div>

    </section>
</template>