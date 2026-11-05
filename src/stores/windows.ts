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

    function setState(menu: keyof typeof NoteMenu, state: boolean = !NoteMenu[menu].open) {
        if(!Object.keys(NoteMenu).includes(menu)) return;

        NoteMenu[menu].open = state;
    }
    
    function setPos(menu: keyof typeof NoteMenu, x: number = 0, y: number = 0) {
        if(!Object.keys(NoteMenu).includes(menu)) return;
        
        NoteMenu[menu].pos.x = x;
        NoteMenu[menu].pos.y = y;
    }

    function setStateAndPos(menu: keyof typeof NoteMenu, state: boolean = !NoteMenu[menu].open, x: number = 0, y: number = 0) {
        setPos(menu, x, y);
        setState(menu, state);
    }

    function getData<M extends keyof typeof NoteMenu, K extends keyof typeof NoteMenu[M]>(
        menu: M,
        key: K,
    ): typeof NoteMenu[M][K] {
        return NoteMenu[menu][key];
    }

    return {
        /**
         * Windows data store for Notes
         */
        NoteMenu,

        setState,
        setPos,
        setStateAndPos,

        getData,
    }
})