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
          ref="listTable"
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
                <el-input
                  v-model="form.shapefile"
                  :readonly="true"
                  clearable>
                  <el-button
                    slot="append"
                    icon="el-icon-upload2" />
                </el-input>
              </el-upload>
            </el-form-item>
            <el-form-item label="Name Column">
              <el-input v-model="form.name_column" />
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="edit"
                type="danger"
                @click="dialogVisible = true">
                Delete
              </el-button>
              <el-button
                :loading="loading"
                :disabled="!valid"
                type="primary"
                class="button-right"
                @click="onSubmit">
                Save
              </el-button>
              <el-dialog
                :visible="dialogVisible"
                title="Confirm Delete">
                <p>This will permanently delete the aggregation layer and all its aggregation areas.</p>
                <span
                  slot="footer"
                  class="dialog-footer">
                  <el-button @click="dialogVisible = false">Cancel</el-button>
                  <el-button
                    type="danger"
                    @click="onDelete">
                    Confirm
                  </el-button>
                </span>
              </el-dialog>
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
        <p>{{ selectedLayer.nr_of_areas }}</p>
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
import 'element-ui/lib/theme-chalk/dialog.css'

import { mapState, mapActions } from 'vuex'
import { actionTypes, routeTypes } from '@/services/constants'
import axios from 'axios'
import AreasTable from '@/components/areas-table/areas-table'


export default {
  name: 'AggregationLayer',
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
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      layerPage: state => state.aggregationLayer.currentPage
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
    selectedLayer(){
      if (this.selectedLayer){
        this.setForm()
      }
    }
  },
  mounted() {
    if(this.edit){
      if (!this.selectedLayer || this.selectedLayer.id != this.$route.params.layer) {
        this.getAggregationLayerIDAction(this.$route.params.layer)
      } else {
        this.setForm()
      }
    }
  },
  methods: {
    ...mapActions('aggregationLayer', {
      getAggregationLayerAction: actionTypes.AGGREGATION_LAYER_GET,
      getAggregationLayerIDAction: actionTypes.AGGREGATION_LAYER_GET_ID,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT,
      saveAggregationLayer: actionTypes.AGGREGATION_LAYER_SAVE,
      editAggregationLayer: actionTypes.AGGREGATION_LAYER_EDIT,
      deleteAggregationLayer: actionTypes.AGGREGATION_LAYER_DELETE,
      resetAggregationLayer: actionTypes.RESET,
      getUploadLink: actionTypes.AGGREGATION_LAYER_GET_UPLOAD_URL,
      parseAggregationLayer: actionTypes.AGGREGATION_LAYER_PARSE_LAYER
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
    setForm() {
      this.form.name = this.selectedLayer.name
      this.form.description = this.selectedLayer.description
      this.form.shapefile = this.selectedLayer.shapefile
      this.form.name_column = this.selectedLayer.name_column
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
        .then(() => {
          this.loading = false
        })
        .catch(errors => {
          this.loading = false
          this.formErrors = errors
        })
      } else {
        // New aggregationlayer.
        const that = this
        this.saveAggregationLayer({...this.form})
        .then(function(){
          if (that.selectedFile && that.form.shapefile) {
            that.updateWithFile()
          } else {
            // Reload layer list (to update geom count).
            this.getAggregationLayerAction({page: this.layerPage})
          }
        })
        .catch(errors => {
          this.loading = false
          this.formErrors = errors
        })
      }
    },
    updateWithFile(){
      const that = this
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
          that.editAggregationLayer({...that.form, id: that.selectedLayer.id, shapefile: response.fields.key}).then(function(){
            // Update form data with full S3 key.
            that.form.shapefile = response.fields.key
            // Trigger parse task.
            that.parseAggregationLayer({pk: that.selectedLayer.id})
            .then(() => {
              this.loading = false
              // Reload layer list (to update geom count).
              this.getAggregationLayerAction({page: this.layerPage})
            })
            .catch(errors => {
              this.loading = false
              this.formErrors = errors
            })
            // Go to detail page if this is a new layer.
            if (that.create){
              that.$router.push({name: routeTypes.AGGREGATION_LAYER_EDIT, params: {layer: that.selectedLayer.id}})
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
    },
    onDelete () {
      // Close dialogue.
      this.dialogVisible = false
      // Delete area.
      this.deleteAggregationLayer(this.selectedLayer)
      .then(() => {
        // Refresh list from DB.
        this.$refs.listTable.getAggregationLayers({page: 1})
      })
      // Go back to list page.
      this.$router.push({name: routeTypes.AGGREGATION_LAYER_LIST})
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
