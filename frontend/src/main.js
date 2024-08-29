import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";

// Create and configure the Vue app
const app = createApp(App);

// Use VueApexCharts and register the component globally
app.use(VueApexCharts);

app.use(router);

app.mount("#app");
