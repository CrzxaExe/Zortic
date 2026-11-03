import { useNotesStore } from "../stores/notes.ts";
import { useWindowsMenu } from "../stores/windows.ts";
import { Icons } from "./icons.ts";

const windows = useWindowsMenu();
const store = useNotesStore();

export const itemTypes = [
    Icons.Grid,
    Icons.Row,
];

export const actionNote: (Action & ActionFunction)[] = [
    {
        icon: Icons.Plus,
        label: "Add",
        callback: (event: MouseEvent) => {
            if(windows.NoteMenu.open) return
            store.resetActiveNote()
            windows.NoteMenu.open = true
            windows.NoteMenu.pos.x = event.clientX
            windows.NoteMenu.pos.y = event.clientY
        }
    },
    {
        icon: Icons.Import,
        label: "Import",
        callback: () => {}
    },
    {
        icon: Icons.Folder,
        label: "Collection",
        callback: () => {}
    },
]