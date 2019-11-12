<template>
  <el-row class="upload-container">
    <el-col
      :xs="{span: 22, offset: 1}"
      :sm="{span: 20, offset: 2}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <AggregationAreasTable
        ref="table"
        :aggregation-layer="aggregationLayer"
        @select="areaSelect"/>
    </el-col>
  </el-row>
</template>
<script>
import AggregationAreasTable from '@/components/aggregation-areas-table/aggregation-areas-table'

export default {
  components: {
    AggregationAreasTable
  },
  computed: {
    aggregationLayer(){
      console.log(this.$route.params.layer)
      return parseInt(this.$route.params.layer)
    }
  },
  methods: {
    areaSelect(dat){
      console.log('selected', dat)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
