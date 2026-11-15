import ChipIcon from "../components/icons/ChipIcon.vue";
import DashboardIcon from "../components/icons/DashboardIcon.vue";
import EditIcon from "../components/icons/EditIcon.vue";
import FileIcon from "../components/icons/FileIcon.vue";
import FolderIcon from "../components/icons/FolderIcon.vue";
import FolderPlusIcon from "../components/icons/FolderPlusIcon.vue";
import FolderUpIcon from "../components/icons/FolderUpIcon.vue";
import FullScreenInIcon from "../components/icons/FullScreenInIcon.vue";
import FullScreenOutIcon from "../components/icons/FullScreenOutIcon.vue";
import GridIcon from "../components/icons/GridIcon.vue";
import HomeIcon from "../components/icons/HomeIcon.vue";
import ImportIcon from "../components/icons/ImportIcon.vue";
import JSONIcon from "../components/icons/JSONIcon.vue";
import PlusIcon from "../components/icons/PlusIcon.vue";
import RenameIcon from "../components/icons/RenameIcon.vue";
import RowIcon from "../components/icons/RowIcon.vue";
import SaveIcon from "../components/icons/SaveIcon.vue";
import TrashIcon from "../components/icons/TrashIcon.vue";
import XIcon from "../components/icons/XIcon.vue";

export const Icons = {
    Chip: ChipIcon,
    Dashboard: DashboardIcon,
    Edit: EditIcon,
    File: FileIcon,
    Folder: FolderIcon,
    FolderUp: FolderUpIcon,
    FolderPlus: FolderPlusIcon,
    FullScreenIn: FullScreenInIcon,
    FullScreenOut: FullScreenOutIcon,
    Grid: GridIcon,
    Home: HomeIcon,
    Import: ImportIcon,
    JSON: JSONIcon,
    Plus: PlusIcon,
    Rename: RenameIcon,
    Row: RowIcon,
    Save: SaveIcon,
    Trash: TrashIcon,
    X: XIcon,
} as const;

export type IconName = keyof typeof Icons;