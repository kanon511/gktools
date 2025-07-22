import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "Home",
        path: "/",
        component: () => import("@/pages/Home.vue"),
    },
    {
        name: "Calculator",
        path: "/calculator",
        component: () => import("@/pages/Calculator.vue"),
    },
];

const Router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default Router;