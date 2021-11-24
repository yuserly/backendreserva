<script src="./profesionales.js"></script>


<template>
  <Layout>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body row">
            <div class="col-6">
              <h5>Listado Profesionales</h5>
            </div>
            <div class="col-6">
              <button
                type="button"
                class="btn btn-success btn-sm waves-effect waves-light float-end"
                v-b-modal.crearprofesional
                @click="modalNuevo"
              >
                <i class="fas fa-plus-circle"></i>
                Crear profesional
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Informacion Profesionales -->
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
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
                  <label class="d-inline-flex align-items-center">
                    Buscar:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Buscar..."
                      class="form-control form-control-sm ms-2"
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
                        v-on:click="contraseña(data.item)"
                        class="px-2 text-warning"
                        v-b-modal.cambiarcontrasena
                        data-toggle="modal"
                        data-target=".bs-example-cambiarcontrasena"
                        v-b-tooltip.hover
                        title="Cambiar Contraseña"
                      >
                        <i class="uil uil-key-skeleton font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="editar(data.item)"
                        class="px-2 text-primary"
                        v-b-modal.crearprofesional
                        data-toggle="modal"
                        data-target=".bs-example-crearprofesional"
                        v-b-tooltip.hover
                        title="Editar"
                      >
                        <i class="uil uil-pen font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="eliminar(data.item)"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Eliminar"
                      >
                        <i class="uil uil-power font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="config(data.item)"
                        v-b-modal.crearhorario
                        data-toggle="modal"
                        data-target=".bs-example-crearhorario"
                        class="px-2 text-warning"
                        v-b-tooltip.hover
                        title="Agregar horario"
                      >
                        <i class="uil uil-clock font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        v-on:click="AddformDataServicio(data.item)"
                        v-b-modal.crearservicio
                        data-toggle="modal"
                        data-target=".bs-example-crearservicio"
                        class="px-2 text-info"
                        v-b-tooltip.hover
                        title="Agregar servicio"
                      >
                        <i class="uil uil-cog font-size-18"></i>
                      </a>
                    </li>
                  </ul>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
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


      <!-- modal CREAR PROFESIONAL -->
      <b-modal
        id="crearprofesional"
        size="lg"
        :title="titlemodal"
        title-class="font-18"
        hide-footer
        v-if="modal"
      >
        <form
          class="needs-validation"
          @submit.prevent="formSubmit"
          enctype="multipart/form-data"
        >
          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="rut">RUT</label>
                <input
                  id="rut"
                  maxlength = "10"
                  v-model="form.rut"
                  type="text" 
                  class="form-control inputRUT"
                  :class="{
                    'is-invalid': submitted && $v.form.rut.$error,
                  }"
                  v-on:input="checkRut(this)"
                />

                <div
                  v-if="submitted && $v.form.rut.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.rut.required">El rut es requerido.</span>
                </div>

                <span class="text-danger" v-if="rutexist">Rut en uso.</span>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="nombres">Nombres</label>
                <input
                  id="nombres"
                  v-model="form.nombres"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && $v.form.nombres.$error,
                  }"
                />

                <div
                  v-if="submitted && $v.form.nombres.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.nombres.required"
                    >El nombre es requerido.</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="apellidos">Apellidos</label>
                <input
                  id="apellidos"
                  v-model="form.apellidos"
                  type="text"
                  class="form-control"
                  @input="checkRut"
                  :class="{
                    'is-invalid': submitted && $v.form.apellidos.$error,
                  }"
                />

                <div
                  v-if="submitted && $v.form.apellidos.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.apellidos.required"
                    >El apellidos es requerido.</span
                  >
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="profesion">Profesion</label>
                <input
                  id="profesion"
                  v-model="form.profesion"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && $v.form.profesion.$error,
                  }"
                />

                <div
                  v-if="submitted && $v.form.profesion.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.profesion.required"
                    >La profesion es requerida.</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="email">Correo electronico</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && $v.form.email.$error,
                  }"
                  @input="validarEmail($event)"
                />

                <div
                  v-if="submitted && $v.form.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.form.email.required"
                    >El email requerido.</span
                  >
                </div>

                <span class="text-danger" v-if="emailexist"
                  >Email ya en uso.</span
                >
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label>Especialidad</label>
                <multiselect
                  v-model="form.especialidad"
                  :options="selectEspecialidad"
                  track-by="id_especialidad"
                  label="nombre"
                ></multiselect>
              </div>
            </div>
            <div class="col-12">
              <div class="mb-3">
                <label>Foto Perfil</label>

                <input
                  id="url_perfil"
                  type="file"
                  class="form-control"
                  @change="onFileChange($event)"
                />
              </div>
            </div>
          </div>

          <button
            v-if="btnCreate === true"
            class="btn btn-primary float-end"
            type="submit"
          >
            <i class="far fa-save"></i> Crear
          </button>
          <button v-else class="btn btn-primary float-end" type="submit">
            <i class="fas fa-sync"></i> Actualizar
          </button>
        </form>
      </b-modal>
      <!-- modal -->

      <!-- modal CREAR HORARIO -->
      <b-modal
        id="crearhorario"
        size="lg"
        title="Configuración Profesional"
        title-class="font-18"
        hide-footer
        v-if="modalhorario"
        
      >
        <form
          class="needs-validation"
          @submit.prevent="formSubmitSettings"
          enctype="multipart/form-data"
        >
          <div class="row">
            <div class="col-12 row">
              <div class="col-6" style="margin: auto;">
                <h6>Seleccionar Sucursal</h6>
              </div>
              <div class="col-6">
                <multiselect
                  v-model="formhorario.sucursal"
                  :options="optionsSucursal"
                  track-by="id_sucursal"
                  label="nombre"
                  @input="getHorarioProfesional()"
                ></multiselect>
              </div>
            </div>
            <hr>
            <div class="col-12 col-lg-12">
              <div class="mb-3">
                <div v-for="(field, i) in fieldsH" :key="field.id" class="row mb-3">
                  
                  <div class="col-12">
                    <div class="row">
                      <div class="col-5">
                        <label for="dia">Día</label>
                        <multiselect
                          v-model="fieldsH[i].id_dia"
                          :options="optionsDias"
                          track-by="id_dia"
                          label="nombre"
                        ></multiselect>
                        <span
                          class="text-danger"
                          v-if="!fieldsH[i].id_dia && summitedH"
                          >Dia requerido.</span
                        >
                      </div>
                      <div class="col-3">
                        <label for="hora_inicio">Hora Inicio</label>
                        <input
                          id="hora_inicio"
                          v-model="fieldsH[i].hora_inicio"
                          type="time"
                          class="form-control"
                        />
                        <span
                          class="text-danger"
                          v-if="!fieldsH[i].hora_inicio && summitedH"
                          >Hora de inicio requerida.</span
                        >
                      </div>
                      <div class="col-3">
                        <label for="hora_fin">Hora Fin</label>
                        <input
                          id="hora_fin"
                          v-model="fieldsH[i].hora_fin"
                          type="time"
                          class="form-control"
                        />
                        <span
                          class="text-danger"
                          v-if="!fieldsH[i].hora_fin && summitedH"
                          >Hora fin requerida.</span
                        >
                      </div>
                      <div class="col-1"> <label for="">Eliminar</label>
                        <div class="col-lg-2 align-self-center d-grid">
                          <button type="button" class="btn btn-danger btn-block btn-sm" @click="deleteRow(i)"><i class="fa fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          <hr>
          <button class="btn btn-primary float-end" type="submit">
            <i class="far fa-save"></i> Guardar Horario
          </button>
          <button type="button" class="btn btn-success mt-3 mt-lg-0 float-end" @click="AddformData" style="margin-right: 10px;"><i class="fa fa-plus-circle"></i>
            Agregar horario
          </button>

        </form>
      </b-modal>
      <!-- modal horario y servicio -->

      <!-- modal ASIGNAR SERVICIOS-->
      <b-modal
        id="crearservicio"
        size="xl"
        title="Servicios Profesional"
        title-class="font-18"
        hide-footer
        v-if="modalservicio"
      >
        <form
          class="needs-validation"
          @submit.prevent="formSubmitServicios"
          enctype="multipart/form-data"
        >
          <div class="row mb-3">
            <div class="col-12 col-lg-6">

                <ul class="list-group lista_estudiantes" v-for="(servicio) in datosModal.servicio_id_servicio" :key="servicio.id_servicio">
                  <li class="list-group-item d-flex justify-content-between">{{servicio.nombre}} <button type="button" class="btn btn-danger btn-sm" v-on:click="eliminarServicio(servicio.id_servicio)"><i class="fa fa-trash"></i></button></li> 
                </ul>

            </div>
            <div class="col-12 col-lg-6">
              <div class="row">
                <div class="col-12 ">
                  <div class="col-12">
                    <div class="mb-3">
                      <label for="sucursal">Sucursal</label>
                      <multiselect
                        v-model="formservicio.sucursal_id_sucursal"
                        :options="optionsSucursal"
                        track-by="id_sucursal"
                        label="nombre"
                        @input="traerServicio()"
                      ></multiselect>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-3">
                      <label for="servicios">Servicios</label>
                      <multiselect
                        v-model="formservicio.servicio_id_servicio"
                        :options="options"
                        track-by="id_servicio"
                        :multiple="true"
                        label="nombre"
                      ></multiselect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="btnCreate === true"
            class="btn btn-primary float-end"
            type="submit"
          >
            <i class="far fa-save"></i> Crear
          </button>
          <button v-else class="btn btn-primary float-end" type="submit">
            <i class="fas fa-sync"></i> Actualizar
          </button>
        </form>
      </b-modal>
      <!-- modal horario y servicio -->

      <!-- modal CAMBIAR CONTRASEÑA-->
      <b-modal
        id="cambiarcontrasena"
        size="lg"
        :title="titleContrasena"
        title-class="font-18"
        hide-footer
        v-if="modalContrasena"
      >
        <form class="needs-validation" @submit.prevent="formSubmitPassword">
          <div class="row">
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="nombres">Nueva Contraseña</label>
                <input
                  id="nombres"
                  v-model="formPassword.contrasena"
                  type="password"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && $v.formPassword.contrasena.$error,
                  }"
                />

                <div
                  v-if="submitted && $v.formPassword.contrasena.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.formPassword.contrasena.required"
                    >Debes ingresar contraseña.</span
                  >
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="mb-3">
                <label for="apellidos">Repetir Contraseña</label>
                <input
                  id="apellidos"
                  v-model="formPassword.repetir"
                  type="password"
                  class="form-control"
                  v-on:keyup="verificarContrasena()"
                  :class="{
                    'is-invalid': submitted && $v.formPassword.repetir.$error,
                  }"
                />
                <div
                  v-if="submitted && $v.formPassword.repetir.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.formPassword.repetir.required"
                    >Debes repetir contraseña.</span
                  >
                </div>
                <span class="text-danger" v-if="repetirValidar"
                  >Contraseña no coinciden.</span
                >
              </div>
            </div>
          </div>

          <button class="btn btn-success float-end" type="submit" v-if="btnContrasena"><i class="far fa-save"></i> Actualizar Contraseña</button>

        </form>
      </b-modal>
      <!-- modal -->

    </div>
  </Layout>
</template>
