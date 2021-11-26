import Vue from "vue";

import BootstrapVue from "bootstrap-vue";
import router from "./routes";
import store from "./state/store";
import "./assets/scss/app.scss";
import App from "./App.vue";
import vco from "v-click-outside";
import VueSweetalert2 from "vue-sweetalert2";
import VueSlideBar from "vue-slide-bar";
import Vuelidate from "vuelidate";
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
import VueAxios from "vue-axios";
import { perfiles } from "./perfiles";

Vue.config.productionTip = false;
Vue.component("VueSlideBar", VueSlideBar);
Vue.use(BootstrapVue);
Vue.use(vco);
Vue.use(Vuelidate);
Vue.use(VueSweetalert2);
Vue.component("apexchart", VueApexCharts);
Vue.prototype.$urlBackend = "http://127.0.0.1:8000";
Vue.use(VueAxios, axios);

perfiles();

Vue.filter('toCurrency', function (value) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    });
    return formatter.format(value);
});
// Vue.component("app", require("./App.vue"));

new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});

// interceptor de solicitud de solicitud http, si hay un valor de token, configure el valor de token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
         if (token) {// Determine si hay un token antes de que se envíe cada solicitud. Si existe, agregue el token al encabezado de la solicitud http de manera uniforme, en lugar de agregarlo manualmente para cada solicitud
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
 });
   // interceptor de respuesta http, interceptar el estado 401 (token caducado), iniciar sesión de nuevo
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                                     // Regrese a 401 para borrar la información del token y saltar a la página de inicio de sesión
                  localStorage.removeItem('token')
                  router.replace({
                      path: 'Login',
                      query: {redirect: router.currentRoute.fullPath}
                  })
          }
      }
             return Promise.reject (error.response.data) // devuelve el mensaje de error devuelto por la interfaz
  });
