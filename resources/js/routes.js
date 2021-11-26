import Vue from "vue";
import VueRouter from "vue-router";

// import store from '@/state/store'

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        meta: {
            requiresAuth: true,
        },
        component: () => import("./views/pages/dashboard/index"),
    },
    {
        path: "/especialidades",
        name: "especialidades",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/especialidades/especialidades.vue"
            ),
    },

    {
        path: "/servicios",
        name: "servicios",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/servicios/servicios.vue"
            ),
    },
    {
        path: "/sucursales",
        name: "sucursales",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/sucursales/sucursales.vue"
            ),
    },
    {
        path: "/secretarias",
        name: "secretarias",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/secretarias/secretarias.vue"
            ),
    },
    {
        path: "/previsiones",
        name: "previsiones",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/previsiones/previsiones.vue"
            ),
    },
    {
        path: "/pacientes",
        name: "pacientes",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/pacientes/pacientes.vue"
            ),
    },
    {
        path: "/profesionales",
        name: "profesionales",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/profesionales/profesionales.vue"
            ),
    },
    {
        path: "/bloqueo-hora",
        name: "bloqueo hora",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/bloqueo_horas/bloqueo.vue"
            ),
    },
    {
        path: "/reservas",
        name: "reservas",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/reservas/reservas.vue"
            ),
    },
    {
        path: "/misreservas",
        name: "misreservas",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/reservas/misreservas.vue"
            ),
    },
    {
        path: "/confirmar-reserva",
        name: "confirmar-reserva",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/reservas/confirmar-reserva.vue"
            ),
    },
    {
        path: "/ventas",
        name: "ventas",
        meta: { requiresAuth: true },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/ventas/ventas.vue"
            ),
    },
    {
        path: "/login",
        name: "login",
        meta: { requiresAuth: false },
        component: () =>
            import(
                /* webpackChunkName: "home" */ "./views/pages/login/login.vue"
            ),
    },
];

const router = new VueRouter({
    routes,
    // Use the HTML5 history API (i.e. normal-looking routes)
    // instead of routes with hashes (e.g. example.com/#/about).
    // This may require some server configuration in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0,
            };
        }
    },
});

router.beforeEach((to, from, next) => {
    //A Logged-in user can't go to login page again
    if (to.name === "login" && localStorage.getItem("token")) {

        let perfil = localStorage.getItem("perfil");

        if (perfil) {
            if (perfil == 3 || perfil == "3") {
                router.push({
                    name: "misreservas",
                });
            } else {
                router.push({
                    name: "home",
                });
            }
        }

        //the route requires authentication
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!localStorage.getItem("token")) {
            //user not logged in, send them to login page
            router.push({
                name: "login",
                query: {
                    to: to.name,
                },
            });
        } else {
            if (!hasAccess(to.name)) {
                //   let rol = atob(localStorage.getItem('cm9s'));

                let perfil = localStorage.getItem("perfil");

                if (perfil) {
                    if (perfil == 3 || perfil == "3") {
                        router.push({
                            name: "misreservas",
                        });
                    } else {
                        router.push({
                            name: "home",
                        });
                    }
                }
            }
        }
    }

    return next();
});

function hasAccess(name) {
    const perfil = localStorage.getItem("perfil");

    switch (name) {
        case "home":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "especialidades":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "servicios":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "sucursales":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "secretarias":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "previsiones":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "bloqueo hora":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "reservas":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "profesionales":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "pacientes":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "ventas":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }
        case "confirmar-reserva":
            if (perfil == 1 || perfil == "1" || perfil == 2 || perfil == "2") {
                return true;
            } else {
                return false;
            }

        case "misreservas":
            if (perfil == 3 || perfil == "3") {
                return true;
            } else {
                return false;
            }

        case "login":
            return true;

        default:
            return false;
    }
}

export default router;
