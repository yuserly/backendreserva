 <script src="./confirmar-reserva.js"></script>

<template>
    <Layout>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body row">
                        <div class="col-12">
                            <h5>Confirmación de reservas</h5>
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
                                    <label class="visually-hidden" for="rut"
                                        >RUT</label
                                    >
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="rut"
                                        placeholder="111111111-1"
                                        v-model="formbuscar.rut"
                                    />
                                </div>
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

                            <!-- <button type="button" class="btn btn-success btn-sm waves-effect waves-light float-end" v-b-modal.confirarreserva @click="modalNuevo"> <i class="fas fa-plus-circle"></i> Crear Especialidad </button> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-12">
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
                                        <li class="list-inline-item" v-if="data.item.estado_id == 2">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="
                                                    confirmarAsistencia(data.item)
                                                "
                                                class="px-2 text-primary"
                                                v-b-modal.confirarreserva
                                                data-toggle="modal"
                                                data-target=".bs-example-confirarreserva"
                                                v-b-tooltip.hover
                                                title="Confirmar Reserva"
                                            >
                                                <i
                                                    class="
                                                        uil-check
                                                        font-size-18
                                                    "
                                                ></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item" v-if="data.item.estado_id != 2">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="
                                                    DeshacerConfirmacion(data.item)
                                                "
                                                class="px-2 text-warning"
                                                v-b-modal.confirarreserva
                                                data-toggle="modal"
                                                data-target=".bs-example-confirarreserva"
                                                v-b-tooltip.hover
                                                title="No Confirmada Reserva"
                                            >
                                                <i
                                                    class="
                                                        uil-times
                                                        font-size-18
                                                    "
                                                ></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="
                                                    FinalizarReserva(data.item)
                                                "
                                                class="px-2 text-success"
                                                v-b-modal.confirarreserva
                                                data-toggle="modal"
                                                data-target=".bs-example-confirarreserva"
                                                v-b-tooltip.hover
                                                title="Finalizar Reserva"
                                            >
                                                <i
                                                    class="
                                                        uil-bill
                                                        font-size-18
                                                    "
                                                ></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a
                                                href="javascript:void(0);"
                                                v-on:click="eliminar(data.item)"
                                                class="px-2 text-danger"
                                                v-b-tooltip.hover
                                                title="Cancelar Reserva"
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
                id="confirarreserva"
                size="xl"
                title="Confirmar Reserva"
                title-class="font-18"
                hide-footer
                v-if="modal"
            >
                <form class="needs-validation" @submit.prevent="formSubmit">
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
                                    <h6>{{ nombrepaciente }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>{{ rutpaciente }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>{{ emailpaciente }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <multiselect
                                        v-model="cambiarprevision.id_prevision"
                                        :options="options"
                                        track-by="id_prevension"
                                        label="nombre"
                                        @input="cambiarPrevision()"
                                    ></multiselect>
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
                                    <h6>{{ nombreeprofesional }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>{{ nombreservicio }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>{{ servicioprevision }}</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>{{ precioservicio }}</h6>
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
                                <div class="col-12 col-md-4">
                                    <h6>Boleta</h6>
                                </div>
                                <div class="col-12 col-md-3" v-if="formventa.picked == 1">
                                    <h6>Codigo Boucher</h6>
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 2">
                                    <h6>N° Boleta Honorario</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 row">
                                    <div class="col-md-6">
                                        <input type="radio" id="1" value="1"  v-model="formventa.picked" v-on:change="changeBoleta()">
                                        <label for="1">B. Electronica</label>
                                    </div>
                                    <div class="col-md-6">
                                        <input type="radio" id="2" value="2" v-model="formventa.picked" v-on:change="changeBoleta()">
                                        <label for="2">B. Honorario</label>    
                                    </div>
                                    
                                </div>
                                <div class="col-12 col-md-3" v-if="formventa.picked == 1">
                                    <input
                                        id="codigo_boucher"
                                        v-model="formventa.codigo_boucher"
                                        type="text"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 2">
                                    <input
                                        id="n_honorario"
                                        v-model="formventa.n_honorario"
                                        type="text"
                                        class="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-2 mb-2">
                            <div class="row">
                                <div class="col-12 col-md-3">
                                    <h6>Subtotal</h6>
                                </div>
                                <div class="col-12 col-md-2">
                                    <h6>% Descuento</h6>
                                </div>
                                <div class="col-12 col-md-2">
                                    <h6>Precio con descuento</h6>
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 1">
                                    <h6>IVA</h6>
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 2">
                                    <h6>RETENCIÓN</h6>
                                </div>
                                <div class="col-12 col-md-3">
                                    <h6>TOTAL</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-md-3">
                                    <input
                                        id="subtotal"
                                        v-model="formventa.subtotal"
                                        type="number"
                                        class="form-control"
                                        disabled
                                    />
                                </div>
                                <div class="col-12 col-md-2">
                                    <input
                                        id="porcentajedescuento"
                                        v-model="formventa.porcentajedescuento"
                                        type="number"
                                        class="form-control"
                                        @input="calculo()"
                                    />
                                </div>
                                <div class="col-12 col-md-2">
                                    <input
                                        id="precio_descuento"
                                        v-model="formventa.precio_descuento"
                                        type="number"
                                        class="form-control"
                                        disabled
                                    />
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 1">
                                    <input
                                        id="iva"
                                        v-model="formventa.iva"
                                        type="number"
                                        class="form-control"
                                        disabled
                                    />
                                </div>
                                <div class="col-12 col-md-2" v-if="formventa.picked == 2">
                                    <input
                                        id="iva"
                                        v-model="formventa.retencion"
                                        type="number"
                                        class="form-control"
                                        disabled
                                    />
                                </div>
                                <div class="col-12 col-md-3">
                                    <input
                                        id="total"
                                        v-model="formventa.total"
                                        type="number"
                                        class="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-2 mb-2">
                            <div class="row">
                                 <div class="col-12 col-md-4">
                                    <h6>Codigo Bono Fonasa</h6> 
                                </div>
                                <div class="col-12 col-md-4">
                                    <h6>Medio de Pago</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-md-3">
                                    <input
                                        id="codigo_bono_fonasa"
                                        v-model="formventa.codigo_bono_fonasa"
                                        type="text"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-12 col-md-4">
                                    <multiselect
                                        v-model="formventa.mediopago"
                                        :options="optionsMedioPago"
                                        track-by="id_mediopago"
                                        label="nombre"
                                    ></multiselect>
                                    <span
                                        class="text-danger"
                                        v-if="
                                            submittedventa &&
                                            !formventa.mediopago
                                        "
                                        >Debe seleccionar un medio de pago.</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="btn btn-success mt-4 float-end"
                        type="submit"
                    >
                        <i class="far fa-check-circle"></i> Finalizar Reserva
                    </button>
                </form>
            </b-modal>
            <!-- modal -->
        </div>
    </Layout>
</template>
