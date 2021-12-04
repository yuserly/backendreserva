import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import moment from "moment";

import { required } from "vuelidate/lib/validators";

export default {
    components: { Layout, Multiselect },

    data() {
        return {
            sucursal: JSON.parse(localStorage.getItem("sucursalselect")),
            formbuscar: {
                fecha: "",
            },
            submitted: false,
            modal: false,
            detalle: {
                nombrepaciente: "",
                rutpaciente: "",
                emailpaciente: "",
                nombreeprofesional: "",
                nombreservicio: "",
                precioservicio: "",
                servicioprevision: "",
                serviciopacienteseleccionado: "",
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
                estado: "",
                estado_id: "",
                telemedicina: "",
            },
            formaccion: {
                id_reserva: "",
                id_venta: "",
                estado: "",
            },

            // tabla
            tableData: [],

            title: "Ventas",
            items: [
                {
                    text: "Tables",
                },
                {
                    text: "Ventas",
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
                    key: "reserva.codigo",
                    label: "Codigo Reserva",
                    sortable: true,
                },
                {
                    key: "reserva.paciente",
                    sortable: true,
                    label: "Paciente",
                    formatter: (paciente) => {
                        return `${paciente.nombres} ${paciente.apellidos}`;
                    },
                },
                {
                    key: "reserva.profesional",
                    sortable: true,
                    label: "Profesional",
                    formatter: (profesional) => {
                        return `${profesional.nombres} ${profesional.apellidos}`;
                    },
                },
                {
                    key: "reserva.servicio.nombre",
                    sortable: true,
                    label: "Servicio",
                },
                {
                    key: "total",
                    label: "Total",
                    sortable: true,
                    formatter: (total) => {
                        var formatter = new Intl.NumberFormat("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                        });
                        return formatter.format(total);
                    },
                },
                {
                    key: "created_at",
                    label: "Fecha",
                    sortable: true,
                    formatter: (created_at) => {
                        var fecha = moment(created_at).format(
                            "DD/MM/YYYY - h:mm A"
                        );
                        return fecha;
                    },
                },
                "action",
            ],
        };
    },
    validations: {
        formbuscar: {
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
        this.traerVentas();
        this.formbuscar.fecha = moment().format("YYYY-MM-DD");
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },

        traerVentas() { 
            this.axios
                .get(`/api/obtenerventas/${this.sucursal.id_sucursal}`)
                .then((response) => {
                    this.tableData = response.data; 
                });
        },
        formBuscar() {
            this.submitted = true;
            this.$v.formbuscar.$touch();
            if (!this.$v.formbuscar.$invalid) {
                this.formbuscar.id_sucursal = this.sucursal.id_sucursal;

                this.axios
                    .post(`/api/buscarventafecha`, this.formbuscar)
                    .then((res) => {
                        console.log(res);
                        this.tableData = res.data;
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            }
        },
        ver(data) {
            console.log(data);
            this.detalle.nombrepaciente = `${data.reserva.paciente.nombres} ${data.reserva.paciente.apellidos}`;
            this.detalle.rutpaciente = data.reserva.paciente.rut;
            this.detalle.emailpaciente = data.reserva.paciente.email;
            this.detalle.nombreeprofesional = `${data.reserva.profesional.nombres} ${data.reserva.profesional.apellidos}`;
            this.detalle.nombreservicio = data.reserva.servicio.nombre;
            this.formaccion.id_reserva = data.reserva_id;
            this.formaccion.id_venta = data.id_venta;

            if (data.reserva.paciente.prevision.nombre == "Fonasa") {
                if (data.reserva.servicio.precio_fonasa) {
                    this.detalle.precioservicio = parseInt(
                        data.reserva.servicio.precio_fonasa
                    );
                } else {
                    this.detalle.precioservicio = parseInt(
                        data.reserva.servicio.precio_particular
                    );
                }
            } else if (data.reserva.paciente.prevision.nombre == "Particular") {
                this.detalle.precioservicio = parseInt(
                    data.reserva.servicio.precio_particular
                );
            } else {
                if (data.reserva.servicio.precio_isapre) {
                    this.detalle.precioservicio = parseInt(
                        data.reserva.servicio.precio_isapre
                    );
                } else {
                    this.detalle.precioservicio = parseInt(
                        data.reserva.servicio.precio_particular
                    );
                }
            }

            if(data.reserva.telemedicina == 1)
            {
                this.detalle.telemedicina = "Telemedicina";
            }else if(data.reserva.telemedicina == 0)
            {
                this.detalle.telemedicina = "Presencial";
            }

            this.detalle.servicioprevision =
                data.reserva.paciente.prevision.nombre;
            this.detalle.mediopago = data.medio.nombre;
            this.detalle.subtotal = data.sub_total;
            if (data.porcentaje_desc) {
                this.detalle.porcentajedescuento = data.porcentaje_desc;
            } else {
                this.detalle.porcentajedescuento = 0;
            }
            this.detalle.precio_descuento = data.precio_desc;
            this.detalle.iva = data.iva;
            this.detalle.total = data.total;
            this.detalle.codigo_boucher = data.codigo_boucher;
            this.detalle.codigo_bono_fonasa = data.codigo_bono_fonasa;
            this.detalle.boleta_honorario = data.boleta_honorario;
            this.detalle.n_honorario = data.n_honorario;
            this.detalle.estado = data.estado.nombre;
            this.detalle.estado_id = data.estado.id_estado;
            this.modal = true;
        },
        accion(data) {
            this.formaccion.estado = data;

            Swal.fire({
                title: "Cambiar estado de Pago",
                text: "¿Estás seguro de cambiar el estado de pago? esta acción podría ocasionar cambios en la reserva",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Si",
            }).then((result) => {
                if (result.value) { 
                    this.axios
                        .post(`/api/cambiarestadoventa`, this.formaccion)
                        .then((res) => {
                            var titulo = " ";
                            var icon = "";

                            if (res.data == 1) {
                                titulo =
                                    "Estado de la venta modificada con éxito";
                                icon = "success";
                            } else {
                                titulo =
                                    "Error al modificar el estado de la venta";
                                icon = "error";
                            }

                            this.sweealerta(icon, titulo);
                            this.modal = false;

                            this.traerVentas();
                        });
                }
            });
        },

        eliminar(data){

            this.formaccion = {
                id_reserva: data.reserva_id,
                id_venta: data.id_venta,
                estado: 7,
            },

            Swal.fire({
                title: 'Eliminar Venta',
                text: '¿Está seguro de eliminar esta venta? esta acción podría ocasionar cambios en la reserva',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Si",
              }).then((result) => {
                if (result.value) {
                  this.axios
                    .post(
                      `/api/eliminarventa/`, this.formaccion
                    )
                    .then((res) => {p
                        Swal.fire({
                            icon: 'error',
                            text: res.data,
                            timer: 1500,
                            showConfirmButton: false
                          });
                      this.traerVentas();
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
