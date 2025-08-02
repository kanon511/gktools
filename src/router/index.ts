import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "Home",
        path: "/",
        alias: ["/home", "/index"],
        component: () => import("@/pages/Home.vue"),
    },
    {
        name: "Calculator",
        path: "/calculator",
        redirect: { name: "NiaMasCalculator" },
        children: [
            {
                path: "hatsu",
                name: "HatsuCalculator",
                component: () => import("@/pages/calculators/Hatsu.vue"),
            },
            {
                path: "nia",
                name: "NiaCalculator",
                redirect: { name: "NiaMasCalculator" },
                children: [
                    {
                        path: "mas",
                        name: "NiaMasCalculator",
                        component: () => import("@/pages/calculators/nia/Master.vue"),
                    }
                ]
            }
        ]
    },

    {
        name: "NotFound",
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/NotFound.vue"),
    },
];

const Router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default Router;