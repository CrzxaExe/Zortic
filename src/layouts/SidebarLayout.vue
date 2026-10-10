<script setup lang="ts">
import { RouterView } from 'vue-router'
import { navigationRoute } from '../constants/route'
import { onKeyDown } from '@vueuse/core'
import { useSettings } from '../stores/settings'
import { ref } from 'vue'
import GearIcon from '../components/icons/GearIcon.vue'
import LightModeIcon from '../components/icons/LightModeIcon.vue'
import DarkModeIcon from '../components/icons/DarkModeIcon.vue'

const settings = useSettings()

const curIndex = ref(-1)
const isSelecting = ref(false)

const toggleTab = (e: Event) => {
    e.preventDefault()

    settings.setToggle()
}

onKeyDown(e => e.key === 'b' && e.ctrlKey, toggleTab)

</script>

<template>
    <aside 
        class="flex flex-col fixed left-0 h-screen max-h-screen w-full animatable rounded-r-lg lg:rounded-r-xl overflow-hidden"
        :class="[settings.data.isOpen ? 'max-w-60' : 'max-w-9 lg:max-w-13']"
    >
        <div class="w-full relative flex flex-col shrink-0">
            <div 
                class="flex items-center px-2 lg:px-3 pt-2 pb-4 lg:pb-6 bg-zinc-200 dark:bg-dark-950" 
                :class="[
                    settings.data.isOpen ? 'justify-start' : 'justify-end',
                    isSelecting && curIndex-1 === -1 ? 'rounded-br-lg' : ''
                ]" 
                @click="toggleTab"
            >
                <span class="overflow-hidden self-start animatable text-2xl font-bold tracking-tighter" :class="[settings.data.isOpen ? 'w-full' : 'w-0']">Zortic</span>
                
                <div class="w-5 lg:w-7 h-5 lg:h-7 border-black dark:border-white border overflow-hidden animatable rounded-sm lg:rounded-lg" :class="[settings.data.isOpen ? 'ml-2' : '']">
                    <div class="w-1.5 bg-black dark:bg-white h-5 lg:h-7 animatable" :class="[settings.data.isOpen ? 'ml-2 w-3 lg:w-5' : '']" />
                </div>
            </div>
            <nav class="flex flex-col bg-white dark:bg-black" @mouseenter="() => isSelecting = true" @mouseleave="() => isSelecting = false">
                <RouterLink 
                    v-for="{ icon, label, to }, key in navigationRoute" 
                    class="relative flex items-center w-full pl-1.5 lg:pl-3.5 hover:bg-white dark:hover:bg-black hover:translate-x-2 py-2 lg:py-2.5 animatable"
                    @mouseenter="() => curIndex = key"
                    :class="[
                        settings.data.navIndex === key ? 'bg-primary-600' : 'bg-zinc-200 dark:bg-dark-950',
                        isSelecting && curIndex-1 === key ? 'rounded-br-lg' : '',
                        isSelecting && curIndex+1 === key ? 'rounded-tr-lg' : '',
                    ]"
                    :key 
                    :to
                >
                    <component :is="icon" class="w-6" />
                    <span class="animatable overflow-hidden inline-block text-sm tracking-wider font-light uppercase" :class="[settings.data.isOpen ? 'w-[90%] pl-2' : 'w-0']">{{ label }}</span>
                </RouterLink>
            </nav>
        </div>

        <div 
            class="bg-zinc-200 dark:bg-dark-950 flex-1 min-h-0 flex flex-col justify-end py-2 animatable" 
            :class="[isSelecting && curIndex+1 === navigationRoute.length ? 'rounded-tr-lg' : '']"
        >
            <div class="px-1.5 lg:px-3.5">
                <button class="cursor-pointer hover:text-primary-600 animatable" @click="() => settings.setDarkMode()">
                    <LightModeIcon v-if="!settings.data.dark" />
                    <DarkModeIcon v-else />
                </button>
            </div>

            <RouterLink to="/settings" class="relative flex w-full pl-1.5 lg:pl-3.5 bg-zinc-200 dark:bg-dark-950 hover:bg-white dark:hover:bg-black py-2 lg:py-2.5 animatable">
                <GearIcon />
                <span class="animatable overflow-hidden inline-block font-light uppercase" :class="[settings.data.isOpen ? 'w-[90%] pl-2' : 'w-0']">Settings</span>
            </RouterLink>
        </div>
    </aside>

    <main class="pl-9 lg:pl-13 w-full max-w-screen overflow-x-hidden">
        <RouterView />
    </main>
</template>