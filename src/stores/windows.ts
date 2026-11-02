import { defineStore } from "pinia";
import { reactive } from "vue";

export const useWindowsMenu = defineStore("windows", () => {
    const NoteMenu = reactive({
        open: false,
        pos: { x: 0, y: 0 },
    })

    return {
        NoteMenu
    }
})