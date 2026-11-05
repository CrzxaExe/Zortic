<script setup lang="ts">
import SearchIcon from '../icons/SearchIcon.vue';

const model = defineModel<string>();
</script>

<template>
    <div class="flex items-center gap-2 bg-light-100 dark:bg-dark-900 px-3 lg:px-4 py-1.25 rounded-lg lg:rounded-2xl">
        <textarea name="" id="" placeholder="Ctrl+K for searching"
            class="h-3.5 lg:h-4.75 max-w-80 min-w-80 resize-none outline-none text-xs lg:text-sm"
            v-model="model"></textarea>

        <span class="h-3 lg:h-5.5 w-px bg-black dark:bg-white" />

        <SearchIcon class="text-xs" />
    </div>
</template>