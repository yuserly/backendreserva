import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import Multiselect from "vue-multiselect";
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import Layout from "../../layouts/main";
import { calendarEvents, categories } from "./data-calendar";

export default {
    components: { FullCalendar, Layout, Multiselect },
    data() {
        return {
            title: "Reserva",
            items: [
                {
                    text: "Minible"
                },
                {
                    text: "Reserva",
                    active: true
                }
            ],
            calendarEvents: [],
            calendarOptions: {
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay,listWeek"
                },
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    bootstrapPlugin,
                    listPlugin
                ],
                initialView: "timeGridDay",
                slotDuration: "00:15:00",
                slotMinTime: "12:00:00",
                slotMaxTime: "19:00:00",
                slotLabelInterval: "00:05:00",
                themeSystem: "bootstrap",
                disableResizing: true,
                events: calendarEvents,
                editable: true,
                droppable: true,
                eventResizableFromStart: false,
                dateClick: false,
                eventClick: this.editEvent,
                eventsSet: this.handleEvents,
                eventLimit: true,
                view: {
                    timeGrid: {
                        eventLimit: 1
                    },
                    agenda: {
                        eventLimit: 1
                    }
                },
                eventOverlap: false,
                eventDrop: this.move,
                weekends: true,
                selectable: false,
                selectMirror: false,
                dayMaxEvents: true
            },
            urlbackend: this.$urlBackend,
            sucursal: JSON.parse(localStorage.getItem("sucursalselect")),
            form: {
                id_reserva: "",
                especialidad_id: "",
                servicio_id_servicio: "",
                id_profesional: "",
                nombres: "",
                apellidos: "",
                id_paciente: "",
                email: "",
                celular: "",
                direccion: "",
                rut: "",
                prevension_id: "",
                dia: "",
                hora_inicio: "",
                hora_fin: "",
                codigo: "",
                editservicio: "",
                editespecialidad: "",
                id_sucursal: ""
            },

            rutexist: false,
            options: [],
            optionsServicio: [],
            optionsProfesional: [],
            optionsPrevension: [],
            currentEvents: [],
            duracion: "",
            showModal: false,
            eventModal: false,
            categories: categories,
            submitted: false,
            submit: false,
            newEventData: {},
            edit: {},
            deleteId: {},
            event: {
                title: "",
                category: ""
            },
            editevent: {
                editTitle: "",
                editcategory: ""
            }
        };
    },
    validations: {
        form: {
            nombres: {
                required
            },
            rut: {
                required
            },
            apellidos: {
                required
            },
            email: {
                required
            },
            celular: {
                required
            },
            direccion: {
                required
            },
            prevension_id: {
                required
            }
        }
    },
    mounted() {
        this.traerEspecialidad();
        this.traerPrevision();
    },
    methods: {
        // label optionsProfesional
        customLabel({ profesional }) {
            return `${profesional.nombres} ${profesional.apellidos} `;
        },

        traerPrevision() {
            this.axios.get(`/api/obtenerprevision/`).then(response => {
                this.optionsPrevension = response.data;
            });
        },
        validarRut($event) {
            if ($event.target.value.length > 4) {
                this.axios
                    .get(`/api/validarrutpaciente/${$event.target.value}`)
                    .then(response => {
                        if (response.data != 0) {
                            this.form.nombres = response.data.nombres;
                            this.form.apellidos = response.data.apellidos;
                            this.form.id_paciente = response.data.id_paciente;
                            this.form.rut = response.data.rut;
                            this.form.email = response.data.email;
                            this.form.direccion = response.data.direccion;
                            this.form.celular = response.data.celular;
                            this.form.prevension_id = response.data.prevision;
                        } else {
                            this.rutexist = false;
                        }
                    });
            }
        },

        // crear reserva
        handleSubmit(e) {
            this.submitted = true;

            console.log(e);

            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            } else {
                const titlereserva = `${this.form.nombres} ${this.form.apellidos}`;
                let calendarApi = this.newEventData.view.calendar;
                let fecha_fin = "";

                let fecha_inicio = "";

                if (this.form.id_reserva == "") {
                    fecha_fin = moment(this.newEventData.date)
                        .add(this.duracion, "m")
                        .format("YYYY-MM-DD HH:mm:ss");
                    fecha_inicio = moment(this.newEventData.date).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );

                    // fechas que se pasaran a la bd

                    this.form.dia = moment(this.newEventData.date).format(
                        "YYYY-MM-DD"
                    );

                    this.form.hora_inicio = moment(fecha_inicio).format(
                        "HH:mm:ss"
                    );

                    this.form.hora_fin = moment(fecha_fin).format("HH:mm:ss");
                }

                // mandamos a crear la reserva

                this.form.id_sucursal = this.sucursal.id_sucursal;

                console.log(this.form);

                this.axios
                    .post(`/api/crearreservaprofesional`, this.form)
                    .then(res => {
                        let title = "";
                        let message = "";
                        let type = "";
                        if (res.data) {
                            if (this.form.id_reserva == "") {
                                title = "Crear reserva";
                                message = "reserva creada con exito";
                                type = "success";
                            } else {
                                title = "Editar reserva";
                                message = "reserva editada con exito";
                                type = "success";
                            }

                            this.currentEvents = calendarApi.addEvent({
                                id: res.data.id_reserva,
                                title: titlereserva,
                                start: fecha_inicio,
                                end: fecha_fin,
                                classNames: "bg-info text-white"
                            });
                            this.showModal = false;
                            this.newEventData = {};
                            this.successmsg(title, message, type);
                            this.$v.form.$reset();
                        }
                    })
                    .catch(error => {
                        console.log("error", error);

                        let title = "";
                        let message = "";
                        let type = "";

                        if (this.form.id_reserva) {
                            title = "Crear Reserva";
                            message = "Reserva  creada con exito";
                            type = "error";
                        } else {
                            title = "Editar Reserva";
                            message = "Reserva editada con exito";
                            type = "error";
                        }
                        this.$v.form.$reset();
                        this.showModal = false;
                        this.newEventData = {};

                        this.successmsg(title, message, type);
                    });
            }
            this.vaciarform();
            this.submitted = false;
            this.event = {};
        },
        move(info) {
            let idreserva = info.event._def.extendedProps.idreserva;

            let hora_sinformat = info.event.start;

            let fecha_fin = moment(hora_sinformat)
                .add(this.duracion, "m")
                .format("YYYY-MM-DD HH:mm:ss");
            let fecha_inicio = moment(hora_sinformat).format(
                "YYYY-MM-DD HH:mm:ss"
            );

            // fechas que se pasaran a la bd

            let nuevadata = {
                id_reserva: idreserva,
                dia: moment(hora_sinformat).format("YYYY-MM-DD"),
                hora_inicio: moment(fecha_inicio).format("HH:mm:ss"),
                hora_fin: moment(fecha_fin).format("HH:mm:ss")
            };

            this.axios
                .post(`/api/editarreserva`, nuevadata)
                .then(res => {
                    let title = "Editar Reserva";
                    let message = "Reserva Editada con Exito";
                    let type = "Success";
                    if (res.data) {
                        this.successmsg(title, message, type);
                    }
                })
                .catch(error => {
                    console.log("error", error);

                    let title = "Editar Reserva";
                    let message = "Error al editar la reserva";
                    let type = "error";

                    this.successmsg(title, message, type);
                });
        },
        // eslint-disable-next-line no-unused-vars
        hideModal(e) {
            this.submitted = false;
            this.showModal = false;
            this.event = {};
        },
        /**
         * Edit event modal submit
         */
        // eslint-disable-next-line no-unused-vars
        editSubmit(e) {
            console.log("aqui");
            this.submit = true;
            const editTitle = this.editevent.editTitle;
            const editcategory = this.editevent.editcategory;

            this.edit.setProp("title", editTitle);
            this.edit.setProp("classNames", editcategory);
            this.successmsg();
            this.eventModal = false;
        },

        /**
         * Delete event
         */
        deleteEvent() {
            this.axios
                .delete(`/api/deletereserva/${this.form.id_reserva}`)
                .then(response => {
                    if (response.data == 1) {
                        this.deleteId.el.remove();
                        Swal.fire(
                            "Eliminar Reserva",
                            "Reserva eliminada.",
                            "success"
                        );
                    } else {
                        Swal.fire(
                            "Eliminar Reserva",
                            "Error al elimar la reserva.",
                            "error"
                        );
                    }
                    this.showModal = false;
                });
        },

        vaciarform() {
            this.form.id_reserva = "";
            this.form.nombres = "";
            this.form.apellidos = "";
            this.form.id_paciente = "";
            this.form.email = "";
            this.form.celular = "";
            this.form.direccion = "";
            this.form.rut = "";
            this.form.prevension_id = "";
            this.form.codigo = "";
            this.form.dia = "";
            this.form.hora_inicio = "";
            this.form.hora_fin = "";
            // para no modificar los select
            this.form.editservicio = "";
            this.form.editespecialidad = "";
        },

        dateClicked(info) {
            var form = {
                dia: moment(info.date).format("YYYY-MM-DD"),
                hora: moment(info.date).format("HH:mm:ss"),
                id_sucursal: this.sucursal.id_sucursal
            };

            this.axios
                .post(`/api/validarhoraprofesional`, form)
                .then(res => {
                    console.log(res);

                    if (res.data == 1) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Bloque reservado",
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else {
                        this.newEventData = info;
                        if (this.form.id_reserva == "") {
                            this.vaciarform();
                        }

                        this.showModal = true;
                    }
                })
                .catch(error => {
                    console.log("error", error);
                });
        },
        /**
         * Modal open for edit event
         */
        editEvent(info) {
            // Evaluamos si es una reserva o un horario no disponible
            if (info.event.title != "NO DISPONIBLE") {
                this.deleteId = info;
                // buscamos los datos del paciente no vamos a modificar horario

                var idreserva = info.event._def.extendedProps.idreserva;

                this.axios
                    .get(`/api/traerreserva/${idreserva}`)
                    .then(response => {
                        console.log(response);
                        this.form.id_reserva = response.data.id_reserva;
                        this.form.nombres = response.data.paciente.nombres;
                        this.form.apellidos = response.data.paciente.apellidos;
                        this.form.id_paciente =
                            response.data.paciente.id_paciente;
                        this.form.email = response.data.paciente.email;
                        this.form.celular = response.data.paciente.celular;
                        this.form.direccion = response.data.paciente.direccion;
                        this.form.rut = response.data.paciente.rut;
                        this.form.prevension_id =
                            response.data.paciente.prevision;
                        this.form.codigo = response.data.codigo;
                        this.form.dia = response.data.dia;
                        this.form.hora_inicio = response.data.hora_inicio;
                        this.form.hora_fin = response.data.hora_fin;
                        // para no modificar los select
                        this.form.editservicio = response.data.servicio;
                        this.form.editespecialidad =
                            response.data.servicio.especialidad;

                        this.dateClicked(info);
                    });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title:
                        "No puedes editar un horario no disponible desde el calendario",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        },

        closeModal() {
            this.showModal = false;
            this.vaciarform();
        },

        confirm() {
            Swal.fire({
                title: "Eliminar Reserva",
                text: "Está seguro de eliminar esta reserva?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Si eliminar"
            }).then(result => {
                if (result.value) {
                    this.deleteEvent();
                }
            });
        },

        /**
         * Show list of events
         */
        handleEvents(events) {
            this.currentEvents = events;
        },

        /**
         * Show successfull Save Dialog
         */
        successmsg() {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Event has been saved",
                showConfirmButton: false,
                timer: 1000
            });
        },
        // traer especialidad
        traerEspecialidad() {
            this.axios.get(`/api/obtenerespecialidad/`).then(response => {
                this.options = response.data;
            });
        },

        // traer servicios
        traerServicio() {
            if (!this.sucursal) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Debes seleccionar una sucursal",
                    showConfirmButton: false,
                    timer: 1000
                });

                return;
            }
            this.calendarOptions.events = [{}];
            (this.form.servicio_id_servicio = ""),
                (this.form.id_profesional = "");
            var id_especialidad = this.form.especialidad_id.id_especialidad;

            var id_sucursal = this.sucursal.id_sucursal;
            this.axios
                .get(`/api/obtenerserviciosprofesional/${id_especialidad}/${id_sucursal}`)
                .then(response => {
                    console.log(response)
                    this.form.id_profesional = response.data[0].profesional_id_profesional
                    this.optionsServicio = response.data;
                    this.duracion = this.form.especialidad_id.intervalo;
                });
        },

        traerHoras() {
            this.calendarOptions.events = [{}];
            var date = new Date();

            // obtemos el dia de la semana

            var diasemana = date.getDay();

            var form = {
                diasemana: diasemana
            };

            console.log(form)

            this.axios
                .post(`/api/traerhorariounico`, form)
                .then(res => {
                    console.log(res);
                    if (res.data.horario) {
                        this.calendarOptions.slotMinTime =
                            res.data.horario.hora_inicio;
                        this.calendarOptions.slotMaxTime =
                            res.data.horario.hora_fin;
                        this.calendarOptions.slotDuration = this.duracion;
                        this.calendarOptions.dateClick = this.dateClicked;
                    } else {
                        this.calendarOptions.slotMinTime = "00:00:00";
                        this.calendarOptions.slotMaxTime = "00:00:00";
                        this.calendarOptions.dateClick = false;
                    }

                    if (res.data.bloqueo) {
                        for (let i = 0; i < res.data.bloqueo.length; i++) {
                            let dia = res.data.bloqueo[i]["dia"];

                            let fecha_inicio =
                                res.data.bloqueo[i]["hora_inicio"];

                            let fecha_fin = res.data.bloqueo[i]["hora_fin"];

                            let fecha_comple_inicio = moment(
                                dia + " " + fecha_inicio
                            ).format("YYYY-MM-DD HH:mm:ss");

                            let fecha_comple_fin = moment(
                                dia + " " + fecha_fin
                            ).format("YYYY-MM-DD HH:mm:ss");

                            this.calendarOptions.events.push({
                                id: "",
                                title: "NO DISPONIBLE",
                                start: fecha_comple_inicio,
                                end: fecha_comple_fin,
                                classNames: "bg-danger text-white",
                                editable: false
                            });
                        }
                    }

                    if (res.data.reserva) {
                        for (let i = 0; i < res.data.reserva.length; i++) {
                            let dia = res.data.reserva[i]["dia"];

                            let fecha_inicio =
                                res.data.reserva[i]["hora_inicio"];

                            let fecha_fin = res.data.reserva[i]["hora_fin"];

                            let fecha_comple_inicio = moment(
                                dia + " " + fecha_inicio
                            ).format("YYYY-MM-DD HH:mm:ss");

                            let fecha_comple_fin = moment(
                                dia + " " + fecha_fin
                            ).format("YYYY-MM-DD HH:mm:ss");

                            this.calendarOptions.events.push({
                                idreserva: res.data.reserva[i]["id_reserva"],
                                idpaciente: res.data.reserva[i]["paciente_id"],
                                title: "RESERVADO",
                                start: fecha_comple_inicio,
                                end: fecha_comple_fin,
                                classNames: "bg-info text-white"
                            });
                        }
                    }
                })
                .catch(error => {
                    console.log("error", error);
                });
        }
    }
};
