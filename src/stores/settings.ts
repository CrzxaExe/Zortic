import { defineStore } from "pinia";
import { reactive } from "vue";
import { navigationRoute } from "../constants/route";
import { load } from "@tauri-apps/plugin-store";

const store = await load("settings.json");

type SettingsConfig = {
    isOpen: boolean;
    navIndex: number;
    dark: boolean;
}

/**
 * Settings store
 */
export const useSettings = defineStore("settings", () => {
    const data = reactive<SettingsConfig>({
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
            document.documentElement.classList.remove("dark");

        await save("dark", state);
    }

    async function save(key: string, value: string | boolean | number) {
        try {
            await store.set(key, value);
    
            await store.save();
        } catch (error: unknown) {
            if(error instanceof Error) console.error(error.message);
        }
    }

    return {
        /**
         * Settings config
         */
        data,

        /**
         * Saving setting key with value into config file
         * @param key Key of value
         * @param value
         */
        save,

        /**
         * Set current theme (light/dark)
         * @param state true = dark, false = light
         */
        setDarkMode,

        /**
         * Set current state of sidebar
         * @param state state sidebar
         */
        setToggle,
        syncNavIndex,
        loadSettings,
    };
});