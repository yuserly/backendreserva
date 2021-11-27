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
                                    row row-cols-lg-5
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
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><b><u> NOMBRE COMPLETO </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> RUT </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> CORREO </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> PREVISIÓN </u></b></h6>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.nombrepaciente }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.rutpaciente }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.emailpaciente }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.servicioprevision }} </small></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
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
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><b><u> ESPECIALISTA </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> SERVICIO </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> PREVISIÓN </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> PRECIO </u></b></h6>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6> <small> {{ detalle.nombreeprofesional }} </small> </h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.nombreservicio }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.servicioprevision }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.precioservicio | toCurrency }} </small></h6>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>

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
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><b><u> MEDIO DE PAGO </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> TIPO COMPROBANTE </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> N° COMPROBANTE </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> CODIGO FONASA </u></b></h6>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.mediopago }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6 v-if="detalle.boleta_honorario == 1"><small> Boleta Electronica </small></h6>
                                <h6 v-else><small> Boleta Honorarios </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6 v-if="detalle.boleta_honorario == 1"><small> {{detalle.codigo_boucher}} </small></h6>
                                <h6 v-else><small> {{detalle.n_honorario}} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6 v-if="detalle.codigo_bono_fonasa != null" ><small> {{ detalle.codigo_bono_fonasa }}  </small></h6>
                                <h6 v-else ><small> -  </small></h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-2 mb-2">
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><b><u> SUBTOTAL </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> DESCUENTO. </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> PRECIO DESCUENTO </u></b></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><b><u> TOTAL PAGADO </u></b></h6>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.subtotal | toCurrency }} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.porcentajedescuento }} % </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.precio_descuento | toCurrency}} </small></h6>
                            </div>
                            <div class="col-12 col-md-3">
                                <h6><small> {{ detalle.total | toCurrency}} </small></h6>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </b-modal>

            <!-- modal -->

        </div>
    </Layout>
</template>
