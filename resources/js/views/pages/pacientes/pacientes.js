import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import $ from 'jquery'

export default {
  components: { Layout,  Multiselect },
  data() {
    return {
      urlbackend: this.$urlBackend,
      form: {
        nombres: "",
        apellidos: "",
        id_paciente: "",
        email: "",
        celular: "",
        direccion: "",
        rut: "",
        prevension_id:"",
      },
      submitted: false,
      typeform: "create",
      titlemodal: "Crear Paciente",
      modal: false,
      emailexist: false,
      rutexist: false,
      btnCreate: true,
      options: [],
      // tabla

      tableData: [],

      title: "Pacientes",
      items: [
        {
          text: "Tables",
        },
        {
          text: "Pacientes",
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
          key: "celular",
          sortable: true,
        },
        {
          key: "email",
          sortable: true,
        },
        {
            key: "prevision.nombre",
            label: 'previsión',
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
      rut: {
        required,
      },
      apellidos: {
        required,
      },
      email: {
        required,
      },
      celular: {
        required,
      },
      direccion: {
        required,
      },
      prevension_id: {
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
    this.traerPrevision();
    this.traerPaciente();
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    traerPrevision() {
        this.axios
          .get(`/api/obtenerprevision/`)
          .then((response) => {
            this.options = response.data;
          });
      },

    traerPaciente() {
      this.axios
        .get(`/api/obtenerpaciente/`)
        .then((response) => {
          console.log(response);
          this.tableData = response.data;
        });
    },

    eliminar(data) {
      console.log(data);

      if (data.deleted_at == null) {
        var estado = 2;
        var title = "Desactivar Paciente";
        var text = `¿Esta seguro de desativar paciente ${data.nombres} ${data.apellidos}?`;
      } else {
        estado = 1;
        title = "Activar paciente";
        text = `¿Esta seguro de activar paciente ${data.nombres} ${data.apellidos}?`;
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
              `/api/eliminarpaciente/${data.id_paciente}`
            )
            .then((res) => {
              console.log(res);
              if (res.data) {
                var message = "Paciente ha sido desactivada";
                var type = "success";
              } else {
                if (estado == 1) {
                  message = "Error al activar Paciente";
                } else {
                  message = "Error al desactivar Paciente";
                }
                type = "error";
              }

              this.successmsg(title, message, type);

              this.traerPrevision();
              this.traerPaciente();
            });
        }
      });
    },

    editar(data) {
        console.log(data)
      this.form.nombres = data.nombres;
      this.form.apellidos = data.apellidos;
      this.form.id_paciente = data.id_paciente;
      this.form.rut = data.rut;
      this.form.email = data.email;
      this.form.celular = data.celular;
      this.form.direccion = data.direccion;
      this.form.prevension_id = data.prevision;
      this.modal = true;
      this.btnCreate = false;
    },

    formSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (!this.$v.$invalid && !this.emailexist && !this.rutexist) {
        this.axios
          .post(`/api/crearpaciente`, this.form)
          .then((res) => {

            if (res.data) {
              if (this.form.id_paciente == "") {
                Swal.fire({
                  icon: 'success',
                  title: 'Paciente',
                  text: "Paciente creado con exito",
                  timer: 1500,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Paciente',
                  text: "Paciente actualizado con exito",
                  timer: 1500,
                  showConfirmButton: false
                });
              }
              this.modal = false;
              this.emailexist = false;
              this.rutxist = false;
              this.btnCreate = false;

              this.$v.form.$reset();
              this.traerPrevision();
              this.traerPaciente();
            }
          })
          .catch((error) => {
            console.log("error", error);

            let title = "";
            let message = "";
            let type = "";

            if (this.form.id_paciente) {
              title = "Crear Paciente";
              message = "Paciente  creada con exito";
              type = "error";
            } else {
              title = "Editar Paciente";
              message = "Paciente editada con exito";
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
      this.titlemodal = "Crear Paciente";
      (this.typeform = "create"),
        (this.form = {
            nombres: "",
            apellidos: "",
            id_paciente: "",
            email: "",
            celular: "",
            direccion: "",
            rut: "",
            prevension_id: "",
        });
      this.btnCreate = true;
    },

    validarRut($event) {
      if ($event.length > 4) {
        this.axios
          .get(
            `/api/validarrutpaciente/${$event}`
          )
          .then((response) => {
            if (response.data != 0) {
              this.rutexist = true;
            } else {
              this.rutexist = false;
            }
          }); 
      }
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
      this.validarRut(this.form.rut);
    },

    validarEmail($event) {
      if ($event.target.value.length > 4) {
        this.axios
          .get(
            `/api/validaremailpaciente/${$event.target.value}`
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
