import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";

import { required } from "vuelidate/lib/validators";

export default {
  components: { Layout, Multiselect },

  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        nombre: "",
        id_especialidad: "",
        intervalo: "",
      },
      submitted: false,
      typeform: "create",
      titlemodal: "Crear Especialidad",
      modal: false,
      especialidadexist: false,
      btnCreate: true,
      options: [
        { name: "00:10:00" },
        { name: "00:15:00" },
        { name: "00:20:00" },
        { name: "00:30:00" },
        { name: "00:45:00" },
      ],
      // tabla

      tableData: [],

      title: "Especialidades",
      items: [
        {
          text: "Tables",
        },
        {
          text: "Especialidades",
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
        "action",
        {
          key: "nombre",
          sortable: true,
        },
        {
          key: "intervalo",
          sortable: true,
        },
      ],
    };
  },
  validations: {
    form: {
      nombre: {
        required,
      },
      intervalo: {
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
    this.traerEspecialidad();
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerEspecialidad() {
      this.axios
        .get(`/api/obtenerespecialidad/`)
        .then((response) => {
          this.tableData = response.data;
        });
    },

    eliminar(data) {

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Especialidad";
        var text = `¿Esta seguro de desativar la especialidad ${data.nombre}?`;
      } else {
        estado = 1;
        title = "Activar Docente";
        text = `¿Esta seguro de activar la especialidad ${data.nombre}?`;
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
              `/api/eliminarespecialidad/${data.id_especialidad}`
            )
            .then((res) => {

              if (res.data) {
                var message = "Especialidad ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar Especialidad";
                } else {
                  message = "Error al desactivar Especialidad";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerEspecialidad();
            });
        }
      });
    },

    editar(data) {
      this.titlemodal = "Editar Especialidad";
      this.form.nombre = data.nombre;
      this.form.id_especialidad = data.id_especialidad;
      this.form.intervalo = this.options.find(
        (option) => option.name === data.intervalo
      );
      this.modal = true;
      this.btnCreate = false;
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid|

      this.$v.$touch();
      if (!this.$v.$invalid && !this.especialidadexist) {
        this.axios
          .post(
            `/api/crearespecialidad`,
            this.form
          )
          .then((res) => {
            let title = "";
            let message = "";
            let type = "";

            if (
              (res.status == 201 || res.status == 200) &&
              (res.statusText == "Created" || res.statusText == "OK")
            ) {
              if (this.form.id_especialidad == "") {
                title = "Crear Especialidad";
                message = "Especialidad creada con exito";
                type = "success";
              } else {
                title = "Editar Especialidad";
                message = "Especialidad editada con exito";
                type = "success";
              }
              this.modal = false;
              this.especialidadexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerEspecialidad();
              this.successmsg(title, message, type);
            }
          })
          .catch((error) => {
            console.log("error", error);

            let title = "";
            let message = "";
            let type = "";

            if (this.form.id_especialidad) {
              title = "Crear Especialidad";
              message = "Especialidad 1 creada con exito";
              type = "error";
            } else {
              title = "Editar Especialidad";
              message = "Especialidad 1 editada con exito";
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
      this.titlemodal = "Crear Especialidad";
      (this.typeform = "create"),
        (this.form = {
          nombre: "",
          id_especialidad: "",
          intervalo: "",
        });
      this.btnCreate = true;
    },

    validarNombre($event) {
      if ($event.target.value.length > 4) {
        this.axios
          .get(
            `/api/validarnombreespecialidad/${$event.target.value}`
          )
          .then((response) => {
            if (response.data == 1) {
              this.especialidadexist = true;
            } else {
              this.especialidadexist = false;
            }
          });
      }
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },
  },
};
