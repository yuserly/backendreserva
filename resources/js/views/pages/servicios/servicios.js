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
        nombre: "",
        id_servicio: "",
        precio_particular: "",
        precio_fonasa: "",
        precio_isapre: "",
        especialidad_id: "",
        telemedicina: "",
      },
      submitted: false,
      typeform: "create",
      titlemodal: "Crear Servicio",
      modal: false,
      servicioexist: false,
      btnCreate: true,
      options: [],
      // tabla

      tableData: [],

      title: "Servicios",
      items: [
        {
          text: "Tables",
        },
        {
          text: "Servicios",
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
          key: "precio_particular",
          sortable: true,
          label: "Precio",
          formatter: (precio_particular, key, item) => {
              var formatter = new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 0
              });
              return formatter.format(precio_particular);
          }
        },
        {
          key: "precio_fonasa",
          sortable: true,
          label: "Precio Fonasa",
          formatter: (precio_fonasa, key, item) => {
              var formatter = new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 0
              });
              return formatter.format(precio_fonasa);
          }
        },

        {
          key: "precio_isapre",
          sortable: true,
          label: "Precio Isapre",
          formatter: (precio_isapre, key, item) => {
              var formatter = new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 0
              });
              return formatter.format(precio_isapre);
          }
        },
        {
            key: "especialidad.nombre",
            label: 'Especialidad',
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
      precio_particular: {
        required,
      },
      especialidad_id: {
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
    this.traerServicio();
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
            this.options = response.data; 
        });
    },

    traerServicio() {
      this.axios
        .get(`/api/obtenerservicios/`)
        .then((response) => {
          this.tableData = response.data;
        });
    },

    eliminar(data) {

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Servicio";
        var text = `¿Esta seguro de desativar servicio ${data.nombre}?`;
      } else {
        estado = 1;
        title = "Activar Servicio";
        text = `¿Esta seguro de activar servicio ${data.nombre}?`;
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
              `/api/eliminarservicio/${data.id_servicio}`
            )
            .then((res) => {
              console.log(res);
              if (res.data) {
                var message = "Servicio ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar Servicio";
                } else {
                  message = "Error al desactivar Servicio";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerEspecialidad();
              this.traerServicio();
            });
        }
      });
    },

    editar(data) {
      this.titlemodal = "Editar Servicio";
      this.form.nombre = data.nombre;
      this.form.id_servicio = data.id_servicio;
      this.form.precio_fonasa = data.precio_fonasa;
      this.form.precio_isapre = data.precio_isapre;
      this.form.precio_particular = data.precio_particular;
      this.form.especialidad_id = data.especialidad;
      this.form.telemedicina = data.telemedicina;
      this.modal = true;
      this.btnCreate = false;
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && !this.servicioexist) {
        this.axios
          .post(`/api/crearservicio`, this.form)
          .then((res) => {
            if (res.data) {
              if (this.form.id_servicio == "") {
                Swal.fire({
                  icon: 'success',
                  title: 'Servicio',
                  text: "Servicio creado exitosamente",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Servicio',
                  text: "Servicio actualizado exitosamente",
                  timer: 1500,
                  showConfirmButton: false
                });
              }
              
              this.modal = false;
              this.servicioexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerEspecialidad();
              this.traerServicio();
            }
          })
          .catch((error) => {
            console.log("error", error);

            let title = "";
            let message = "";
            let type = "";

            if (this.form.id_servicio) {
              title = "Crear Servicio";
              message = "Servicio  creada con exito";
              type = "error";
            } else {
              title = "Editar Servicio";
              message = "Servicio editada con exito";
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
      this.titlemodal = "Crear Servicio";
      (this.typeform = "create"),
        (this.form = {
          nombre: "",
          id_servicio: "",

          precio_particular: "",
          precio_fonasa: "",
          precio_isapre: "",
          especialidad_id: "",
        });
      this.btnCreate = true;
    },

    validarNombre($event) {
      if ($event.target.value.length > 4) {
        this.axios
          .get(
            `/api/validarnombreservicio/${$event.target.value}`
          )
          .then((response) => {
            if (response.data == 1) {
              this.servicioexist = true;
            } else {
              this.servicioexist = false;
            }
          });
      }
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },
  },
};
