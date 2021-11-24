import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import { required, email } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import $ from 'jquery'
// import vue2Dropzone from "vue2-dropzone";

// import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  components: {
    Layout,
    Multiselect,
  },

  data() {
    return {
      urlbackend: this.$urlBackend,
      titleContrasena: "Cambio Contraseña",
      modalContrasena: false,
      repetirValidar: false,
      btnContrasena: false,
      form: {
        rut: "",
        nombres: "",
        id_profesional: "",
        apellidos: "",
        profesion: "",
        url_perfil: "",
        email: "",
        user_id: "",
        especialidad: "",
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
        sucursal: "",
        id_profesional: "",
        horario: "",
        // servicio_id_servicio: "",
      },
      // tabla  

      datosModal: [],

      formrequest: [],

      selectEspecialidad: [],

      formservicio: {
        sucursal_id_sucursal: "",
        servicio_id_servicio: ""
      },

      formPassword: {
        profesional: "",
        contrasena: "",
        repetir: "",
      },

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
          label: "Especialidad",
          key: "especialidadDoc",
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

    formPassword: {
      profesional: {
        required,
      },
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
    this.traerProfesional();
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
          this.tableData            = response.data.profesional;
          response.data.profesional.map((p) => {
            p["especialidadDoc"] = p.especialidad.nombre;
            return p;
          });
          this.selectEspecialidad   = response.data.especialidades; 
        });
    },

    traerSurcusal() {
      this.axios
        .get(`/api/obtenersucursal`)
        .then((response) => {
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

    checkRut() {

      var valor = this.form.rut.replace('.','');  // Quita Punto
      valor = valor.replace('-','');// Quita Guión
      var cuerpo = valor.slice(0,-1);// Aislar Cuerpo y Dígito Verificador
      var dv = valor.slice(-1).toUpperCase();
      this.form.rut = cuerpo + '-'+ dv// Formatear RUN

      if(cuerpo.length < 7) {// Si no cumple con el mínimo de digitos ej. (n.nnn.nnn)
          $('.inputRUT').attr('style', 'border-color: red !important');
          $('.btnSubmit').prop('disabled',  true);
          return false;
      }

      var suma = 0; // Calcular Dígito Verificador
      var multiplo = 2;

      for(var i=1;i<=cuerpo.length;i++) // Para cada dígito del Cuerpo
      {
          var index = multiplo * valor.charAt(cuerpo.length - i); // Obtener su Producto con el Múltiplo Correspondiente
          suma = suma + index; // Sumar al Contador General
          if(multiplo < 7) {
              multiplo = multiplo + 1;
          }else{
              multiplo = 2;
          } // Consolidar Múltiplo dentro del rango [2,7]
      }

      var dvEsperado = 11 - (suma % 11); // Calcular Dígito Verificador en base al Módulo 11
      dv = (dv == 'K')?10:dv; // Casos Especiales (0 y K)
      dv = (dv == 0)?11:dv;

      if(dvEsperado != dv) {
          $('.inputRUT').attr('style', 'border-color: red !important');
          $('.btnSubmit').prop('disabled',  true);
          return false;
      } // Validar que el Cuerpo coincide con su Dígito Verificador

      $('.inputRUT').attr('style', 'border-color: #40A944 !important');  // Si todo sale bien, eliminar errores (decretar que es válido)
      $('.btnSubmit').prop('disabled',  false);
    },

    eliminar(data) {
      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Profesional";
        var text = `¿Esta seguro de desativar profesional ${data.nombres} ${data.apellidos}?`;
      } else {
        estado = 1;
        title = "Activar Profesional";
        text = `¿Esta seguro de activar profesional ${data.nombres} ${data.apellidos}?`;
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
                Swal.fire({
                  icon: 'error',
                  title: 'Crear Profesional',
                  text: "Profesional ha sido desactivado",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                if (estado == 1) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Crear Profesional',
                    text: "Error al activar Profesional",
                    timer: 1500,
                    showConfirmButton: false
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Crear Profesional',
                    text: "Error al desactivar Profesional",
                    timer: 1500,
                    showConfirmButton: false
                  });
                }
                type = "error";
              }

              this.traerProfesional();
            });
        }
      });
    },

    eliminarServicio(data)
    {
      Swal.fire({
        title: "Eliminar Servicio a Profesional",
        text: "Esta seguro que desea eliminar este servicio",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.value) {
          console.log(data);
          this.axios
            .delete(
              `/api/eliminarservicioprofesional/${data}/${this.formservicio.sucursal_id_sucursal.id_sucursal}/${this.id_profesionalservicio}`
            )
            .then((res) => {
              
              Swal.fire({
                icon: 'error',
                title: 'Servicio Eliminado',
                text: res.data,
                timer: 1500,
                showConfirmButton: false
              });

              this.traerServicio();
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
      this.form.especialidad = data.especialidad;
    },

    config(data) {
  
      this.modalhorario = true;
      this.formhorario.id_profesional = data.id_profesional;

    },

    getHorarioProfesional()
    {
      this.axios 
        .get(`/api/getHorarioProfesionalSucursal/${this.formhorario.sucursal.id_sucursal}/${this.formhorario.id_profesional}`)
        .then((res) => {

          this.fieldsH = [];

          if (res.data.length > 0) {
            this.fieldsH = [];
            for (let i = 0; i < res.data.length; i++) {
              this.fieldsH.push({
                id_dia: res.data[i]['dia'],
                hora_inicio: res.data[i]['hora_inicio'],
                hora_fin: res.data[i]["hora_fin"],
              });
            }
          } else {
            this.fieldsH.push({
              id_dia: "",
              hora_inicio: "",
              hora_fin: "",
            });
          }
              
      });
    },

    formSubmit() {
      this.submitted = true;
      this.$v.form.$touch();
      alert("hola");

      if (!this.$v.form.$invalid && !this.emailexist && !this.rutexist) {
        alert("hola");
        var fd = new FormData();
        fd.append("rut", this.form.rut);
        fd.append("nombres", this.form.nombres);
        fd.append("apellidos", this.form.apellidos);
        fd.append("profesion", this.form.profesion);
        fd.append("email", this.form.email);
        fd.append("id_profesional", this.form.id_profesional);
        fd.append("user_id", this.form.user_id);
        fd.append("url_perfil", this.form.url_perfil);
        fd.append('especialidad', this.form.especialidad.id_especialidad);

        this.axios
          .post(`/api/crearprofesional`, fd, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.data) {
              if (this.form.id_profesional == "") {
                Swal.fire({
                  icon: 'success',
                  title: 'Crear Profesional',
                  text: "Profesional creado con exitosamente",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Crear Profesional',
                  text: "Profesional editado exitosamente",
                  timer: 1500,
                  showConfirmButton: false
                });
              }
              this.modal = false;
              this.emailexist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerProfesional();
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

      for (let i = 0; i < this.fieldsH.length; i++) {
        if (!this.fieldsH[i]["id_dia"]) {
          return;
        } else if (!this.fieldsH[i]["hora_inicio"]) {
          return;
        } else if (!this.fieldsH[i]["hora_fin"]) {
          return;
        }
      }

      (this.formhorario.horario = this.fieldsH);

      this.axios
        .post(
          `/api/configprofesional`,
          this.formhorario
        )
        .then((res) => {
          if (res.data) {
            Swal.fire({
              icon: 'success',
              title: 'Horario Profesional',
              text: "Horario de profesional actualizado.",
              timer: 1500,
              showConfirmButton: false
            });

            this.modalhorario = false;
            this.btnCreate = false;

            this.formhorario = {
              id_profesional: "",
              horario: "",
              sucursal: "",
            };

            this.fieldsH = [];

            this.summitedH = false;

          }
        })
        .catch((error) => {
          console.log("error", error);
          this.summitedH = false;

          this.formhorario = {
            id_profesional: "",
            horario: "",
            sucursal: "",
          };

          Swal.fire({
            icon: 'error',
            title: 'Horario Profesional Error',
            text: "Error, comunicarse con encargado.",
            timer: 1500,
            showConfirmButton: false
          });

          this.fieldsH = [];

          this.modalhorario = false;
          this.btnCreate = false;
        });
    },

    successmsg(title, message, type) {
      Swal.fire(title, message, type);
    },

    formSubmitPassword() {
      this.axios
        .post(`/api/changePasswordProfesional`, this.formPassword)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Profesional',
            text: res.data,
            timer: 1500,
            showConfirmButton: false
          });
          this.modalContrasena = false;
          this.formPassword = {
            profesional: "",
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
      this.formPassword.profesional = data;
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

    // MANIPULACION PARA LOS SERVICIOS

    traerServicio() {
      if(this.formservicio.sucursal_id_sucursal == null){
        Swal.fire({
          icon: 'warning',
          title: "Error!!",
          text: 'Debe seleccionar sucursal y servicios.',
          timer: 1500,
          showConfirmButton: false
        });
        this.datosModal = [];
        this.formservicio = {
          sucursal_id_sucursal: "",
          servicio_id_servicio: "",
        }
      }else{
        this.axios
        .get(
          `/api/obtenerservicios/sucursal/${this.formservicio.sucursal_id_sucursal.id_sucursal}/${this.id_profesionalservicio}`
        )
        .then((response) => {
          this.options = response.data.serviciosSucursal;
          this.datosModal = response.data.formrequest;
        });
      }
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
      console.log(this.formservicio);
      if(this.formservicio.servicio_id_servicio == ""){
        Swal.fire({
          icon: 'warning',
          title: "Error!!",
          text: 'Debe seleccionar sucursal y servicios.',
          timer: 1500,
          showConfirmButton: false
        });
        this.datosModal = [];
        this.formservicio = {
          sucursal_id_sucursal: "",
          servicio_id_servicio: "",
        }
        return false;
      }
      
      this.formrequest.push(this.formservicio);

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
          
          Swal.fire({
            icon: 'success',
            title: 'Servicio Añadido',
            text: res.data,
            timer: 1500,
            showConfirmButton: false
          });
          this.traerServicio();
          this.datosModal = [];
          this.formservicio.servicio_id_servicio = "";
          console.log(this.formservicio);
        })
        .catch((error) => {
          console.log("error", error);
        });
      }
    },

  },
};
