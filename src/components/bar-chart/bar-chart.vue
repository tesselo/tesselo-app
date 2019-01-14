<template>
  <horizontal-bar
    ref="horizontalBar"
    :width="width"
    :height="height"/>
</template>

<script>
import { HorizontalBar } from 'vue-chartjs'

export default {
  name: 'BarChart',
  // extends: HorizontalBar,

  components: {
    HorizontalBar
  },

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

  data () {
    return {
      width: 500,
    }
  },

  created () {
    const BAR_LINE_HEIGHT = 40
    this.height = this.labels.length * BAR_LINE_HEIGHT
  },

  mounted () {
    this.$refs.horizontalBar.renderChart({
      labels: this.labels,
      datasets: this.datasets
    }, {
      responsive: true
    })
    // this.renderChart({
    //   labels: ['Jan...', 'February'],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [40, 20]
    //     }
    //   ]},
    //   {
    //     responsive: true
    //   }
    // )
  }
}
</script>
