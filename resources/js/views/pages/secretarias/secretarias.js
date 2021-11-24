import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: { Layout, Multiselect },

  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        nombres: "",
        apellidos: "",
        email: "",
        id_secretaria: "",
        password: "",
        id_user: "",
        sucursal_id: "",
      },

      formPassword: {
        secretaria: "",
        contrasena: "",
        repetir: "",
      },
      submitted: false,
      repetirValidar: false,
      btnContrasena: false,
      typeform: "create",
      titlemodal: "Crear Secretaria",
      titleContrasena: "Cambio Contraseña",
      modalContrasena: false,
      modal: false,
      emailexist: false,
      btnCreate: true,
      options: [],
      // tabla

      tableData: [],

      title: "Sucursal",
      items: [
        {
          text: "Tables",
        },
        {
          text: "Sucursal",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "nombres",
      sortDesc: false,
      fields: [
        {
          key: "nombres",
          sortable: true,
        },
        {
          key: "apellidos",
          sortable: true,
        },
        {
          key: "user.email",
          label: "email",
          sortable: true,
        },
        "action",
      ],
    };
  },
  validations: {
    form: {
      nombres: {
        required,
      },
      apellidos: {
        required,
      },
      email: {
        required,
      },
      sucursal_id: {
        required,
      },
    },
    formPassword: {
      contrasena: {
        required,
      },
      repetir: {
        required,
      },
    },
  },
  computed: {

    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    this.totalRows = this.items.length;
    this.traerSecretarias();
    this.traerSurcusal();
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerSecretarias() {
      this.axios
        .get(`/api/obtenersecretaria/`)
        .then((response) => {
          console.log(response);
          this.tableData = response.data;
        });
    },

    traerSurcusal() {
      this.axios
        .get(`/api/obtenersucursal/`)
        .then((response) => {
          this.options = response.data;
        });
    },

    eliminar(data) {
      console.log(data);

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Secretaria";
        var text = `¿Esta seguro de desativar secretarias ${data.nombres} ${data.apellidos}?`;
      } else {
        estado = 1;
        title = "Activar Secretaria";
        text = `¿Esta seguro de activar secretarias ${data.nombres} ${data.apellidos}?`;
      }

      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.value) {
          this.axios
            .delete(
              `/api/eliminarsecretaria/${data.id_secretaria}`
            )
            .then((res) => {
              console.log(res);
              if (res.data) {
                var message = "Secretarias ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar secretaria";
                } else {
                  message = "Error al desactivar secretaria";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerSecretarias();
              this.traerSurcusal();
            });
        }
      });
    },

    editar(data) {
      this.titlemodal = "Editar Secretaria";
      this.form.nombres = data.nombres;
      this.form.apellidos = data.apellidos;
      this.form.id_sucursal = data.id_sucursal;
      this.form.id_secretaria = data.id_secretaria;
      this.form.email = data.user.email;
      this.form.id_user = data.user.id;
      this.form.password = data.user.password;
      this.form.sucursal_id = data.secretariasucursal;
      this.modal = true;
      this.btnCreate = false;
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && !this.emailexist) {
        this.axios
          .post(`/api/crearsecretaria`, this.form)
          .then((res) => {

            if (res.data) {
              if (this.form.id_secretaria == "") {
                Swal.fire({
                  icon: 'success',
                  title: 'Crear secretaria',
                  text: "Secretaria  creada con exito",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Crear secretaria',
                  text: "Secretaria editada con exito",
                  timer: 1500,
                  showConfirmButton: false
                });
              }
              this.modal = false;
              this.emailexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerSurcusal();
              this.traerSecretarias();
            }
          })
          .catch((error) => {
            console.log("error", error);

            if (this.form.id_secretaria) {
              Swal.fire({
                icon: 'success',
                title: 'Crear secretaria',
                text: "Secretaria  creada con exito",
                timer: 1500,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Crear secretaria',
                text: "Secretaria editada con exito",
                timer: 1500,
                showConfirmButton: false
              });
            }

            this.modal = false;
            this.btnCreate = false;
            this.$v.form.$reset();

          });
      }
    },

    formSubmitPassword() {
      this.axios
        .post(`/api/changePasswordSecretaria`, this.formPassword)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Secretaria',
            text: res.data,
            timer: 1500,
            showConfirmButton: false
          });
          this.modalContrasena = false;
          this.formPassword = {
            secretaria: "",
            contrasena: "",
            repetir: "",
          }
          this.repetirValidar = false;
          this.btnContrasena = false;
        })
        .catch((error) => {
          console.log("error", error);
      });
    },

    contraseña(data)
    { 
      this.formPassword.secretaria = data;
      this.modalContrasena = true;
    },

    verificarContrasena()
    { 
      if(this.formPassword.repetir.length == 0 && this.formPassword.contrasena.length == 0){
        this.btnContrasena = false;
      }else if(this.formPassword.repetir == this.formPassword.contrasena){
        this.repetirValidar = false;
        this.btnContrasena = true;
      }else{
        this.repetirValidar = true;
        this.btnContrasena = false;
      }
    },

    modalNuevo() {
      this.modal = true;
      this.titlemodal = "Crear Secretaria";
      (this.typeform = "create"),
        (this.form = {
          nombres: "",
          apellidos: "",
          email: "",
          id_secretaria: "",
          password: "",
          id_user: "",
          sucursal_id: "",
        });
      this.btnCreate = true;
    },

    validarEmail($event) {
      if ($event.target.value.length > 4) {
        this.axios
          .get(
            `/api/validaremail/${$event.target.value}`
          )
          .then((response) => {
            if (response.data == 1) {
              this.emailexist = true;
            } else {
              this.emailexist = false;
            }
          });
      }
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },
  },
};
