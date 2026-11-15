import ChipIcon from "../components/icons/ChipIcon.vue";
import DashboardIcon from "../components/icons/DashboardIcon.vue";
import FinanceIcon from "../components/icons/FinanceIcon.vue";
import FileIcon from "../components/icons/FileIcon.vue";
import NoteIcon from "../components/icons/NoteIcon.vue";
import ToolsIcon from "../components/icons/ToolsIcon.vue";

/**
 * Route Constant
 */
export const navigationRoute = [
    {
        to: "/",
        label: "Dashboard",
        icon: DashboardIcon,
    },
    {
        to: "/notes",
        label: "Notes",
        icon: NoteIcon,
    },
    {
        to: "/files",
        label: "Files",
        icon: FileIcon,
    },
    {
        to: "/system",
        label: "System",
        icon: ChipIcon,
    },
    {
        to: "/tools",
        label: "Tools",
        icon: ToolsIcon,
    },
    {
        to: "/finance",
        label: "Finance",
        icon: FinanceIcon,
    },
]