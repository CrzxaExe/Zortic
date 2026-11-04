<script setup lang="ts">
import { useTemplateRef } from 'vue';
import ActionButton from '../actions/ActionButton.vue';
import { onClickOutside } from '@vueuse/core';

interface Props {
    listType: number
    note: Note
    index: number
    actions: (Action & ActionFunction)[]
    floatingFunction?: (event: PointerEvent, note: Note) => void
    closeFloatingFunction?: () => void
}

const props = defineProps<Props>()
const target = useTemplateRef("list-item")
onClickOutside(target, (e) => {
    e.preventDefault()
    props.closeFloatingFunction?.()
})

const emit = defineEmits<{
    (e: "click", ...args: any[]): void
}>()
</script>

<template>
    <template v-if="listType === 0">
        <div class="aspect-4.5/1 w-full bg-light-400 dark:bg-dark-900 rounded-lg px-2 lg:px-3 py-1.75 shadow-lg flex justify-between animatable cursor-pointer"
            :key="index" ref="list-item" @contextmenu.prevent="floatingFunction?.($event, note)"
            @click="emit('click', $event, note)">
            <div class="block max-w-full">
                <span class="text-dark-700 text-xs truncate max-w-full opacity-50 block">File: {{ note.filename
                    }}</span>
                <h3 class="text-xl font-semibold truncate">{{ note.title }}</h3>
            </div>
        </div>
    </template>

    <template v-else>
        <li class="w-full flex justify-between items-center gap-2 h-fit py-2 group hover:bg-light-100 dark:hover:bg-black hover:px-3 lg:hover:px-5 hover:rounded-xl border-y not-first:border-t-white dark:not-first:border-t-dark-800 [&:has(+_div:hover)]:border-b-white dark:[&:has(+_div:hover)]:border-b-dark-800 hover:border-white dark:hover:border-black border-light-300 dark:border-dark-950 animatable"
            :key="index" ref="list-item" @contextmenu.prevent="floatingFunction?.($event, note)"
            @click="emit('click', $event, note)">
            <div class="flex flex-col w-full">
                <span class="text-base outline-none">{{ note.title }}</span>
                <span class="text-dark-700 text-xs -mt-1">{{ note.filename }}</span>
            </div>
            <div class="group-hover:block hidden">
                <ActionButton hide-label :actions :note />
            </div>
        </li>
    </template>
</template>