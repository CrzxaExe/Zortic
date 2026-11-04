import { defineStore } from "pinia";
import { reactive } from "vue";

export const useWindowsMenu = defineStore("windows", () => {
    const NoteMenu = reactive({
        edit: {
            open: false,
            pos: { x: 0, y: 0 },
        },
        display: {
            open: false,
            pos: { x: 0, y: 0 },
        }
    })

    return {
        NoteMenu
    }
})