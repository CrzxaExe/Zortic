import DashboardIcon from "../components/icons/DashboardIcon.vue";
import FinanceIcon from "../components/icons/FinanceIcon.vue";
import NoteIcon from "../components/icons/NoteIcon.vue";
import ToolsIcon from "../components/icons/ToolsIcon.vue";

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