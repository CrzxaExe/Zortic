import FolderIcon from "../components/icons/FolderIcon.vue";
import GridIcon from "../components/icons/GridIcon.vue";
import ImportIcon from "../components/icons/ImportIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";
import RowIcon from "../components/icons/RowIcon.vue";

export const itemTypes = [
    GridIcon,
    RowIcon,
];
export const actionNote: Action[] = [
    {
        icon: PlusIcon,
        label: "Add"
    },
    {
        icon: ImportIcon,
        label: "Import"
    },
    {
        icon: FolderIcon,
        label: "Collection"
    },
]