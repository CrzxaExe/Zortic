<script setup lang="ts">
import { ref } from 'vue';
import DefaultActions from '../actions/DefaultActions.vue';

interface Props {
    listType: number
    note: Note
    index: number
    actions: Action[]
}

const isOpen = ref(false)

defineProps<Props>()
</script>

<template>
    <template v-if="listType === 0">
        <div class="aspect-4/1 w-full bg-light-400 dark:bg-dark-900 rounded-lg px-2 lg:px-4 py-2 shadow-lg flex justify-between animatable" :key="index">
            <div class="block">
                <span class="text-dark-700 text-xs">File: {{ note.filename }}</span>
                <h3 class="text-xl font-semibold -mt-1">{{ note.title }}</h3>
            </div>
            <div>
                <div class="flex flex-col -mr-2 gap-0.5 cursor-pointer w-4.75 items-center" :class="isOpen ? 'translate-x-1' : ''" @click="() => isOpen = !isOpen">
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable origin-top-left" :class="isOpen ? 'w-full rotate-45' : 'w-1'"></span>
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable" :class="isOpen ? 'w-full scale-0' : 'w-1'"></span>
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable origin-bottom-left" :class="isOpen ? 'w-full -rotate-45' : 'w-1'"></span>
                </div>
            </div>
        </div>
    </template>
    
    <template v-else>
        <li class="w-full flex justify-between items-center gap-2 h-fit py-2 hover:bg-white dark:hover:bg-black hover:px-3 lg:hover:px-5 hover:rounded-xl border-y not-first:border-t-white dark:not-first:border-t-dark-800 [&:has(+_div:hover)]:border-b-white dark:[&:has(+_div:hover)]:border-b-dark-800 hover:border-white dark:hover:border-black border-light-300 dark:border-dark-950 animatable" :key="index">
            <div>
                <h3 class="text-base">{{ note.title }}</h3>
                <span class="text-dark-700 text-xs">{{ note.filename }}</span>
            </div>
            <div>
                <DefaultActions :actions />
            </div>
        </li>
    </template>
</template>