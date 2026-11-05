<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useSettings } from "./stores/settings";

const settings = useSettings();

onMounted(async () => {
  await settings.loadSettings()

  settings.data.dark ?
    document.documentElement.classList.add("dark") :
    document.documentElement.classList.remove("dark")
})
</script>

<template>
  <RouterView />
</template>