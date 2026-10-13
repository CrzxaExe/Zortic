<script setup lang="ts">
import ArchiveIcon from '../icons/ArchiveIcon.vue';
import NoteItem from '../items/NoteItem.vue';

interface Props {
    actions: Action[]
    list: Note[]
    listType: number
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
                <NoteItem :list-type="listType" :note :actions :index="i" />
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