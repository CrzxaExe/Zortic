<script setup lang="ts">
import { ref } from 'vue';
import SearchFrom from '../components/forms/SearchFrom.vue';
import DefaultActions from '../components/actions/DefaultActions.vue';
import { actionNote, itemTypes } from '../constants/list.ts';
import NoteList from '../components/lists/NoteList.vue';

const itemType = ref(0)

function setItemType (index: number) {
    itemType.value = index
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
]);
</script>

<template>
    <article class="lg:pl-0.5 pr-1 mt-2 flex flex-col relative justify-stretch gap-2 min-h-[calc(100vh-0.5rem)]">
        <header class="px-3 py-2 lg:py-3 bg-light-300 dark:bg-dark-950 rounded-lg flex flex-col gap-2">
            <div class="flex flex-row justify-between">
                <h1 class="text-3xl lg:text-4xl font-bold tracking-tighter">Notes</h1>

                <SearchFrom />
            </div>

            <DefaultActions :actions="actionNote" />
        </header>

        <section 
            class="px-3 py-2 bg-light-300 dark:bg-dark-950 rounded-lg min-h-full flex flex-col"
        >
            <div class="w-fit flex gap-2 items-center">
                <div class="flex items-center rounded-xl border-2 border-dark-950 text-dark-950 dark:border-white dark:text-white overflow-hidden">
                    <i v-for="(item, i) in itemTypes" :key="i" class="p-1.5 cursor-pointer hover:bg-primary-600" @click="() => setItemType(i)" :class="itemType === i ? 'bg-black dark:bg-white text-white dark:text-black' : ''">
                        <component :is="item" />
                    </i>
                </div>
            </div>

            <NoteList :list="noteList" :list-type="itemType" />
        </section>
    </article>
</template>