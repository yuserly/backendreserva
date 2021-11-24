<script>
// import simplebar from "simplebar-vue";
import Multiselect from "vue-multiselect";

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            options: [],
            sucursalselect: "",
        };
    },
    mounted() {
        this.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        this.selectsucursal();
    },

    methods: {
        /**
         * Toggle menu
         */
        toggleMenu() {
            this.$parent.toggleMenu();
        },
        initFullScreen() {
            document.body.classList.toggle("fullscreen-enable");
            if (
                !document.fullscreenElement &&
                /* alternative standard method */
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement
            ) {
                // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(
                        Element.ALLOW_KEYBOARD_INPUT
                    );
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        },
        /**
         * Toggle rightsidebar
         */
        toggleRightSidebar() {
            this.$parent.toggleRightSidebar();
        },
        /**
         * Set languages
         */
        logoutUser() {
            this.logout();
            this.$router.push({
                path: "/account/login"
            });
        },

        selectsucursal() {
            this.options = JSON.parse(localStorage.getItem("sucursales"));
            this.sucursalselect = JSON.parse(
                localStorage.getItem("sucursalselect")
            );
        },
        changesucursal() {
            localStorage.setItem(
                "sucursalselect",
                JSON.stringify(this.sucursalselect)
            );
            location.reload();
        },

        logout() {
            this.axios
                .post(`/api/logout`, [])
                .then(res => {
                    console.log(res);
                    if (res.data) {
                        localStorage.clear();

                        this.$router.push({
                            path: "/login"
                        });
                        location.reload(1);
                    }
                })
                .catch(error => {
                    console.log("error", error);
                });
        }
    }
};
</script>

<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex" style="width: 30% !important;">
                <!-- LOGO -->
                <div class="navbar-brand-box">
                    <router-link to="/" class="logo logo-dark">
                        <span class="logo-sm">
                            <img
                                src="../assets/images/logo-sm.png"
                                alt="Logo"
                                height="22"
                            />
                        </span>
                        <span class="logo-lg">
                            <img
                                src="../assets/images/logo-dark.png"
                                alt="Logo"
                                height="20"
                            />
                        </span>
                    </router-link>

                    <router-link to="/" class="logo logo-light">
                        <span class="logo-sm">
                            <img
                                src="../assets/images/logo-sm.png"
                                alt="Logo"
                                height="22"
                            />
                        </span>
                        <span class="logo-lg">
                            <img
                                src="../assets/images/logo-light.png"
                                alt="Logo"
                                height="20"
                            />
                        </span>
                    </router-link>
                </div>

                <button
                    @click="toggleMenu"
                    type="button"
                    class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
                    id="vertical-menu-btn"
                >
                    <i class="fa fa-fw fa-bars"></i>
                </button>

                <div
                    class="pt-3"
                    style="width: 100% !important;margin-left: 15px!important;"
                >
                    <multiselect
                        v-model="sucursalselect"
                        placeholder="Seleccionar"
                        track-by="id_sucursal"
                        label="nombre"
                        :options="options"
                        @input="changesucursal()"
                    ></multiselect>
                </div>
            </div>

            <div class="d-flex">
                <b-dropdown
                    class="d-inline-block"
                    toggle-class="header-item"
                    right
                    variant="white"
                    menu-class="dropdown-menu-end"
                >
                    <template v-slot:button-content>
                        <span
                            class="d-xl-inline-block ms-1 fw-medium font-size-15"
                            >Nombre</span
                        >
                        <i
                            class="uil-angle-down  d-xl-inline-block font-size-15"
                        ></i>
                    </template>
                    <a
                        class="dropdown-item"
                        href="javascript:void(0)"
                        @click="logout()"
                    >
                        <i
                            class="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"
                        ></i>
                        <span class="align-middle">Cerrar Sesión</span>
                    </a>
                </b-dropdown>
            </div>
        </div>
    </header>
</template>
