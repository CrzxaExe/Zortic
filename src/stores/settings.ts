import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { navigationRoute } from "../constants/route";
import { load } from "@tauri-apps/plugin-store";

const store = await load("settings.json");

export const useSettings = defineStore("settings", () => {
    const data = reactive({
        isOpen: false,
        navIndex: 0,
        dark: true,
    });

    async function loadSettings() {
        try {
            const savedDark = await store.get("dark");
            if (typeof savedDark === "boolean") {
                data.dark = savedDark;
            }
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message);
        }
    }

    function setToggle(state: boolean = !data.isOpen) {
        data.isOpen = state;
    }

    function syncNavIndex(fullPath: string) {
        const [path, ..._opts] = fullPath.split(/\//g).slice(1);

        const indexRoutes = navigationRoute.map(e => e.to);
        data.navIndex = indexRoutes.findIndex(e => e === "/" + path);
    }

    async function setDarkMode(state: boolean = !data.dark) {
        data.dark = state;
        data.dark ?
            document.documentElement.classList.add("dark") :
            document.documentElement.classList.remove("dark")
    }

    watch([data.dark], async ([newDark]) => {
        try {
            await store.set("dark", newDark);

            await store.save();
        } catch (error: unknown) {
            if(error instanceof Error) console.error(error.message);
        }
    })

    return {
        data,

        setDarkMode,
        setToggle,
        syncNavIndex,
        loadSettings,
    };
});