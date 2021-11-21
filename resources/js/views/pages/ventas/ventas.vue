<script src="./ventas.js"></script>

<template>
    <Layout>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-6">
                            <h5>Gestión Ventas</h5>
                        </div>
                        <div class="col-12 mt-3">
                            <form
                                class="
                                    needs-validation
                                    row row-cols-lg-auto
                                    gx-3
                                    gy-2
                                    align-items-center
                                "
                                @submit.prevent="formBuscar()"
                            >
                                <div class="col-12">
                                    <label class="visually-hidden" for="fecha"
                                        >FECHA</label
                                    >
                                    <input
                                        type="date"
                                        class="form-control"
                                        v-model="formbuscar.fecha"
                                        id="fecha"
                                        :class="{
                                            'is-invalid':
                                                submitted &&
                                                $v.formbuscar.fecha.$error,
                                        }"
                                    />
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
                                    <button
                                        type="submit"
                                        class="btn btn-primary"
                                    >
                                        Buscar
                                    </button>
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
                                        <li class="list-inline-item">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="eliminar(data.item)"
                                                class="px-2 text-danger"
                                                v-b-tooltip.hover
                                                title="Eliminar venta"
                                            >
                                                <i
                                                    class="
                                                        uil-trash
                                                        font-size-18
                                                    "
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
                                <h6>{{ detalle.precioservicio | toCurrency }}</h6>
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
                                <h6>{{ detalle.precio_descuento | toCurrency}}</h6>
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
                                <h6>{{detalle.iva | toCurrency}}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.total | toCurrency}}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.codigo_boucher}}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.codigo_bono_fonasa}}</h6>
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
                            <div class="col-12 col-md-3">
                                <h6>Estado del Pago</h6>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.boleta_honorario}}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.n_honorario}}</h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6>{{detalle.estado}}</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="button-items d-flex justify-content-center">

                    <button class="btn btn-danger mt-4" v-if="detalle.estado_id == 4 || detalle.estado_id == 5" @click="accion(6)" type="submit">
                    <i class="uil-times"></i> Pago Rechazado
                </button>
                <button class="btn btn-success mt-4" v-if="detalle.estado_id == 6 || detalle.estado_id == 5" @click="accion(4)"  type="submit">
                    <i class="uil-usd-circle"></i> Pagada
                </button>
                <button class="btn btn-warning mt-4" v-if="detalle.estado_id == 4 || detalle.estado_id == 6 || detalle.estado_id != 5" @click="accion(5)" type="submit">
                    <i class="uil-clock-ten"></i> Pago Pendiente
                </button>

                </div>

                
            </b-modal>

            <!-- modal -->
        </div>
    </Layout>
</template>
