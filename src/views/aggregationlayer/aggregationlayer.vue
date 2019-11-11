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
            icon="el-icon-circle-plus-outline"
            title="Create new aggregationlayer"
            @click="createNew" />
        </h2>
        <areas-table
          ref="table"
          :set-router-query-parameters="areaTableSetRoute"
          @select="areasTableSelect"/>
      </el-row>
      <el-row>
        <h2 v-if="edit">Edit Aggregation Layer {{ selectedLayer.id }}</h2>
        <h2 v-if="create">Create New Aggregation Layer</h2>
      </el-row>
      <el-row v-if="!list">
        <el-form :model="form">
          <el-form-item label="Name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.description" />
          </el-form-item>
          <el-form-item label="Zipped Shapefile">
            <el-input
              v-if="form.shapefile"
              v-model="form.shapefile"
              clearable />
            <el-upload
              ref="upload"
              :accept="accept"
              :auto-upload="autoUpload"
              :multiple="multiple"
              :show-file-list="showFileList"
              :on-change="handleFileChange"
              class="upload-demo"
              action="">
              <el-button
                slot="trigger"
                size="small"
                type="primary">
                <span v-if="form.shapefile">Change File</span>
                <span v-else>Select File</span>
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="Name Column">
            <el-input v-model="form.name_column" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit">
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="selectedLayer">{{ selectedLayer.parse_log }}</el-row>
      <el-row v-if="selectedLayer">{{ selectedLayer.aggregationareas }}</el-row>
      <el-row v-if="selectedLayer">{{ selectedLayer.extent }}</el-row>
    </el-col>
  </el-row>
</template>

<script>
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/upload.css'

import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'
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
      areaTableSetRoute: false
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedLayerRow: state => state.aggregationLayer.row
    }),
    list(){
      return this.$route.path == '/areas'
    },
    edit(){
      return Boolean(this.$route.params.layer)
    },
    create(){
      return this.$route.path == '/areas/new'
    }
  },
  watch: {
    selectedLayer(dat){
      this.form.name = dat.name
      this.form.description = dat.description
      this.form.shapefile = dat.shapefile
      this.form.name_column = dat.nameColumn
    }
  },
  mounted() {
    console.log('mounted')
    if(this.edit){
      this.getAggregationLayerIDAction(this.$route.params.layer)
      .then(() => {
        this.selectAggregationLayer(this.selectedLayerRow)
      })
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
    areasTableSelect(area) {
      this.$router.push({name: 'EditAggregationLayer', params: {layer: area.id}})
    },
    createNew(){
      this.resetAggregationLayer()
      this.clearForm()
      this.$router.push({name: 'CreateAggregationLayer'})
    },
    handleFileChange(file){
      console.log(file)
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
      if (this.selectedLayer && this.selectedFile && this.form.shapefile) {
        // Existing aggregationlayer, change in file - upload.
        console.log('uploading file', this.selectedFile)
        this.updateWithFile()
      } else if (this.selectedLayer) {
        console.log('updating agglayer without file change')
        // Existing aggregationlayer, no change in file - update json data.
        this.editAggregationLayer({id: this.selectedLayer.id, ...this.form})
      } else {
        // New aggregationlayer.
        console.log('creating new')
        const tat = this
        this.saveAggregationLayer({...this.form}).then(function(){
          console.log('created new', tat.selectedLayer)
          // this.selectAggregationLayer(data)
          if (tat.selectedFile && tat.form.shapefile) {
            console.log('uploading new file')
            tat.updateWithFile()
          }
        })
      }
    },
    updateWithFile(){
      const tat = this
      this.getUploadLink({
        pk: this.selectedLayer.id,
        filename: this.selectedFile.name,
      }).then((response) => {
        console.log(response.fields)
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
          console.log('Finished upload, updating agglayer json and triggering parser.', response.fields.key)
          // Commit non-file fields.
          tat.editAggregationLayer({...tat.form, id: tat.selectedLayer.id, shapefile: response.fields.key}).then(function(){
            // Update form data with full S3 key.
            tat.form.shapefile = response.fields.key
            // Trigger parse task.
            tat.parseAggregationLayer({pk: tat.selectedLayer.id})
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding-top: 50px;
}
.el-button {
  float: right;
}
</style>
