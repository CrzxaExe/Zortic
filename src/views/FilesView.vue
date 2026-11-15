<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core'
import { onMounted, ref } from 'vue'
import { Icons } from '../constants/icons'

interface FileEntry {
    name: string
    isDir: boolean
    size: number
}

interface FolderContents {
    path: string
    parentPath: string | null
    entries: FileEntry[]
}

const folderPath = ref('')
const currentFolder = ref('')
const parentFolder = ref<string | null>(null)
const entries = ref<FileEntry[]>([])
const selectedFile = ref('')
const fileContent = ref('')
const newFilename = ref('')
const isCreating = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadFolder(path = folderPath.value) {
    if (!path.trim()) {
        errorMessage.value = 'Enter an absolute folder path.'
        return
    }

    isLoading.value = true
    errorMessage.value = ''
    try {
        const result = await invoke<FolderContents>('list_folder', { folderPath: path })
        currentFolder.value = result.path
        folderPath.value = result.path
        parentFolder.value = result.parentPath
        entries.value = result.entries
        selectedFile.value = ''
        fileContent.value = ''
    } catch (error) {
        errorMessage.value = String(error)
    } finally {
        isLoading.value = false
    }
}

async function openEntry(entry: FileEntry) {
    if (entry.isDir) {
        await loadFolder(`${currentFolder.value}/${entry.name}`)
        return
    }

    selectedFile.value = ''
    fileContent.value = ''
    errorMessage.value = ''
    try {
        fileContent.value = await invoke<string>('read_text_file', {
            folderPath: currentFolder.value,
            filename: entry.name,
        })
        selectedFile.value = entry.name
        isCreating.value = false
    } catch (error) {
        errorMessage.value = String(error)
    }
}

async function createFile() {
    if (!newFilename.value.trim()) {
        errorMessage.value = 'Enter a filename.'
        return
    }

    errorMessage.value = ''
    try {
        await invoke('create_text_file', {
            folderPath: currentFolder.value,
            filename: newFilename.value,
            content: '',
        })
        const filename = newFilename.value
        newFilename.value = ''
        isCreating.value = false
        await loadFolder(currentFolder.value)
        const createdFile = entries.value.find(entry => entry.name === filename)
        if (createdFile) await openEntry(createdFile)
    } catch (error) {
        errorMessage.value = String(error)
    }
}

async function saveFile() {
    if (!selectedFile.value) return

    const filename = selectedFile.value
    errorMessage.value = ''
    try {
        await invoke('update_text_file', {
            folderPath: currentFolder.value,
            filename,
            content: fileContent.value,
        })
        await loadFolder(currentFolder.value)
        const savedFile = entries.value.find(entry => entry.name === filename)
        if (savedFile) await openEntry(savedFile)
    } catch (error) {
        errorMessage.value = String(error)
    }
}

async function deleteSelectedFile() {
    if (!selectedFile.value || !window.confirm(`Delete "${selectedFile.value}"?`)) return

    errorMessage.value = ''
    try {
        await invoke('delete_file', {
            folderPath: currentFolder.value,
            filename: selectedFile.value,
        })
        selectedFile.value = ''
        fileContent.value = ''
        await loadFolder(currentFolder.value)
    } catch (error) {
        errorMessage.value = String(error)
    }
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

onMounted(() => {
    loadFolder("/home")
})
</script>

<template>
    <article class="lg:pl-0.5 mt-2 flex min-h-full max-h-[calc(100vh-0.5rem)] flex-col gap-2 overflow-hidden pr-1">
        <header
            class="sticky top-0 z-5 rounded-lg bg-light-300 px-3 py-3 shadow-[2px_0px_0px_4px_#e4f2f5] dark:bg-dark-950 dark:shadow-[2px_0px_0px_4px_#000000] lg:px-4">
            <h1 class="text-3xl font-bold tracking-tighter lg:text-4xl">Files</h1>
            <p class="font-light text-dark-900 dark:text-dark-700">Browse and manage text files in a folder.</p>
        </header>

        <section
            class="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-lg bg-light-300 px-3 py-3 dark:bg-dark-950 lg:px-4">
            <form class="flex flex-wrap gap-2" @submit.prevent="loadFolder()">
                <input v-model="folderPath" type="text" aria-label="Absolute folder path"
                    placeholder="Absolute folder path (e.g. /home/user/Documents)"
                    class="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 outline-none dark:bg-black text-sm">
                <button class="rounded-lg text-sm bg-primary-600 px-4 py-1.5 text-white hover:opacity-80"
                    :disabled="isLoading">
                    {{ isLoading ? 'Loading…' : 'Open folder' }}
                </button>
            </form>

            <p v-if="errorMessage" role="alert" class="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
                {{ errorMessage }}
            </p>

            <div v-if="currentFolder" class="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex min-w-0 items-center gap-2">
                        <button
                            class="rounded-lg bg-primary-600 px-3 py-1.5 text-white hover:opacity-80 flex items-center justify-center gap-2"
                            @click="isCreating = !isCreating; selectedFile = ''; fileContent = ''">
                            <component :is="Icons.FolderPlus" /> New
                        </button>
                        <button
                            class="rounded-lg bg-light-400 px-3 py-2.25 hover:bg-light-500 dark:hover:bg-dark-800 disabled:opacity-40 dark:bg-dark-900"
                            :disabled="!parentFolder" @click="parentFolder && loadFolder(parentFolder)">
                            <component :is="Icons.FolderUp" />
                        </button>

                        <template v-if="selectedFile">
                            <button
                                class="rounded-lg bg-light-400 px-3 py-2.25 hover:bg-light-500 dark:hover:bg-dark-800 disabled:opacity-40 dark:bg-dark-900"
                                @click="saveFile">
                                <component :is="Icons.Save" />
                            </button>
                            <button
                                class="rounded-lg bg-light-400 px-3 py-2.25 hover:bg-red-600 disabled:opacity-40 dark:bg-dark-900"
                                @click="deleteSelectedFile">
                                <component :is="Icons.Trash" />
                            </button>
                        </template>
                    </div>
                </div>

                <form v-if="isCreating" class="flex gap-2" @submit.prevent="createFile">
                    <input v-model="newFilename" type="text" aria-label="New filename"
                        placeholder="Filename (for example: notes.txt)"
                        class="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 outline-none dark:bg-black">
                    <button class="rounded-lg bg-primary-600 px-3 py-2 text-white hover:opacity-80">Create</button>
                    <button type="button" class="rounded-lg px-3 py-2 hover:bg-light-400 dark:hover:bg-dark-900"
                        @click="isCreating = false">
                        Cancel
                    </button>
                </form>

                <div class="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.6fr)]">
                    <div class="min-h-0 overflow-y-scroll rounded-l-lg bg-light-200 dark:bg-black relative">
                        <span
                            class="truncate text-sm flex items-center opacity-70 px-3 sticky top-0 py-1.5 bg-light-200/70 dark:bg-dark-900/70 w-full backdrop-blur-lg"
                            :title="currentFolder">
                            <component :is="Icons.Home" class="scale-70" /> {{
                                currentFolder }}
                        </span>
                        <p v-if="entries.length === 0" class="p-3 text-sm opacity-60">This folder is empty.</p>
                        <button v-for="entry in entries" :key="entry.name"
                            class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-light-400 dark:hover:bg-dark-900"
                            :class="selectedFile === entry.name ? 'bg-primary-600 text-white' : ''"
                            @click="openEntry(entry)">
                            <span class="min-w-0 truncate flex items-center justify-center gap-2 text-sm"
                                :class="[entry.name.startsWith('.') ? 'opacity-50' : '']">
                                <component :is="entry.isDir ? Icons.Folder : Icons.File" /> {{ entry.name }}{{
                                    entry.isDir ? '/' : '' }}
                            </span>
                            <span v-if="!entry.isDir" class="shrink-0 text-xs opacity-40">{{ formatSize(entry.size)
                                }}</span>
                        </button>
                    </div>

                    <div class="flex min-h-0 flex-col overflow-hidden rounded-r-lg bg-light-200 dark:bg-black border-0 border-l-2 border-white  dark:border-dark-950"">
                        <template v-if="selectedFile">
                        <div class="flex items-center justify-between gap-2 px-3 py-2">
                            <h2 class="truncate font-semibold" :title="selectedFile">{{ selectedFile }}</h2>

                        </div>
                        <textarea v-model="fileContent" :aria-label="`Contents of ${selectedFile}`"
                            class="min-h-0 flex-1 resize-none opacity-60 rounded-lg border-0 border-t border-white p-3 font-mono text-sm outline-none dark:border-dark-950"
                            spellcheck="false">
        </textarea>
</template>

<p v-else class="m-auto text-center text-sm opacity-60">
    Select a text file to read or edit it.
</p>
</div>
</div>
</div>

<p v-else class="m-auto text-center text-sm opacity-60">
    Enter an absolute folder path above to view its files.
</p>
</section>
</article>
</template>
