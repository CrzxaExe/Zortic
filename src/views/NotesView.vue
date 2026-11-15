<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SearchFrom from '../components/forms/SearchFrom.vue';
import DefaultActions from '../components/actions/DefaultActions.vue';
import { actionNote, itemTypes } from '../constants/list.ts';
import NoteList from '../components/lists/NoteList.vue';
import FloatingMenu from '../components/items/FloatingMenu.vue';
import { useNotesStore } from '../stores/notes.ts';
import FloatingWindows from '../components/items/FloatingWindows.vue';
import NoteSaveForm from '../components/forms/NoteSaveForm.vue';
import ImportNoteForm from '../components/forms/ImportNoteForm.vue';
import { useWindowsMenu } from '../stores/windows.ts';
import { Icons } from '../constants/icons.ts';
import NotesDisplayView from './NotesDisplayView.vue';
import ActionCommand from '../components/actions/ActionCommand.vue';

const store = useNotesStore()
const windows = useWindowsMenu()

const itemType = ref(0)
const isFloatingMenuOpen = ref(false)
const cursor = ref({ x: 0, y: 0 })
const searchValue = ref('')
const isRenaming = ref(false)
const renameValue = ref('')

function setItemType(index: number) {
    itemType.value = index
}

function floatingMenu(event: PointerEvent, note: Note) {
    event.preventDefault()
    isFloatingMenuOpen.value = true
    cursor.value.x = event.clientX
    cursor.value.y = event.clientY
    store.setActiveNote(note)
}

function closeFloatingMenu() {
    isFloatingMenuOpen.value = false
}

function renameNote() {
    if (renameValue.value === '') return
    store.renameNote(store.activeNote, renameValue.value)
    isRenaming.value = false
}

const actions: { label?: string; actions: (Action & ActionFunction)[] }[] = [
    {
        actions: [
            {
                icon: Icons.Edit,
                label: "Edit",
                callback: (event: MouseEvent, note: Note) => {
                    store.setActiveNote(note)
                    windows.setStateAndPos("edit", true, event.clientX, event.clientY)
                },
            },
            {
                icon: Icons.Rename,
                label: "Rename",
                callback: (_event: MouseEvent, note: Note) => {
                    store.setActiveNote(note)
                    renameValue.value = note.title
                    isRenaming.value = true
                },
            },
            {
                icon: Icons.Folder,
                label: "Move",
                hidden: true,
                callback: () => { },
            },
            {
                icon: Icons.Trash,
                label: "Delete",
                callback: (_: MouseEvent, note: Note) => {
                    store.deleteNote(note.filename)
                },
            },
        ]
    },
    {
        label: "Export as",
        actions: [
            {
                icon: Icons.File,
                label: "File",
                callback: () => { },
            },
            {
                icon: Icons.JSON,
                label: "JSON",
                callback: () => { },
            },
        ]
    }
]

function filterList(list: Note[]) {
    return list.filter(e => e.title.toLowerCase().indexOf(searchValue.value) > -1)
}

onMounted(() => {
    store.loadAllNotes()
})
</script>

<template>
    <article
        class="lg:pl-0.5 pr-1 mt-2 flex flex-col relative gap-2 min-h-full max-h-[calc(100vh-0.5rem)] overflow-x-hidden overflow-y-hidden">

        <!-- Save Note Window -->
        <FloatingWindows :title="store.activeNote.filename ? 'Edit Note' : 'Create Note'"
            :initial-x="windows.getData('edit', 'pos').x" :initial-y="windows.getData('edit', 'pos').y"
            v-if="windows.NoteMenu.edit.open" @close="() => windows.setState('edit', false)">
            <NoteSaveForm v-model="store.activeNote" @save="() => {
                store.saveNote(store.activeNote, () => { windows.NoteMenu.edit.open = false })
            }" />
        </FloatingWindows>

        <FloatingWindows :title="store.displayNote.title" :initial-x="windows.getData('display', 'pos').x"
            :initial-y="windows.getData('display', 'pos').y" v-if="windows.NoteMenu.display.open"
            @close="() => windows.setState('display', false)">
            <NotesDisplayView :content="store.displayNote.content" />
        </FloatingWindows>

        <FloatingWindows title="Import" :initial-x="windows.getData('import', 'pos').x"
            :initial-y="windows.getData('import', 'pos').y" v-if="windows.NoteMenu.import.open"
            @close="() => windows.setState('import', false)">
            <ImportNoteForm />
        </FloatingWindows>

        <ActionCommand :button="Icons.Save" :label="'Ren (' + store.activeNote.title + '):'"
            placeholder="Insert new title" v-model="renameValue" @close="() => isRenaming = false" @submit="renameNote"
            v-if="isRenaming" />

        <FloatingMenu :list-actions="actions" v-if="isFloatingMenuOpen" :x="cursor.x" :y="cursor.y"
            :title="store.activeNote?.title" :note="store.activeNote" />

        <header
            class="px-3 lg:px-4 py-2 lg:py-4 bg-light-300 dark:bg-dark-950 rounded-lg flex flex-col gap-2 sticky z-5 top-0 shadow-[2px_0px_0px_4px_#e4f2f5] dark:shadow-[2px_0px_0px_4px_#000000]">
            <div class="flex flex-row justify-between">
                <div>
                    <h1 class="text-3xl lg:text-4xl font-bold tracking-tighter">My Notes</h1>
                    <h2 class="font-light text-dark-900 dark:text-dark-700">Write your note</h2>
                </div>

                <div>
                    <DefaultActions :actions="actionNote" :first-label-only="true" />
                </div>
            </div>
        </header>

        <section
            class="px-3 lg:px-4 py-2 bg-light-300 dark:bg-dark-950 relative rounded-lg w-full h-screen max-h-[calc(100vh-6.2rem)] lg:max-h-[calc(100vh-7.5rem)] flex flex-col overflow-y-scroll">

            <div class="w-fit h-fit flex gap-2 items-center">
                <SearchFrom v-model="searchValue" />
                <div
                    class="flex items-center rounded-xl border-2 border-dark-950 text-dark-950 dark:border-white dark:text-white overflow-hidden">
                    <i v-for="(item, i) in itemTypes" :key="i" @click="() => setItemType(i)"
                        class="p-1 cursor-pointer hover:bg-primary-600"
                        :class="itemType === i ? 'bg-black dark:bg-white text-white dark:text-black' : ''">
                        <component :is="item" />
                    </i>
                </div>
            </div>

            <NoteList :close-floating-function="closeFloatingMenu" :floating-function="floatingMenu"
                :list="filterList(store.list)" :actions="actions[0].actions" :open-function="(event: MouseEvent, note: Note) => {
                    store.setDisplayNote(note)
                    windows.setStateAndPos('display', true, event.clientX - 20, event.clientY - 10)
                }" :list-type="itemType" />

        </section>

        <div
            class="bg-light-300/20 dark:bg-dark-950/20 text-dark-700 dark:text-dark-500 z-2 text-sm pt-1 pb-0.75 px-2 lg:px-3 absolute w-full flex justify-between bottom-0 left-0 rounded-b-lg">
            <div class="flex">
                <span>Total: {{ store.list.length }}</span>
            </div>
        </div>
    </article>
</template>
