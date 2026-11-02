import FolderIcon from "../components/icons/FolderIcon.vue";
import GridIcon from "../components/icons/GridIcon.vue";
import ImportIcon from "../components/icons/ImportIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";
import RowIcon from "../components/icons/RowIcon.vue";
import { useWindowsMenu } from "../stores/windows.ts";

const windows = useWindowsMenu();

export const itemTypes = [
    GridIcon,
    RowIcon,
];

export const actionNote: (Action & ActionFunction)[] = [
    {
        icon: PlusIcon,
        label: "Add",
        callback: (event: MouseEvent) => {
            if(windows.NoteMenu.open) return

            windows.NoteMenu.open = true
            windows.NoteMenu.pos.x = event.clientX
            windows.NoteMenu.pos.y = event.clientY
        }
    },
    {
        icon: ImportIcon,
        label: "Import",
        callback: () => {}
    },
    {
        icon: FolderIcon,
        label: "Collection",
        callback: () => {}
    },
]