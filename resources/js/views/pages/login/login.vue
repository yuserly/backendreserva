<script>
import Vue from "vue";
import { required, email } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
export default {
  mounted() {
    document.body.classList.add("authentication-bg");
  },
  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        email: "",
        password: "",
      },
      submitted: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },

  methods: {
    formSubmit() {
      console.log(this.form);
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.axios
          .post(`/api/login`, this.form)
          .then((res) => {
            console.log(res.data);
            if (res.data.token) {
            
              const token = res.data.token;
              const perfil = res.data.perfil;
              const name = res.data.name;
              const credentialsPerson = res.data.credentialsPerson;

              const sucursales = JSON.stringify(res.data.sucursales);

              localStorage.setItem("token", token);
              localStorage.setItem("perfil", perfil);
              localStorage.setItem("usuarioName", name );
              localStorage.setItem('sucursales', sucursales);
              localStorage.setItem('credentialsPerson', credentialsPerson);
              if (perfil == 1 || perfil == '1') {
                Vue.prototype.$administrador = true;
              } else if (perfil == 2 || perfil == '2') {
                Vue.prototype.$secretaria = true;
              } else if (perfil == 3 || perfil == '3') {
                Vue.prototype.$profesional = true;
              }

              this.$router.push("/");

            } else {
              const title = "Login";
              const message = "Revisa el usuario o contraseña ingresada";
              const type = "error";
              this.successmsg(title, message, type);
            }
          })
          .catch((error) => {
            console.log("error", error);
            const title = "Login";
            const message = "Revisa el usuario o contraseña ingresada";
            const type = "error";
            this.successmsg(title, message, type);
          });
      }
    },
    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },
  },
};
</script>

<template>
  <div>
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <img
                  src="images/reservas.png"
                  alt=""
                  height="100"
                  class="logo logo-dark"
                  style="margin: auto;"
                />
                <hr>
                </div>
                <div class="p-2 mt-4">
                  <form class="needs-validation" @submit.prevent="formSubmit">
                    <div class="mb-3">
                      <label for="username">Correo</label>
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        placeholder="correo@correo.com"
                        v-model="form.email"
                        :class="{
                          'is-invalid': submitted && $v.form.email.$error,
                        }"
                      />
                      <div
                        v-if="submitted && $v.form.email.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="!$v.form.email.required"
                          >Email requerido.</span
                        >
                        <span v-if="!$v.form.email.email"
                          >Ingrese un email valido.</span
                        >
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="float-end">
                      </div>
                      <label for="userpassword">Contraseña</label>
                      <input
                        type="password"
                        class="form-control"
                        id="userpassword"
                        v-model="form.password"
                        placeholder="**********"
                        :class="{
                          'is-invalid': submitted && $v.form.password.$error,
                        }"
                      />
                      <div
                        v-if="submitted && $v.form.password.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="!$v.form.password.required"
                          >Contraseña requerida.</span
                        >
                      </div>
                    </div>

                    <div class="mt-3 text-end">
                      <button
                        class="btn btn-primary w-sm waves-effect waves-light"
                        type="submit"
                      >
                        <i class="mdi mdi-login-variant"></i>
                        Ingresar
                      </button>
                    </div>
                    <hr />
                    <p>
                      © {{ new Date().getFullYear() }} Desarrollado por
                      <i
                        class="mdi mdi-checkbox-marked-circle-outline text-primary"
                      ></i>
                      CENTO - Servicios Informaticos.
                    </p>
                  </form>
                </div>
              </div>
            </div>

            <div class="mt-5 text-center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
