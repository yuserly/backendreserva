import Vue from "vue";

export function perfiles() {
  let perfil = "";

  if (localStorage.getItem("perfil")) {
    perfil = localStorage.getItem("perfil");
  }

  if (perfil) {
    if (perfil == 1 || perfil == '1') {
      Vue.prototype.$administrador = true;
    } else if (perfil == 2 || perfil == '2') {
      Vue.prototype.$secretaria = true;
    } else if (perfil == 3 || perfil == '3') {
      Vue.prototype.$profesional = true;
    }
  } else {
    Vue.prototype.$administrador = false;
    Vue.prototype.$secretaria = false;
    Vue.prototype.$profesional = false;
  }
}
