<script>
import { Bar } from 'vue-chartjs'
export default {
  name: 'BarChart',
  extends: Bar,
  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    }, {
      responsive: false
    })
  } 
}
</script>

<style>

</style>
