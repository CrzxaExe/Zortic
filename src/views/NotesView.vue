<script setup lang="ts">
import { ref } from 'vue';
import SearchFrom from '../components/forms/SearchFrom.vue';
import GridIcon from '../components/icons/GridIcon.vue';
import RowIcon from '../components/icons/RowIcon.vue';

const itemTypes = [
    GridIcon,
    RowIcon,
];
const itemType = ref(0);
</script>

<template>
    <main class="px-1 lg:px-1.5 mt-2">
        <header class="px-3 py-2 bg-light-300 dark:bg-dark-950 rounded-lg">
            <div class="flex flex-row justify-between">
                <h1 class="text-2xl lg:text-3xl font-bold tracking-tighter">Notes</h1>

                <div class="flex gap-2">
                    <div class="flex p-1.5 rounded-xl border-2 border-light-100 text-light-100 dark:border-dark-800 dark:text-dark-800">
                        <template v-for="(item, i) in itemTypes" :key="i">
                            <i v-if="itemType === i">
                                <component :is="item" />
                            </i>
                        </template>
                    </div>

                    <SearchFrom />
                </div>
            </div>

            <div>test</div>
        </header>

        <section>

        </section>
    </main>
</template>