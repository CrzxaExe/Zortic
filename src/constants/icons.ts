import EditIcon from "../components/icons/EditIcon.vue";
import FileIcon from "../components/icons/FileIcon.vue";
import FolderIcon from "../components/icons/FolderIcon.vue";
import GridIcon from "../components/icons/GridIcon.vue";
import ImportIcon from "../components/icons/ImportIcon.vue";
import JSONIcon from "../components/icons/JSONIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";
import RenameIcon from "../components/icons/RenameIcon.vue";
import RowIcon from "../components/icons/RowIcon.vue";
import SaveIcon from "../components/icons/SaveIcon.vue";
import TrashIcon from "../components/icons/TrashIcon.vue";

export const Icons = {
    Edit: EditIcon,
    File: FileIcon,
    Folder: FolderIcon,
    Grid: GridIcon,
    Import: ImportIcon,
    JSON: JSONIcon,
    Plus: PlusIcon,
    Rename: RenameIcon,
    Row: RowIcon,
    Save: SaveIcon,
    Trash: TrashIcon,
} as const;

export type IconName = keyof typeof Icons;