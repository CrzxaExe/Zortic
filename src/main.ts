import { createApp } from "vue";
import App from "./App.vue";

import './assets/base.css';
import { router } from "./routers/route.ts";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount("#app");
