<script setup lang="ts">
import ArchiveIcon from '../icons/ArchiveIcon.vue';

interface Props {
    list: Note[];
    listType: number;
}

defineProps<Props>()
</script>

<template>
    <template v-if="list.length > 0">
        <div 
            class="mt-2 lg:mt-4" 
            :class="[
                [
                    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3',
                    'flex flex-col'
                ][listType]
            ]"
        >
            <template v-for="note, i in list">
                <template v-if="listType === 0">
                    <div class="aspect-4/1 w-full bg-light-400 dark:bg-dark-900 rounded-lg px-2 lg:px-4 py-2 shadow-lg flex justify-between animatable" :key="i">
                        <div class="block">
                            <span class="text-dark-700 text-xs">File: {{ note.filename }}</span>
                            <h3 class="text-xl font-semibold -mt-1">{{ note.title }}</h3>
                        </div>
                        <div>
                            <div class="flex flex-col gap-0.5">
                                <span class="block p-0.5 bg-black dark:bg-white rounded-full"></span>
                                <span class="block p-0.5 bg-black dark:bg-white rounded-full"></span>
                                <span class="block p-0.5 bg-black dark:bg-white rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </template>
                
                <template v-else>
                    <li class="w-full flex items-center gap-2 h-fit py-2 hover:bg-white dark:hover:bg-black hover:px-3 lg:hover:px-5 hover:rounded-xl border-y not-first:border-t-white dark:not-first:border-t-dark-800 [&:has(+_div:hover)]:border-b-white dark:[&:has(+_div:hover)]:border-b-dark-800 hover:border-white dark:hover:border-black border-light-300 dark:border-dark-950 animatable" :key="i">
                        <h3 class="text-base">{{ note.title }}</h3>
                        <span class="text-dark-700 text-xs">{{ note.filename }}</span>
                    </li>
                </template>
            </template>
        </div>
    </template>

    <template v-else>
        <div class="flex items-center justify-center py-2 lg:py-3">
            <div class="flex flex-col items-center">
                <ArchiveIcon />
                <h3 class="text-xl lg:text-2xl font-semibold">Its empty here</h3>
                <span class="-mt-1 font-light">Create new note</span>
            </div>
        </div>
    </template>
</template>