<template>
    <div class="map-export-wrapper">
      <div>
        <div class="title">PDF Export
          <el-button
            class="export-button export-close"
            @click="close" >
            <el-icon :size="20 ">
              <closeIcon />
            </el-icon>
          </el-button>
        </div>
        <el-table
          :data="data"
          :show-header="data.length >= 1"
          :empty-text="tableEmptyText"
          size="mini">
          <el-table-column
            prop="id"
            label="Page"
            width="60" />
          <el-table-column
            prop="layer"
            label="Layer" />
          <el-table-column
            prop="moment"
            label="Time" />
        </el-table>
      </div>
        <el-button
          :disabled="processing || data.length == 0"
          :title="hoverInfo.deleteButton"
          class="export-button"
          @click="clear" >
            <el-icon :size="20">
              <deleteIcon />
            </el-icon>
        </el-button>
        <el-button
          :loading="processing"
          :title="hoverInfo.plusButton"
          class="export-button export-print"
          @click="addPage" >
            <el-icon v-if="!processing" :size="20">
              <plusIcon />
            </el-icon>
        </el-button>
      
        <el-button
          :disabled="processing || data.length == 0"
          :title="hoverInfo.donwloadButton"
          class="export-button export-print"
          @click="print" >
          <el-icon :size="20">
              <donwloadIcon />
          </el-icon>
        </el-button>
      
    </div>
</template>

<script>
import { Close as closeIcon, 
         Delete as deleteIcon, 
         Plus as plusIcon,
         Download as donwloadIcon } from '@element-plus/icons'
import { ElButton, ElTooltip } from 'element-plus'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    processing: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ElButton,
    ElTooltip,
    closeIcon,
    deleteIcon,
    plusIcon,
    donwloadIcon
  },
  data() {
    return {
      hoverInfo: {
        deleteButton: "Clear page list",
        plusButton: "Add current view as Page",
        donwloadButton: "Download PDF",
      },
      tableEmptyText: "Click on + button to add data!",
      openDelay: 750,
    }
  },
  emits: ['print-pdf','clear-exports', 'add-page'],
  methods: {
    print(){
      if(!this.processing) this.$emit('print-pdf')
    },
    clear(){
      if(!this.processing) this.$emit('clear-exports')
    },
    addPage(){
      if(!this.processing) this.$emit('add-page')
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .map-export-wrapper {
    position: fixed;
    z-index: 1000;
    background: white;
    padding: 10px;
    border-radius: 3px;
    border: 2px solid rgba(0,0,0,0.2);
    left: 50%;
    margin-left: -180px;
    width: 360px;
    max-width: 100%;
    @media (min-width: 768px) {
      top: 54px;
    }
    @media (max-width: 767px) {
      bottom: 90px;
    }
    .title {
      font-size: 28px;
      color: #5683a2;
      font-weight: 300;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
  }

  .tsl-map .map-export-wrapper .export-button {
    min-height: 30px;
    margin-top: 15px;
    padding: 0px;
    border: 0px;
    width: 30px;
    height: 30px;
    color: #606266;
    outline: none;
    
    &:hover {
      background-color: #f4f4f4;
      border-color: #f4f4f4;
      color: #606266;
    }

    &:focus {
      background-color: #f4f4f4;
    }
    
    &.export-print {
      margin-left: 15px;
      float: right;
    }
   
   &.export-clear {
      margin-left: 10px;
      float: left;
    }
    
    &.export-close {
      float: right;
      margin-top: 0px;
    }
    
    &[disabled] {
      background-color: #F4F4F4;
      opacity: 0.4;
    }

    .el-icon.is-loading {
      font-size: 20px;
    }
  }
</style>