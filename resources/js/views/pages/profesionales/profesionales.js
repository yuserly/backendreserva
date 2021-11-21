import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import { required, email } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
// import vue2Dropzone from "vue2-dropzone";

// import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  components: {
    Layout,
    Multiselect,
    // vueDropzone: vue2Dropzone
  },

  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        rut: "",
        nombres: "",
        id_profesional: "",
        apellidos: "",
        profesion: "",
        url_perfil: "",
        email: "",
        user_id: "",
      },
      dropzoneOptions: {
        thumbnailWidth: 150,
        maxFiles: 1,
        url: "http://localhost",
        addRemoveLinks: true,
        autoProcessQueue: false,
        autoQueue: false,
        acceptedFiles: "image/*",
        maxFilesize: 0.5,
        headers: {
          "My-Awesome-Header": "header value",
        },
      },
      submitted: false,
      typeform: "create",
      titlemodal: "Crear Profesional",
      modal: false,
      modalhorario: false,
      modalservicio: false,
      emailexist: false,
      rutexist: false,
      btnCreate: true,
      options: [],
      optionsDias: [],
      optionsSucursal: [],
      //fields horario

      fieldsH: [],
      summitedH: false,
      summitedS: false,
      formhorario: {
        id_profesional: "",
        horario: "",
        // servicio_id_servicio: "",
      },
      // tabla

      formrequest: [],

      formservicio: [],

      id_profesionalservicio:'',

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
          key: "nombres",
          sortable: true,
        },
        {
          key: "apellidos",
          sortable: true,
        },
        {
          key: "profesion",
          sortable: true,
        },
        {
          key: "user.email",
          label: "Email",
          sortable: true,
        },
        "action",
      ],
    };
  },

  validations: {
    form: {
      rut: {
        required,
      },
      nombres: {
        required,
      },
      apellidos: {
        required,
      },
      profesion: {
        required,
      },
      email: {
        required,
        email,
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
    this.traerProfesional();
    // this.traerServicio();
    this.traerDia();
    this.traerSurcusal();
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerProfesional() {
      this.axios
        .get(`/api/obtenerprofesional`)
        .then((response) => {
          console.log(response);
          this.tableData = response.data;
        });
    },
    traerSurcusal() {
      this.axios
        .get(`/api/obtenersucursal`)
        .then((response) => {
          console.log(response);
          this.optionsSucursal = response.data;
        });
    },

    traerDia() {
      this.axios
        .get(`/api/obtenerdia`)
        .then((response) => {
          this.optionsDias = response.data;
        });
    },

    eliminar(data) {
      console.log(data);

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Profesional";
        var text = `¿Esta seguro de desativar profesional ${data.nombre} ${data.apellidos}?`;
      } else {
        estado = 1;
        title = "Activar Profesional";
        text = `¿Esta seguro de activar profesional ${data.nombre} ${data.apellidos}?`;
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
              `/api/eliminarprofesional/${data.id_profesional}`
            )
            .then((res) => {
              console.log(res);
              if (res.data) {
                var message = "Profesional ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar Profesional";
                } else {
                  message = "Error al desactivar Profesional";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerProfesional();
              // this.traerServicio();
            });
        }
      });
    },

    editar(data) {
      this.titlemodal = "Editar Profesional";
      this.form.rut = data.rut;
      this.form.nombres = data.nombres;
      this.form.id_profesional = data.id_profesional;
      this.form.apellidos = data.apellidos;
      this.form.profesion = data.profesion;
      this.form.url_perfil = data.url_perfil;
      this.form.user_id = data.user.id;
      this.form.email = data.user.email;
      this.modal = true;
      this.btnCreate = false;
    },

    config(data) {
        console.log(this.formhorario)
        console.log(this.fieldsH)

      this.form.nombres = data.nombres;
      this.form.id_profesional = data.id_profesional;
      this.form.apellidos = data.apellidos;
      this.form.profesion = data.profesion;
      this.form.url_perfil = data.url_perfil;
      this.form.user_id = data.user.id;
      this.form.email = data.user.email;
      this.modalhorario = true;
      // this.formhorario.servicio_id_servicio = data.servicio;

      if (data.horario_m.length > 0) {
        this.fieldsH = [];
        for (let i = 0; i < data.horario_m.length; i++) {
          this.fieldsH.push({
            id_dia: data.horario_m[i],
            hora_inicio: data.horario_m[i]["pivot"]["hora_inicio"],
            hora_fin: data.horario_m[i]["pivot"]["hora_fin"],
          });
        }
      } else {
        this.fieldsH.push({
          id_dia: "",
          hora_inicio: "",
          hora_fin: "",
        });
      }
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      // this.form.url_perfil = this.$refs.myVueDropzone.dropzone.files[0];

      if (!this.$v.$invalid && !this.emailexist && !this.rutexist) {
        var fd = new FormData();
        fd.append("rut", this.form.rut);
        fd.append("nombres", this.form.nombres);
        fd.append("apellidos", this.form.apellidos);
        fd.append("profesion", this.form.profesion);
        fd.append("email", this.form.email);
        fd.append("id_profesional", this.form.id_profesional);
        fd.append("user_id", this.form.user_id);
        fd.append("url_perfil", this.form.url_perfil);

        this.axios
          .post(`/api/crearprofesional`, fd, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            let title = "";
            let message = "";
            let type = "";
            if (res.data) {
              if (this.form.id_profesional == "") {
                title = "Crear profesional";
                message = "profesional creada con exito";
                type = "success";
              } else {
                title = "Editar profesional";
                message = "profesional editada con exito";
                type = "success";
              }
              this.modal = false;
              this.emailexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerProfesional();
              // this.traerServicio();
              this.successmsg(title, message, type);
            }
          })
          .catch((error) => {
            console.log("error", error);

            let title = "";
            let message = "";
            let type = "";

            if (this.form.id_profesional == "") {
              title = "Crear Profesional";
              message = "Profesional  creada con exito";
              type = "error";
            } else {
              title = "Editar Profesional";
              message = "Profesional editada con exito";
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
      this.titlemodal = "Crear Profesional";
      (this.typeform = "create"),
        (this.form = {
          rut: "",
          nombres: "",
          id_profesional: "",
          apellidos: "",
          profesion: "",
          url_perfil: "",
          email: "",
          user_id: "",
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

    validarRut($event) {
      if ($event.target.value.length > 4) {
        this.axios
          .get(
            `/api/validarrutprofesional/${$event.target.value}`
          )
          .then((response) => {
            if (response.data == 1) {
              this.rutexist = true;
            } else {
              this.rutexist = false;
            }
          });
      }
    },

    onFileChange($event) {
      var files = $event.target.files || $event.dataTransfer.files;
      if (!files.length) return;
      this.form.url_perfil = files[0];
    },

    AddformData() {
      this.fieldsH.push({
        id_dia: "",
        hora_inicio: "",
        hora_fin: "",
      });
    },

    deleteRow(index) {
      this.fieldsH.splice(index, 1);
    },

    formSubmitSettings() {
      this.summitedH = true;

      console.log(this.fieldsH);

      for (let i = 0; i < this.fieldsH.length; i++) {
        if (!this.fieldsH[i]["id_dia"]) {
          return;
        } else if (!this.fieldsH[i]["hora_inicio"]) {
          return;
        } else if (!this.fieldsH[i]["hora_fin"]) {
          return;
        }
        // if (!this.formhorario.servicio_id_servicio) {
        //   return;
        // }
      }

      (this.formhorario.id_profesional = this.form.id_profesional),
        (this.formhorario.horario = this.fieldsH);

      this.axios
        .post(
          `/api/configprofesional`,
          this.formhorario
        )
        .then((res) => {
          let title = "Configurar profesional";
          let message = "profesional configurado con exito";
          let type = "success";
          if (res.data) {
            console.log(res);
            this.modalhorario = false;
            this.btnCreate = false;

            this.formhorario = {
              id_profesional: "",
              horario: "",
              // servicio_id_servicio: "",
            };

            this.fieldsH = [];

            this.summitedH = false;

            this.traerProfesional();
            // this.traerServicio();
            this.successmsg(title, message, type);
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.summitedH = false;

          this.formhorario = {
            id_profesional: "",
            horario: "",
            // servicio_id_servicio: "",
          };

          this.fieldsH = [];

          let title = "Configurar profesional";
          let message = "profesional configurado con exito";
          let type = "error";

          this.modalhorario = false;
          this.btnCreate = false;

          this.successmsg(title, message, type);
        });
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },

    // MANIPULACION PARA LOS SERVICIOS

    traerServicio() {
      if (this.formrequest.length > 0) {
        this.formrequest.forEach((element, i) => {
          if (
            element.sucursal_id_sucursal.id_sucursal ==
            this.formservicio.sucursal_id_sucursal.id_sucursal
          ) {
            this.formrequest.splice(i, 1);
          }
        });
      }
      this.axios
        .get(
          `/api/obtenerservicios/sucursal/${this.formservicio.sucursal_id_sucursal.id_sucursal}`
        )
        .then((response) => {
          console.log(response);
          this.options = response.data.serviciosucursal;
        });
    },

    AddformDataServicio(data) {
      this.id_profesionalservicio = data.id_profesional;
      this.formservicio = {
        servicio_id_servicio: "",
        sucursal_id_sucursal: "",
      };
      this.modalservicio = true;
      this.btnCreate = true;
    },

    deleteRowServicio(index) {
      this.formservicio.splice(index, 1);
    },

    formSubmitServicios() {
      if(this.formrequest.length > 0){

        var form = {
          servicios: this.formrequest,
          id_profesional: this.id_profesionalservicio

      }

        this.axios
        .post(
          `/api/serviciosprofesional`,
          form
        )
        .then((res) => {
          let title = "Servicios profesional";
          let message = "Servicios profesional agregados con exito";
          let type = "success";
          if (res.data) {
            console.log(res);

            if(res.data && (res.status == 200 || res.status == 201) ){

              this.modalservicio= false;
              this.btnCreate = false;

              this.formrequest = [];

              this.summitedS = false;

              this.traerProfesional();
              // this.traerServicio();
              this.successmsg(title, message, type);

            }

          }
        })
        .catch((error) => {
          console.log("error", error);
        });


      }
    },
    agregarotra() {
      // if (this.formrequest.length > 0) {
      //   this.formrequest.forEach((element) => {
      //     console.log(element);

      //     if (
      //       element.sucursal_id_sucursal.id_sucursal ==
      //       this.formservicio.sucursal_id_sucursal.id_sucursal
      //     ) {
      //       for (
      //         let i = 0;
      //         i < this.formservicio.servicio_id_servicio.length;
      //         i++
      //       ) {
      //         element.servicio_id_servicio.push(
      //           this.formservicio.servicio_id_servicio[i]
      //         );
      //       }
      //     } else {
      //       this.formrequest.push(this.formservicio);
      //     }
      //     // servicio

      //     let servicioMap = element.servicio_id_servicio.map((item) => {
      //       return [item.id_servicio, item];
      //     });
      //     var servicioMapArr = new Map(servicioMap); // Pares de clave y valor

      //     let unicos = [...servicioMapArr.values()]; // Conversión a un array

      //     element.servicio_id_servicio = [];

      //     for (let i = 0; i < unicos.length; i++) {
      //       element.servicio_id_servicio.push(unicos[i]);
      //     }
      //   });
      // } else {
      // }

      this.formrequest.push(this.formservicio);

      console.log(this.formrequest);

      this.formservicio = {
        servicio_id_servicio: "",
        sucursal_id_sucursal: "",
      };
    },


  },
};
