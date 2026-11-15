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
        label: "Create",
        callback: (event: MouseEvent) => {
            if(windows.NoteMenu.edit.open == true) return;
            store.resetActiveNote();
            windows.setStateAndPos('edit', true, event.clientX - 440, event.clientY - 10);
        }
    },
    {
        icon: Icons.Import,
        label: "Import",
        callback: (event: MouseEvent) => {
            event.preventDefault();
            windows.setStateAndPos('import', true, event.clientX - 520, event.clientY - 10);
        }
    },
    {
        icon: Icons.Folder,
        label: "Collection",
        hidden: true,
        callback: () => {}
    },
]