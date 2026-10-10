import { createRouter, createWebHistory } from "vue-router";
import SidebarLayout from "../layouts/SidebarLayout.vue";
import { useSettings } from "../stores/settings.ts";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: SidebarLayout,
            children: [
                {
                    path: "",
                    meta: {
                        title: "Zortic | Dashboard"
                    },
                    component: async () => await import("../views/DashboardView.vue"),
                },
                {
                    path: "tools",
                    meta: {
                        title: "Zortic | Tools"
                    },
                    component: async () => await import("../views/ToolsView.vue"),
                },
                {
                    path: "finance",
                    meta: {
                        title: "Zortic | Finance"
                    },
                    component: async () => await import("../views/FinanceView.vue"),
                },
                {
                    path: "notes",
                    meta: {
                        title: "Zortic | Motes"
                    },
                    component: async () => await import("../views/NotesView.vue"),
                },
                {
                    path: "settings",
                    meta: {
                        title: "Zortic | Settings"
                    },
                    component: async () => await import("../views/SettingsView.vue"),
                },
            ]
        }
    ]
});

router.beforeEach((to) => {
    if(to.meta.title) document.title = to.meta.title as string;

    useSettings().syncNavIndex(to.fullPath);

    return true;
})

export { router }