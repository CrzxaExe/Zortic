<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import ActionButton from '../actions/ActionButton.vue';
import { onClickOutside } from '@vueuse/core';

interface Props {
    listType: number
    note: Note
    index: number
    actions: Action[]
    floatingFunction?: (event: PointerEvent) => void
    closeFloatingFunction?: () => void
}

const isOpen = ref(false)

const props = defineProps<Props>()
const target = useTemplateRef("list-item")
onClickOutside(target, (e) =>{
    e.preventDefault()
    props.closeFloatingFunction?.()
    isOpen.value = false
})

const handleActionList = (event: PointerEvent) => {
    if(!isOpen.value) {
        props.floatingFunction?.(event)
    }

    isOpen.value = !isOpen.value
}
</script>

<template>
    <template v-if="listType === 0">
        <div class="aspect-4.5/1 w-full bg-light-400 dark:bg-dark-900 rounded-lg px-1.5 lg:px-3 py-1.75 shadow-lg flex justify-between animatable" :key="index" ref="list-item" @contextmenu.prevent="floatingFunction?.($event)">
            <div class="block max-w-[90%]">
                <span class="text-dark-700 text-xs truncate">File: {{ note.filename }}</span>
                <h3 class="text-xl font-semibold -mt-2 truncate">{{ note.title }}</h3>
            </div>
            <div>
                <div class="flex flex-col -mr-1.5 gap-0.5 cursor-pointer w-4.75 items-center" :class="isOpen ? 'translate-x-1' : ''" @click.prevent="handleActionList($event)">
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable origin-top-left" :class="isOpen ? 'w-full rotate-45' : 'w-1'"></span>
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable" :class="isOpen ? 'w-full scale-0' : 'w-1'"></span>
                    <span class="block p-0.5 bg-black dark:bg-white rounded-full animatable origin-bottom-left" :class="isOpen ? 'w-full -rotate-45' : 'w-1'"></span>
                </div>
            </div>
        </div>
    </template>
    
    <template v-else>
        <li 
            class="w-full flex justify-between items-center gap-2 h-fit py-2 group hover:bg-light-100 dark:hover:bg-black hover:px-3 lg:hover:px-5 hover:rounded-xl border-y not-first:border-t-white dark:not-first:border-t-dark-800 [&:has(+_div:hover)]:border-b-white dark:[&:has(+_div:hover)]:border-b-dark-800 hover:border-white dark:hover:border-black border-light-300 dark:border-dark-950 animatable" 
            :key="index"
            ref="list-item"
            @contextmenu.prevent="floatingFunction?.($event)"
        >
            <div class="flex flex-col">
                <input class="text-base outline-none" :value="note.title" disabled />
                <span class="text-dark-700 text-xs -mt-1">{{ note.filename }}</span>
            </div>
            <div class="group-hover:block hidden">
                <ActionButton hide-label :actions />
            </div>
        </li>
    </template>
</template>