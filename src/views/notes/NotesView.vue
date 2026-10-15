<script setup lang="ts">
import { ref } from 'vue';
import SearchFrom from '../../components/forms/SearchFrom.vue';
import DefaultActions from '../../components/actions/DefaultActions.vue';
import { actionNote, itemTypes } from '../../constants/list.ts';
import NoteList from '../../components/lists/NoteList.vue';
import FloatingMenu from '../../components/menu/FloatingMenu.vue';
import EditIcon from '../../components/icons/EditIcon.vue';
import RenameIcon from '../../components/icons/RenameIcon.vue';
import FolderIcon from '../../components/icons/FolderIcon.vue';
import TrashIcon from '../../components/icons/TrashIcon.vue';
import { useNotesStore } from '../../stores/notes.ts';
import FileIcon from '../../components/icons/FileIcon.vue';
import JSONIcon from '../../components/icons/JSONIcon.vue';

const store = useNotesStore()

const itemType = ref(0)
const isFloatingMenuOpen = ref(false)
const cursor = ref({ x: 0, y: 0 })
const searchValue = ref('')

function setItemType (index: number) {
    itemType.value = index
}

function floatingMenu(event: PointerEvent, note: Note) {
    isFloatingMenuOpen.value = true
    cursor.value.x = event.clientX
    cursor.value.y = event.clientY
    store.setActiveNote(note)
}

function closeFloatingMenu() {
    isFloatingMenuOpen.value = false
}

const noteList = ref<Note[]>([
    {
        filename: "fa1vom34n.md",
        title: "Daily Note",
        content: "Ahok",
    },
    {
        filename: "ifth21st41io.md",
        title: "Dev Note",
        content: "Ahok",
    },
    {
        filename: "kcnddj34546.md",
        title: "Copy Paste",
        content: "Ahok",
    },
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
    {
        filename: "gwin8wu8r.md",
        title: "Testing if the text are overflow",
        content: "Ahok",
    },  
]);

const actions: { label?: string; actions: (Action & ActionFunction)[] }[] = [
    {
        actions: [
            {
                icon: EditIcon,
                label: "Edit",
                callback: () => {},
            },
            {
                icon: RenameIcon,
                label: "Rename",
                callback: () => {},
            },
            {
                icon: FolderIcon,
                label: "Move",
                callback: () => {},
            },
            {
                icon: TrashIcon,
                label: "Delete",
                callback: () => {},
            },
        ]
    },
    {
        label: "Export",
        actions: [
            {
                icon: FileIcon,
                label: "as File",
                callback: () => {},
            },
            {
                icon: JSONIcon,
                label: "as JSON",
                callback: () => {},
            },
        ]
    }
]

function filterList(list: Note[]) {
    return list.filter(e => e.title.toLowerCase().indexOf(searchValue.value) > -1)
}
</script>

<template>
    <article class="lg:pl-0.5 pr-1 mt-2 flex flex-col relative gap-2 min-h-full max-h-[calc(100vh-0.5rem)] overflow-x-hidden overflow-y-scroll">
        <FloatingMenu :list-actions="actions" v-if="isFloatingMenuOpen" :x="cursor.x" :y="cursor.y" :title="store.activeNote?.title" />

        <header class="px-3 py-2 lg:py-3 bg-light-300 dark:bg-dark-950 rounded-lg flex flex-col gap-2 sticky z-5 top-0 shadow-[2px_0px_0px_4px_#e4f2f5] dark:shadow-[2px_0px_0px_4px_#000000]">
            <div class="flex flex-row justify-between">
                <h1 class="text-3xl lg:text-4xl font-bold tracking-tighter">Notes</h1>

                <SearchFrom v-model="searchValue" />
            </div>

            <DefaultActions :actions="actionNote" />
        </header>

        <section 
            class="px-3 py-2 bg-light-300 dark:bg-dark-950 relative rounded-lg w-full h-screen max-h-[calc(100vh-7.5rem)] lg:max-h-[calc(100vh-8.25rem)] flex flex-col overflow-y-scroll"
        >
        
            <div class="w-fit flex gap-2 items-center">
                <div class="flex items-center rounded-xl border-2 border-dark-950 text-dark-950 dark:border-white dark:text-white overflow-hidden">
                    <i 
                        v-for="(item, i) in itemTypes" :key="i" 
                        @click="() => setItemType(i)" 
                        class="p-1.5 cursor-pointer hover:bg-primary-600" 
                        :class="itemType === i ? 'bg-black dark:bg-white text-white dark:text-black' : ''"
                    >
                        <component :is="item" />
                    </i>
                </div>
            </div>

            <NoteList :close-floating-function="closeFloatingMenu" :floating-function="floatingMenu" :list="filterList(noteList)" :actions="actions[0].actions" :list-type="itemType" />

        </section>

        <div class="bg-light-300/20 dark:bg-dark-950/20 z-2 text-sm pt-1 pb-0.5 px-2 lg:px-3 absolute w-full bottom-0 left-0 rounded-b-lg">
            test
        </div>
    </article>
</template>