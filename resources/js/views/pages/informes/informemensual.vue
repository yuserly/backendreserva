<script src="./informemensual.js"></script>

<template>
    <Layout>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-6">
                            <h5>Informe diario</h5>
                        </div>
                        <div class="col-12 mt-3">
                            <form
                                class="
                                    needs-validation
                                    row row-cols-lg-6
                                    gx-4
                                    gy-2
                                    align-items-center
                                "
                                @submit.prevent="formBuscar()"
                            >
                                <div class="col-12">
                                    <label class="visually-hidden" for="fecha"
                                        >FECHA</label
                                    >
                                    <date-picker v-model="formbuscar.fecha" range append-to-body lang="es" confirm :class="{
                                            'is-invalid':
                                                submitted &&
                                                $v.formbuscar.fecha.$error,
                                        }"></date-picker>

                                    <div
                                        v-if="
                                            submitted &&
                                            $v.formbuscar.fecha.$error
                                        "
                                        class="invalid-feedback"
                                    >
                                        <span
                                            v-if="!$v.formbuscar.fecha.required"
                                            >El Fecha es requerido.</span
                                        >
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="visually-hidden" for="fecha"
                                        >Especialidad</label
                                    >
                                    <multiselect
                                        v-model="formbuscar.especialidad_id"
                                        :options="options"
                                        track-by="id_especialidad"
                                        label="nombre"
                                    ></multiselect>
                                </div>
                                <div class="col-12">
                                    <button
                                        type="submit"
                                        class="btn btn-primary"
                                    >
                                        Buscar
                                    </button>
                                </div>
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="float-end mt-2">
                                                <div
                                                    class="
                                                        avatar-sm
                                                        mx-auto
                                                        mb-4
                                                    "
                                                >
                                                    <span
                                                        class="
                                                            avatar-title
                                                            rounded-circle
                                                            bg-soft-success
                                                            font-size-24
                                                        "
                                                    >
                                                        <i
                                                            class="
                                                                uil-dollar-sign
                                                                text-success
                                                            "
                                                        ></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="mb-1 mt-1">
                                                    $
                                                    <span
                                                        data-plugin="counterup"
                                                    >
                                                        <countTo
                                                            :startVal="0"
                                                            :endVal="
                                                                totalventas
                                                            "
                                                            :duration="1000"
                                                        ></countTo>
                                                    </span>
                                                </h4>
                                                <p class="text-muted mb-0">
                                                    Total Ventas
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="float-end mt-2">
                                                <div
                                                    class="
                                                        avatar-sm
                                                        mx-auto
                                                        mb-4
                                                    "
                                                >
                                                    <span
                                                        class="
                                                            avatar-title
                                                            rounded-circle
                                                            bg-soft-primary
                                                            font-size-24
                                                        "
                                                    >
                                                        <i
                                                            class="
                                                                uil-chart-bar
                                                                text-primary
                                                            "
                                                        ></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 class="mb-1 mt-1">
                                                    <span
                                                        data-plugin="counterup"
                                                    >
                                                        <countTo
                                                            :startVal="0"
                                                            :endVal="
                                                                cantidadventas
                                                            "
                                                            :duration="1000"
                                                        ></countTo>
                                                    </span>
                                                </h4>
                                                <p class="text-muted mb-0">
                                                    Cantidad Ventas
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div
                                    id="tickets-table_length"
                                    class="dataTables_length"
                                >
                                    <label
                                        class="d-inline-flex align-items-center"
                                    >
                                        Mostrar&nbsp;
                                        <b-form-select
                                            v-model="perPage"
                                            size="sm"
                                            :options="pageOptions"
                                        ></b-form-select
                                        >&nbsp;entradas
                                    </label>
                                </div>
                            </div>
                            <!-- Search -->
                            <div class="col-sm-12 col-md-6">
                                <div
                                    id="tickets-table_filter"
                                    class="dataTables_filter text-md-end"
                                >
                                    <label
                                        class="d-inline-flex align-items-center"
                                    >
                                        Buscar:
                                        <b-form-input
                                            v-model="filter"
                                            type="search"
                                            placeholder="Buscar..."
                                            class="
                                                form-control form-control-sm
                                                ms-2
                                            "
                                        ></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                        </div>

                        <div class="table-responsive mb-0">
                            <b-table
                                :items="tableData"
                                :fields="fields"
                                responsive="sm"
                                :per-page="perPage"
                                :current-page="currentPage"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                :filter="filter"
                                :filter-included-fields="filterOn"
                                @filtered="onFiltered"
                            >
                                <template v-slot:cell(action)="data">
                                    <ul class="list-inline mb-0">
                                        <li class="list-inline-item">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="ver(data.item)"
                                                class="px-2 text-primary"
                                                v-b-modal.verventa
                                                data-toggle="modal"
                                                data-target=".bs-example-verventa"
                                                v-b-tooltip.hover
                                                title="Ver venta"
                                            >
                                                <i
                                                    class="uil-eye font-size-18"
                                                ></i>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div
                                    class="
                                        dataTables_paginate
                                        paging_simple_numbers
                                        float-end
                                    "
                                >
                                    <ul
                                        class="
                                            pagination pagination-rounded
                                            mb-0
                                        "
                                    >
                                        <!-- pagination -->
                                        <b-pagination
                                            v-model="currentPage"
                                            :total-rows="rows"
                                            :per-page="perPage"
                                        ></b-pagination>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->

            <b-modal
                id="verventa"
                size="xl"
                title="Detalle de Venta"
                title-class="font-18"
                hide-footer
                v-if="modal"
            >
                <div class="row">
                    <div class="col-12 mt-2">
                        <div class="mb-3">
                            <h3 class="font-size-16 mb-4">
                                <i
                                    class="
                                        mdi mdi-arrow-right
                                        text-primary
                                        me-1
                                    "
                                ></i>
                                Datos del Paciente
                            </h3>
                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>Nombres Apellidos</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>RUT</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Email</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Prevision</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.nombrepaciente }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.rutpaciente }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.emailpaciente }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.servicioprevision }}</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mb-2">
                        <div class="mb-3">
                            <h3 class="font-size-16 mb-4">
                                <i
                                    class="
                                        mdi mdi-arrow-right
                                        text-primary
                                        me-1
                                    "
                                ></i>
                                Datos del Servicio
                            </h3>
                        </div>
                    </div>
                    <div class="col-12 mb-2">
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>Profesional</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Servicio</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Previsión</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Precio</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.nombreeprofesional }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.nombreservicio }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.servicioprevision }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>
                                    {{ detalle.precioservicio | toCurrency }}
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-3 mb-2">
                        <div class="mb-3">
                            <h3 class="font-size-16 mb-4">
                                <i
                                    class="
                                        mdi mdi-arrow-right
                                        text-primary
                                        me-1
                                    "
                                ></i>
                                Datos del Pago
                            </h3>
                        </div>
                    </div>
                    <div class="col-12 mt-2 mb-2">
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>Medio de Pago</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Subtotal</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>% Descuento</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Precio con descuento</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.mediopago }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.subtotal | toCurrency }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.porcentajedescuento }} %</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>
                                    {{ detalle.precio_descuento | toCurrency }}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-2 mb-2">
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>IVA</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Total</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Código Boucher</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>Código Bono Salud</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.iva | toCurrency }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.total | toCurrency }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.codigo_boucher }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.codigo_bono_fonasa }}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-2 mb-2">
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>Boleta Honorario</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>N° Boleta</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.boleta_honorario }}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{ detalle.n_honorario }}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </b-modal>

            <!-- modal -->
        </div>
    </Layout>
</template>
