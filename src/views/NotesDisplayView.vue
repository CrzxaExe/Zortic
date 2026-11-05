<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';

interface Props {
    content: string
}

const props = defineProps<Props>()

const md = computed(() => marked(props.content))
</script>

<template>
    <div class="px-3 lg:px-4 py-2 block relative min-h-full overflow-scroll max-h-fits" v-html="md">
    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    :deep(h1) {
        @apply font-bold text-5xl;
    }

    :deep(h2) {
        @apply font-bold text-4xl
    }

    :deep(h3) {
        @apply font-bold text-3xl
    }

    :deep(h4) {
        @apply font-bold text-2xl
    }

    :deep(h5) {
        @apply font-bold text-xl
    }

    :deep(h6) {
        @apply font-bold text-lg
    }

    :deep(img) {
        @apply block relative max-w-full max-h-140 h-auto object-contain
    }
}
</style>