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
    <div class="markdown-content px-3 lg:px-4 py-2 block relative min-h-full overflow-scroll max-h-fits"
        v-html="md">
    </div>
</template>

<style>
.markdown-content h1 {
    font-size: 3rem;
    line-height: 1;
    font-weight: 700;
}

.markdown-content h2 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 700;
}

.markdown-content h3 {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
}

.markdown-content h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}

.markdown-content h5 {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
}

.markdown-content h6 {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 700;
}

.markdown-content img {
    display: block;
    position: relative;
    max-width: 100%;
    max-height: 35rem;
    height: auto;
    object-fit: contain;
}
</style>