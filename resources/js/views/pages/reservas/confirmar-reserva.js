import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import moment from "moment";

import { required } from "vuelidate/lib/validators";

export default {
    components: { Layout, Multiselect },

    data() {
        return {
            formbuscar: {
                rut: "",
                fecha: "",
            },
            sucursal: JSON.parse(localStorage.getItem("sucursalselect")),
            submitted: false,
            submittedventa: false,
            modal: false,
            options: [],
            optionsMedioPago: [],
            optionsPago: [{nombre:'Pagado',id_estado:4},{nombre:'Pendiente Pago',id_estado:5}],
            nombrepaciente: "",
            rutpaciente: "",
            emailpaciente: "",
            nombreeprofesional: "",
            nombreservicio: "",
            precioservicio: "",
            servicioprevision: "",
            serviciopacienteseleccionado: "",
            cambiarprevision: {
                id_paciente: "",
                id_prevision: "",
            },
            formventa: {
                id_reserva: "",
                id_paciente: "",
                mediopago: "",
                subtotal: 0,
                porcentajedescuento: 0,
                precio_descuento: 0,
                iva: 0,
                total: 0,
                codigo_boucher: "",
                codigo_bono_fonasa: "",
                boleta_honorario: "",
                n_honorario: "",
                estado:""
            },
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
                {
                    key: "codigo",
                    sortable: true,
                },
                {
                    key: "paciente",
                    sortable: true,
                    label: "Paciente",
                    formatter: (paciente) => {
                        return `${paciente.nombres} ${paciente.apellidos}`;
                    },
                },
                {
                    key: "paciente.rut",
                    sortable: true,
                    label: "RUT Paciente",
                },
                {
                    key: "paciente.email",
                    sortable: true,
                    label: "Email Paciente",
                },
                {
                    key: "profesional",
                    sortable: true,
                    label: "Profesional",
                    formatter: (profesional) => {
                        return `${profesional.nombres} ${profesional.apellidos}`;
                    },
                },
                {
                    key: "servicio.nombre",
                    sortable: true,
                    label: "Servicio",
                },
                "action",
            ],
        };
    },
    validations: {
        formbuscar: {
            rut: {
                required,
            },
            fecha: {
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
        this.formbuscar.fecha = moment().format("YYYY-MM-DD");
        this.traerPrevision();
        this.traerMedioPago();
        this.TraerReservaDia();
    },

    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },

        traerPrevision() {
            this.axios.get(`/api/obtenerprevision/`).then((response) => {
                this.options = response.data;
            });
        },

        traerMedioPago() {
            this.axios.get(`/api/obtenermediopago/`).then((response) => {
                console.log(response);
                this.optionsMedioPago = response.data;
            });
        },

        TraerReservaDia() {
            this.formbuscar.id_sucursal = this.sucursal.id_sucursal;

            this.axios
                .post(`/api/traerreservadia`, this.formbuscar)
                .then((res) => {
                    console.log(res);
                    this.tableData = res.data;
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },

        formBuscar() {
            this.submitted = true;
            this.$v.formbuscar.$touch();
            if (!this.$v.formbuscar.$invalid) {
                this.formbuscar.id_sucursal = this.sucursal.id_sucursal;

                this.axios
                    .post(`/api/buscarreserva`, this.formbuscar)
                    .then((res) => {
                        this.tableData = res.data;
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            }
        },
        confirmar(data) {
            this.modal = true;
            this.cambiarprevision.id_paciente = data.paciente.id_paciente;
            this.cambiarprevision.id_prevision = data.paciente.prevision;
            this.nombrepaciente = `${data.paciente.nombres} ${data.paciente.apellidos}`;
            this.emailpaciente = `${data.paciente.email}`;
            this.rutpaciente = `${data.paciente.rut}`;
            this.nombreeprofesional = `${data.profesional.nombres} ${data.profesional.apellidos}`;
            this.nombreservicio = data.servicio.nombre;
            this.servicioprevision = data.paciente.prevision.nombre;
            this.serviciopacienteseleccionado = data.servicio;

            if (data.paciente.prevision.nombre == "Fonasa") {
                if (data.servicio.precio_fonasa) {
                    this.precioservicio = data.servicio.precio_fonasa;
                } else {
                    this.precioservicio = data.servicio.precio_particular;
                }
            } else if (data.paciente.prevision.nombre == "Particular") {
                this.precioservicio = data.servicio.precio_particular;
            } else {
                if (data.servicio.precio_isapre) {
                    this.precioservicio = data.servicio.precio_isapre;
                } else {
                    this.precioservicio = data.servicio.precio_particular;
                }
            }

            this.formventa.subtotal = this.precioservicio;

            let descuento =
                (this.formventa.subtotal * this.formventa.porcentajedescuento) /
                100;
            this.formventa.id_reserva = data.id_reserva;
            this.formventa.id_paciente = data.paciente_id;
            this.formventa.precio_descuento =
                this.formventa.subtotal - descuento;

            let iva = this.formventa.precio_descuento * 0.19;

            this.formventa.iva = iva;

            this.formventa.total = this.formventa.precio_descuento + iva;
        },
        cambiarPrevision() {
            this.axios
                .post(`/api/cambiarprevisionpaciente`, this.cambiarprevision)
                .then((res) => {
                    console.log(res);
                    let titulo = "";
                    let icono = "";
                    if (res.data == 1) {
                        titulo = "Previsión cambiada con éxito";
                        icono = "success";
                    } else {
                        titulo = "Error al cambiar la previsión";
                        icono = "success";
                    }
                    this.sweealerta(icono, titulo);
                    this.calculo();
                    this.cambiarprecio();
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        calculo() {
            let descuento =
                (this.formventa.subtotal * this.formventa.porcentajedescuento) /
                100;
            this.formventa.precio_descuento =
                this.formventa.subtotal - descuento;

            let iva = this.formventa.precio_descuento * 0.19;

            this.formventa.iva = iva;

            this.formventa.total = this.formventa.precio_descuento + iva;
        },
        cambiarprecio() {
            this.servicioprevision = this.cambiarprevision.id_prevision.nombre;

            if (this.cambiarprevision.id_prevision.nombre == "Fonasa") {
                if (this.serviciopacienteseleccionado.precio_fonasa) {
                    this.precioservicio =
                        this.serviciopacienteseleccionado.precio_fonasa;
                } else {
                    this.precioservicio =
                        this.serviciopacienteseleccionado.precio_particular;
                }
            } else if (
                this.cambiarprevision.id_prevision.nombre == "Particular"
            ) {
                this.precioservicio =
                    this.serviciopacienteseleccionado.precio_particular;
            } else {
                if (this.serviciopacienteseleccionado.precio_isapre) {
                    this.precioservicio =
                        this.serviciopacienteseleccionado.precio_isapre;
                } else {
                    this.precioservicio =
                        this.serviciopacienteseleccionado.precio_particular;
                }
            }

            this.formventa.subtotal = this.precioservicio;

            let descuento =
                (this.formventa.subtotal * this.formventa.porcentajedescuento) /
                100;

            this.formventa.precio_descuento =
                this.formventa.subtotal - descuento;

            let iva = this.formventa.precio_descuento * 0.19;

            this.formventa.iva = iva;

            this.formventa.total = this.formventa.precio_descuento + iva;
        },

        formSubmit() {
            this.submittedventa = true;

            if (!this.formventa.mediopago || !this.formventa.estado ) {
                return;
            }
            this.formventa.id_sucursal = this.sucursal.id_sucursal;

            this.axios
                .post(`/api/confirmarreserva`, this.formventa)
                .then((res) => {
                    console.log(res);

                    let titulo = "";
                    let icono = "";
                    if (res.data == 1) {
                        titulo = "Reserva confirmada con éxito";
                        icono = "success";
                    } else {
                        titulo = "Error al confirmar la reserva ";
                        icono = "error";
                    }
                    (this.modal = false),
                        (this.cambiarprevision = {
                            id_paciente: "",
                            id_prevision: "",
                        }),
                        (this.formventa = {
                            id_reserva: "",
                            mediopago: "",
                            subtotal: 0,
                            porcentajedescuento: 0,
                            precio_descuento: 0,
                            iva: 0,
                            total: 0,
                            codigo_boucher: "",
                            codigo_bono_fonasa: "",
                            boleta_honorario: "",
                            n_honorario: "",
                        }),
                        this.sweealerta(icono, titulo);
                        this.TraerReservaDia();


                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        eliminar(data){

            let id_reserva = data.id_reserva

            Swal.fire({
                title: 'Eliminar Reserva',
                text: '¿La reserva será eliminada permanentemente, está seguro de eliminarla?',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Si",
              }).then((result) => {
                if (result.value) {
                  this.axios
                    .delete(
                      `/api/deletereserva/${id_reserva}`
                    )
                    .then((res) => {
                        var titulo = "";
                        var icon = "";

                      if (res.data == 1) {
                         titulo = "Reserva eliminada con éxito";
                         icon = "success";
                      } else {
                         titulo = "Error al eliminar la reserva";
                         icon = "error";
                      }

                      this.sweealerta(icon, titulo);

                      this.TraerReservaDia();
                    });
                }
              });

        },
        sweealerta(icon, titulo) {
            Swal.fire({
                position: "center",
                icon: icon,
                title: titulo,
                showConfirmButton: false,
                timer: 2000,
            });
        },
    },
};
