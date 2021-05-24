<template>
  <line-chart
    :options="options"
    :height="height"
    :styles="myStyles"
    :chart-data="chartData" />
</template>

<script>
import LineChart from './reactive-line-chart'

export default {

  components: {
    LineChart
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
    stacked: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    options() {
      const opt = {
        maintainAspectRatio: false,
        legend: false,
        layout: {
          padding: {
              top: 2 // half border width
          },
        },
        tooltips: {
          mode: 'index',
          axis: 'x',
          intersect: false,
        }
        // interaction: {
        //   mode: 'index',
        //   intersect: false,
        // }
      }
      // Add stacked options if required.
      if (false /*this.stacked*/) {
        opt.scales = {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
          }]
        }
        opt.fill = true
        
      }
      return opt
    },
    chartData() {
      return {
        labels: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
        datasets: [{backgroundColor: "#aac343", borderColor: "#aac343", data: 
        [0.4,0.6,0.7,NaN,0.7,0.7,0.7,0.6,0.5,NaN,0.3,0.3],
        fill: false,label: "2020 - Average",spanGaps: false},
        {backgroundColor: "red", borderColor: "red", data: 
        [0.7,0.5,0.5,0.1,0.4,0.9,0.8,0.3,0.2,0.7,0.4,0.5],
        fill: false,label: "2021 - Average",spanGaps: false}
        ]
      }
    },
    myStyles(){
      return {
        height: "200px",
        position: 'relative'
      }
    }
  }
}
</script>
