import Layout from "../../layouts/main";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import moment from "moment";
import countTo from "vue-count-to";

import { required } from "vuelidate/lib/validators";

export default {
    components: { Layout, Multiselect, countTo },

    data() {
        return {
            sucursal: JSON.parse(localStorage.getItem("sucursalselect")),
            formbuscar: {
                fecha: "",
                especialidad_id: "",
            },
            submitted: false,
            modal: false,
            options: [],
            totalventas: 0,
            cantidadventas: 0,
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
                    key: "codigo",
                    label: "Codigo Reserva",
                    sortable: true,
                },
                {
                    key: "nombres_paciente",
                    sortable: true,
                    label: "Paciente",
                },
                {
                    key: "nombres_profesional",
                    sortable: true,
                    label: "Profesional",
                },
                {
                    key: "nombre_servicio",
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
                    key: "fecha_venta",
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
        this.traerEspecialidad();
        this.formbuscar.fecha = moment().format("YYYY-MM-DD");
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },

        traerEspecialidad() {
            this.axios.get(`/api/obtenerespecialidad/`).then((response) => {
                this.options = response.data;
            });
        },

        // traerVentas() {
        //     this.axios
        //         .get(`/api/obtenerventas/${this.sucursal.id_sucursal}`)
        //         .then((response) => {
        //             console.log(response);
        //             this.tableData = response.data;
        //         });
        // },
        formBuscar() {
            if (!this.sucursal) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Debes seleccionar una sucursal",
                    showConfirmButton: false,
                    timer: 1000,
                });

                return;
            }

            this.submitted = true;
            this.$v.formbuscar.$touch();
            if (!this.$v.formbuscar.$invalid) {
                this.formbuscar.id_sucursal = this.sucursal.id_sucursal;

                this.axios
                    .post(`/api/buscarinformediario`, this.formbuscar)
                    .then((res) => {
                        console.log(res);
                        if (res.data) {
                            let total = 0;
                            res.data.forEach((element) => {
                                total = total + element["total"];
                            });
                            this.totalventas = total;
                            this.cantidadventas = res.data.length;
                        }

                        this.tableData = res.data;
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            }
        },
        ver(data) {
            console.log(data);
            this.detalle.nombrepaciente = `${data.nombres_paciente} ${data.apellidos_paciente}`;
            this.detalle.rutpaciente = data.rut_paciente;
            this.detalle.emailpaciente = data.email_paciente;
            this.detalle.nombreeprofesional = `${data.nombres_profesional} ${data.apellidos_profesional}`;
            this.detalle.nombreservicio = data.nombre_servicio;
            this.formaccion.id_reserva = data.id_reserva;
            this.formaccion.id_venta = data.id_venta;

            if (data.prevension_nombre == "Fonasa") {
                if (data.precio_fonasa) {
                    this.detalle.precioservicio = parseInt(data.precio_fonasa);
                } else {
                    this.detalle.precioservicio = parseInt(
                        data.recio_particular
                    );
                }
            } else if (data.prevension_nombre == "Particular") {
                this.detalle.precioservicio = parseInt(data.recio_particular);
            } else {
                if (data.precio_isapre) {
                    this.detalle.precioservicio = parseInt(data.precio_isapre);
                } else {
                    this.detalle.precioservicio = parseInt(
                        data.recio_particular
                    );
                }
            }

            this.detalle.servicioprevision = data.prevension_nombre;
            this.detalle.mediopago = data.mediopago;
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
            this.modal = true;
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
