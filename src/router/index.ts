import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Charts from "../views/Charts.vue";
import Pdf from "../views/Pdf.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "chart",
    component: Charts
  },
  {
    path: "/pdf",
    name: "pdf",
    component: Pdf
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
