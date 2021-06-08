<template>
  <line-chart
    :options="options"
    :styles="myStyles"
    :chart-data="chartData" />
</template>

<script>
import LineChart from './reactive-line-chart'

export default {

  components: {
    LineChart,
  },

  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    },
    reportType: {
      type: Boolean,
      required: false,
      default: false
    },
  },

  computed: {
    options() {
      const opt = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: this.reportType ? true : false,
          position: 'bottom'
        },
      }
      // Add intersection mode to get all data in tooltip legend
      if (this.reportType) {
        // Allow to aggregate data by month
        opt.tooltips= {
          mode: 'index',
          axis: 'x',
        },
        opt.scales = {
          yAxes: [{
            ticks: {
              stepSize: 0.2,
            },
          }]
        }
      }

      return opt
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },
    myStyles(){
      return {
        height: this.reportType ? '250px' : '200px',
        position: 'relative'
      }
    }
  }
}
</script>