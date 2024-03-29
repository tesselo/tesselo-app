import { HorizontalBar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
  props: {
    options: {
      type: Object,
      required: false,
      default () {
        return {
          responsive: false,
          maintainAspectRatio: false
        }
      }
    }
  },
  mixins: [reactiveProp],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
