<template>
  <div class="multiple-report">
    <div class="multiple-report__header d-flex flex-row justify-content-between">
      <div class="multiple-report__header-item">
        <div class="multiple-report__header-label">Layer</div>
        <div class="multiple-report__header-title">{{ selectedLayer.name }}</div>
      </div>
      <div class="multiple-report__header-item"> 
        <div class="multiple-report__header-label">Moment</div>
        <div class="multiple-report__header-title">{{ selectedMoment.name }}</div>
      </div>
      <div class="multiple-report__header-item">
        <div class="multiple-report__header-label">Formula</div>
        <div class="multiple-report__header-title">{{ selectedFormula.acronym }}</div>
      </div>
    </div>
    <div
      v-if="loading"
      class="multiple-report__loading d-flex flex-row justify-content-center align-items-center">
      <div class="spinner twilight" />
    </div>
    <div v-if="!loading && selectedReport && reportFinished">
      <bar-chart
        :width="500"
        :height="300"
        :labels="labels"
        :datasets="datasets" />
    </div>
    <div
      class="report-unfinished d-flex flex-column justify-content-center align-items-center"
      v-if="!reportFinished">
      <h2>The selected report is not ready yet.</h2>
      <p>Trying again in {{ secondsToRetry }} seconds</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/services/constants'
import BarChart from '@/components/bar-chart/bar-chart'

export default {
  name: 'MultipleReport',
  components: {
    BarChart
  },
  data() {
    return {
      loading: false,
      secondsToRetry: null,
      reportFinished: false
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      selectedReport: state => state.report.selectedReport,
      reports: state => state.report.reports
    }),
    labels() {
      return this.reports[this.selectedReport].report.map((reportItem) => reportItem.id)
    },
    datasets() {
      return [
        {
          data: this.reports[this.selectedReport].report.map((reportItem) => reportItem.avg),
          label: 'Average',
          backgroundColor: '#aac343'
        }
      ]
    },

  },
  watch: {
    selectedFormula() {
      this.getReport()
    },
    selectedMoment() {
      this.getReport()
    },
    selectedLayer() {
      this.getReport()
    },
    report() {
      console.log('report watcher')

    }
  },
  mounted() {
    this.getReport()
  },
  beforeDestroy() {
    clearInterval(this.countdown)
  },
  methods: {
    ...mapActions('report', {
      getMultipleRegionReportAction: actionTypes.REPORT_GET_MULTIPLE_REGION
    }),
    getReport() {
      this.loading = true
      clearInterval(this.countdown)

      this.getMultipleRegionReportAction({
        layer: this.selectedLayer,
        formula: this.selectedFormula,
        moment: this.selectedMoment,
        loadFromMemory: this.reportFinished
      })
      .then(() => {
        this.loading = false

        if (!this.checkReportFinished()) {
          this.secondsToRetry = 5
          this.countdown = setInterval(() => {
            this.secondsToRetry = this.secondsToRetry - 1

            if (this.secondsToRetry == 0) {
              this.getReport()
              this.secondsToRetry = null
              clearInterval(this.countdown)
            }
          }, 1000)
        }
      })
    },
    checkReportFinished() {
      if (!this.reports[this.selectedReport]) {
        this.reportFinished = false
      }
      this.reportFinished =  this.reports[this.selectedReport].report.reduce((accumulator, reportItem) => reportItem.status === 'Finished' && accumulator, true)
      return this.reportFinished
    }
  }
}
</script>
<style lang="scss" scoped>

  .multiple-report {
    min-width: 500px;
    max-width: 700px;
  }

  .multiple-report__header {
    width: 100%;
    margin-top: 20px;

    &-item {
      flex: 1 0;
      padding: 5px 0;

      &:not(:first-of-type) {
        border-left: 1px solid rgba($lynch, 0.4);
        padding-left: 20px;
      }
    }

    &-label {
      font-size: 13px;
      line-height: 18px;
      font-weight: 400;
      color: $lynch;
    }

    &-title {
      font-size: 15px;
      line-height: 20px;
      font-weight: 600;
      color: $lynch;
    }
  }

  .multiple-report__loading {
    width: 100%;
    height: 300px;

    .spinner {
      width: 30px;
      height: 30px;
    }
  }

  .report-unfinished {
    width: 100%;
    height: 300px;
  }

</style>
