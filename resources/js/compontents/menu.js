import Vue from "vue";
let dashboard = true;
let administración = false;
let especialidades = false;
let servicios = false;
let sucursales = false;
let secretarias = false;
let previsiones = false;
let profesionales = false;
let bloqueohora = false;
let pacientes = false;
let reservas = false;
let misreservas = false;
let ventas = false;
let confirmarreserva = false;
let administraciónReserva = false;
let informediario = false;

if (Vue.prototype.$administrador) {

    administración = true;
    administraciónReserva = true;
    especialidades = true;
    servicios = true;
    sucursales = true;
    secretarias = true;
    previsiones = true;
    profesionales = true;
    bloqueohora = true;
    pacientes = true;
    reservas = true;
    ventas =true;
    confirmarreserva = true;
    informediario = true;
} else if(Vue.prototype.$secretaria){

    administraciónReserva = true;
    pacientes = true;
    reservas = true;
    ventas =true;
    confirmarreserva = true;

}else {
    pacientes = true;
    misreservas = true;
}

export const menuItems = [
    {
        id: 0,
        label: "Administración",
        isTitle: true,
        permiso: administración
    },
    {
        id: 1,
        label: "Dashboard",
        icon: "uil-home-alt",
        link: "/",
        permiso: dashboard
    },
    {
        id: 2,
        label: "Administración",
        icon: "fas fa-users",
        permiso: administración,
        subItems: [
            {
                id: 1.1,
                label: "Especialidades",
                link: "/especialidades",
                parentId: 2,
                permiso: especialidades
            },
            {
                id: 1.2,
                label: "Servicios",
                link: "/servicios",
                parentId: 2,
                permiso: servicios
            },
            {
                id: 1.3,
                label: "Sucursales",
                link: "/sucursales",
                parentId: 2,
                permiso: sucursales
            },
            {
                id: 1.4,
                label: "Secretarias",
                link: "/secretarias",
                parentId: 2,
                permiso: secretarias
            },
            {
                id: 1.5,
                label: "Previsiones",
                link: "/previsiones",
                parentId: 2,
                permiso: previsiones
            },
            {
                id: 1.6,
                label: "Profesionales",
                link: "/profesionales",
                parentId: 2,
                permiso: profesionales
            },
            {
                id: 1.7,
                label: "Bloqueo Horas",
                link: "/bloqueo-hora",
                parentId: 2,
                permiso: bloqueohora
            }
        ]
    },

    {
        id: 3,
        label: "Reservas",
        icon: "fas fa-users",
        permiso: administraciónReserva,
        subItems: [
            {
                id: 1.1,
                label: "Pacientes",
                link: "/pacientes",
                parentId: 3,
                permiso: pacientes
            },
            {
                id: 1.2,
                label: "Ingresar Reservas",
                link: "/reservas",
                parentId: 3,
                permiso: reservas
            },
            {
                id: 1.2,
                label: "Mis Reservas",
                link: "/misreservas",
                parentId: 3,
                permiso: misreservas
            },
            {
                id: 1.3,
                label: "Confirmar Reserva",
                link: "/confirmar-reserva",
                parentId: 3,
                permiso: confirmarreserva
            }
        ]
    },
    {
        id: 4,
        label: "Ventas",
        icon: "uil-usd-square",
        link: "/ventas",
        permiso: ventas
    },
    {
        id: 5,
        label: "Informes",
        icon: "uil-arrow-growth",
        permiso: informediario,
        subItems: [
            {
                id: 5.1,
                label: "Informe diario",
                link: "/informe-diario",
                parentId: 5,
                permiso: informediario
            },
            {
                id: 5.2,
                label: "Informe Mensual",
                link: "/informe-mensual",
                parentId: 5,
                permiso: reservas
            }
        ]
    },

];
