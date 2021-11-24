import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: { Layout,  Multiselect },

  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        nombre: "",
        direccion: "",
        id_sucursal: "",
        servicio_id: "",
      },

      formPassword: {
        secretaria: "",
        contrasena: "",
        repetir: "",
      },

      submitted: false,
      typeform: "create",
      titlemodal: "Crear Sucursal",
      titleContrasena: "Cambio Contraseña",
      modal: false,
      sucursalexist: false,
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
      sortBy: "nombre",
      sortDesc: false,
      fields: [
        {
          key: "nombre",
          sortable: true,
        },
        {
          key: "direccion",
          sortable: true,
        },
        "action",
      ],
    };
  },
  validations: {
    form: {
      nombre: {
        required,
      },
      direccion: {
        required,
      },
      servicio_id: {
        required,
      },
    },

  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    this.totalRows = this.items.length;
    this.traerServicio();
    this.traerSurcusal();
  },
  methods: {

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerServicio() {
      this.axios
        .get(`/api/obtenerservicios/`)
        .then((response) => {
          this.options = response.data;
        });
    },

    traerSurcusal() {
        this.axios
          .get(`/api/obtenersucursal/`)
          .then((response) => {
            console.log(response);
            this.tableData = response.data;
          });
      },

    eliminar(data) {
      console.log(data);

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Sucursal";
        var text = `¿Esta seguro de desativar sucursal ${data.nombre}?`;
      } else {
        estado = 1;
        title = "Activar Docente";
        text = `¿Esta seguro de activar sucursal ${data.nombre}?`;
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
              `/api/eliminarsucursal/${data.id_sucursal}`
            )
            .then((res) => {
              console.log(res);
              if (res.data) {
                var message = "Sucursal ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar Sucursal";
                } else {
                  message = "Error al desactivar Sucursal";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerServicio();
              this.traerSurcusal();
            });
        }
      });
    },

    editar(data) {
      this.titlemodal = "Editar Sucursal";
      this.form.nombre = data.nombre;
      this.form.id_sucursal = data.id_sucursal;
      this.form.direccion = data.direccion;
      this.form.servicio_id = data.serviciosucursal;
      this.modal = true;
      this.btnCreate = false;
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && !this.sucursalexist) {
        this.axios
          .post(`/api/crearsucursal`, this.form)
          .then((res) => {

            if (res.data) {
              if (this.form.id_sucursal == "") {
                Swal.fire({
                  icon: 'success',
                  title: 'Sucursal',
                  text: "Sucursal creada exitosamente.",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Sucursal',
                  text: "Sucursal editada exitosamente.",
                  timer: 1500,
                  showConfirmButton: false
                });
              }
              this.modal = false;
              this.sucursalexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerServicio();
              this.traerSurcusal();
            }
          })
          .catch((error) => {
            console.log("error", error);

            let title = "";
            let message = "";
            let type = "";

            if (this.form.id_sucursal) {
              title = "Crear Sucursal";
              message = "Scursal  creada con exito";
              type = "error";
            } else {
              title = "Editar Scursal";
              message = "Scursal editada con exito";
              type = "error";
            }

            this.modal = false;
            this.btnCreate = false;
            this.$v.form.$reset();

            this.successmsg(title, message, type);
          });
      }
    },

    modalNuevo() {
      this.modal = true;
      this.titlemodal = "Crear Sucursal";
      (this.typeform = "create"),
        (this.form = {
          nombre: "",
          direccion: "",
          id_sucursal: "",
          servicio_id: "",
        });
      this.btnCreate = true;
    },

    validarNombre($event) {
      if ($event.target.value.length > 0) {
        this.axios
          .get(
            `/api/validarnombresucursal/${$event.target.value}`
          )
          .then((response) => {
            if (response.data == 1) {
              this.sucursalexist = true;
            } else {
              this.sucursalexist = false;
            }
          });
      }
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },
  },
};
