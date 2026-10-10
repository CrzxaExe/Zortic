<script setup lang="ts">
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { RouterView } from "vue-router";
import { useSettings } from "./stores/settings";

const settings = useSettings();

const greetMsg = ref<string>("")
const name = ref<string>("")

async function _greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value })
}

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