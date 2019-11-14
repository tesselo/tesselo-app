<template>
  <el-row class="upload-container">
    <el-col
      :xs="{span: 22, offset: 1}"
      :sm="{span: 20, offset: 2}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <el-row v-if="list">
        <h2>
          Select Aggregation Layer
          <el-button
            class="button-right"
            icon="el-icon-circle-plus-outline"
            title="Create new aggregationlayer"
            size="small"
            @click="createNew" />
        </h2>
        <areas-table
          :set-router-query-parameters="areaTableSetRoute"
          @select="areasTableSelect"/>
      </el-row>
      <el-row>
        <h2>
          <span v-if="edit && selectedLayer">Edit Aggregation Layer {{ selectedLayer.id }}</span>
          <span v-if="create">Create New Aggregation Layer</span>
          <el-button
            v-if="!list"
            class="button-right"
            icon="el-icon-back"
            size="small"
            @click="goBack"/>
          <el-button
            v-if="edit"
            class="button-right"
            icon="el-icon-s-tools"
            size="small"
            @click="goAreaList"/>
        </h2>
      </el-row>
      <el-row v-if="!list">
        <el-form :model="form">
          <ValidationObserver v-slot="{ valid }">
            <el-form-item label="Name">
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                rules="required">
                <el-input v-model="form.name" />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </el-form-item>
            <el-form-item label="Description">
              <el-input v-model="form.description" />
            </el-form-item>
            <el-form-item label="Zipped Shapefile">
              <el-upload
                ref="upload"
                :accept="accept"
                :auto-upload="autoUpload"
                :multiple="multiple"
                :show-file-list="showFileList"
                :on-change="handleFileChange"
                action="">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="zipped shapefile"
                  rules="required">
                  <el-input
                    v-model="form.shapefile"
                    :readonly="true"
                    clearable>
                    <el-button
                      slot="append"
                      icon="el-icon-upload2" />
                  </el-input>
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </el-upload>
            </el-form-item>
            <el-form-item label="Name Column">
              <ValidationProvider
                v-slot="{ errors }"
                name="name column"
                rules="required">
                <el-input v-model="form.name_column" />
                <span>{{ errors[0] }}</span>
              </ValidationProvider>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                :disabled="!valid"
                type="primary"
                class="button-right"
                @click="onSubmit">
                Save
              </el-button>
            </el-form-item>
          </ValidationObserver>
        </el-form>
      </el-row>
      <el-row>
        <span
          v-for="error in formErrors.nonFieldErrors"
          :key="error"
          class="tsl-form__control-error text-right">
          {{ error }}
        </span>
      </el-row>
      <el-row v-if="selectedLayer && selectedLayer.parse_log && !list">
        <h3>Log</h3>
        <p>{{ selectedLayer.parse_log }}</p>
      </el-row>
      <el-row v-if="selectedLayer && selectedLayer.aggregationareas && !list">
        <h3>Aggregation areas</h3>
        <p>{{ selectedLayer.aggregationareas }}</p>
      </el-row>
      <el-row v-if="selectedLayer && selectedLayer.extent && !list">
        <h3>Extent</h3>
        <p>{{ selectedLayer.extent }}</p>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/upload.css'

import { mapState, mapActions } from 'vuex'
import { actionTypes, routeTypes } from '@/services/constants'
import axios from 'axios'
import AreasTable from '@/components/areas-table/areas-table'


export default {
  name: 'Logout',
  components: {
    AreasTable
  },
  data() {
    return {
      selectedFile: null,
      showFileList: false,
      autoUpload: false,
      multiple: false,
      accept: 'application/zip',
      form: {
        name: '',
        description: '',
        shapefile: '',
        name_column: ''
      },
      areaTableSetRoute: false,
      loading: false,
      formErrors: {
        nonFieldErrors: null
      }
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer
    }),
    list(){
      return this.$route.name == routeTypes.AGGREGATION_LAYER_LIST
    },
    edit(){
      return this.$route.name == routeTypes.AGGREGATION_LAYER_EDIT
    },
    create(){
      return this.$route.name == routeTypes.AGGREGATION_LAYER_CREATE
    }
  },
  watch: {
    selectedLayer(dat){
      this.form.name = dat.name
      this.form.description = dat.description
      this.form.shapefile = dat.shapefile
      this.form.name_column = dat.name_column
    }
  },
  mounted() {
    if(this.edit){
      this.getAggregationLayerIDAction(this.$route.params.layer)
    }
  },
  methods: {
    ...mapActions('aggregationLayer', {
      getAggregationLayerIDAction: actionTypes.AGGREGATION_LAYER_GET_ID,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT,
      saveAggregationLayer: actionTypes.AGGREGATION_LAYER_SAVE,
      editAggregationLayer: actionTypes.AGGREGATION_LAYER_EDIT,
      resetAggregationLayer: actionTypes.RESET,
      getUploadLink: actionTypes.AGGREGATION_LAYER_GET_UPLOAD_URL,
      parseAggregationLayer: actionTypes.AGGREGATION_LAYER_PARSE_LAYER,
    }),
    goBack(){
      this.$router.push({name: routeTypes.AGGREGATION_LAYER_LIST})
    },
    goAreaList(){
      this.$router.push({name: routeTypes.AGGREGATION_AREA_LIST, prams: {layer: this.selectedLayer.id}})
    },
    areasTableSelect(layer) {
      this.$router.push({name: routeTypes.AGGREGATION_LAYER_EDIT, params: {layer: layer.id}})
    },
    createNew(){
      this.resetAggregationLayer()
      this.clearForm()
      this.$router.push({name: routeTypes.AGGREGATION_LAYER_CREATE})
    },
    handleFileChange(file){
      this.selectedFile = file
      this.form.shapefile = file.name
    },
    clearForm() {
      this.form = {
        name: '',
        description: '',
        shapefile: '',
        name_column: ''
      }
    },
    onSubmit(){
      this.loading = true

      this.formErrors = {
        nonFieldErrors: null
      }

      if (this.selectedLayer && this.selectedFile && this.form.shapefile) {
        // Existing aggregationlayer, change in file - upload.
        this.updateWithFile()
      } else if (this.selectedLayer) {
        // Existing aggregationlayer, no change in file - update json data.
        this.editAggregationLayer({id: this.selectedLayer.id, ...this.form})
        .catch(errors => {
          this.loading = false
          this.formErrors = errors
        })
      } else {
        // New aggregationlayer.
        const tat = this
        this.saveAggregationLayer({...this.form})
        .then(function(){
          if (tat.selectedFile && tat.form.shapefile) {
            tat.updateWithFile()
          }
        })
        .catch(errors => {
          this.loading = false
          this.formErrors = errors
        })
      }
    },
    updateWithFile(){
      const tat = this
      this.getUploadLink({
        pk: this.selectedLayer.id,
        filename: this.selectedFile.name,
      })
      .then((response) => {
        // Upload file (inspired by https://stackoverflow.com/questions/55877071/).
        var postData = new FormData()
        // Add fields to post data.
        for (var key in response.fields) {
          postData.append(key, response.fields[key])
        }
        // Add input file to post data.
        postData.append('file', this.selectedFile.raw)
        // Post new file to S3.
        axios({
          method: 'post',
          url: response.url,
          data: postData,
        }).then(function(){
          // Commit non-file fields.
          tat.editAggregationLayer({...tat.form, id: tat.selectedLayer.id, shapefile: response.fields.key}).then(function(){
            // Update form data with full S3 key.
            tat.form.shapefile = response.fields.key
            // Trigger parse task.
            tat.parseAggregationLayer({pk: tat.selectedLayer.id})
            .then(() => {
              this.loading = false
            })
            .catch(errors => {
              this.loading = false
              this.formErrors = errors
            })
            // Go to detail page if this is a new layer.
            if (tat.create){
              tat.$router.push({name: routeTypes.AGGREGATION_LAYER_EDIT, params: {layer: tat.selectedLayer.id}})
            }
          })
        })
        .catch(errors => {
          this.loading = false
          this.formErrors = errors
        })
      })
      .catch(errors => {
        this.loading = false
        this.formErrors = errors
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding-top: 50px;
}
.button-right {
  float: right;
  margin-left: 5px;
}
</style>
