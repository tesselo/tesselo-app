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
    <div v-if="!loading && selectedReport && finished">
      <bar-chart
        :width="500"
        :height="300"
        :labels="labels"
        :datasets="datasets" />
    </div>
    <div
      class="report-unfinished d-flex flex-column justify-content-center align-items-center"
      v-if="!finished && !loading">
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
  props: {
    isNewReport: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      secondsToRetry: null,
      finished: false,
      allReports: {}
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment,
      selectedReport: state => state.report.selectedReport,
      reports: state => state.report.reports,
      savedReports: state => state.report.savedReports
    }),
    labels() {
      if (this.allReports[this.selectedReport]) {
        return this.allReports[this.selectedReport].results.map((reportItem) => reportItem.id)
      } else {
        return null
      }
    },
    datasets() {
      if (this.allReports[this.selectedReport]) {
        return [
          {
            data: this.allReports[this.selectedReport].results.map((reportItem) => reportItem.avg),
            label: 'Average',
            backgroundColor: '#aac343'
          }
        ]
      } else {
        return null
      }
    },
    
  },
  watch: {
    selectedFormula: {
      immediate: false,
      handler() {
        this.getReport()
      }
    },
    selectedMoment: {
      immediate: false,
      handler() {
        this.getReport()
      }
    },
    selectedLayer: {
      immediate: false,
      handler() {
        this.getReport()
      }
    },
    reports: {
      immediate: false,
      deep: true,
      handler() {
        this.setAllReports()
      }
    },
    savedReports: {
      immediate: false,
      deep: true,
      handler() {
        this.setAllReports()
      }
    },
    selectedReport() {
      this.setAllReports()
      this.setFinished()
    }
  },
  beforeMount() {
    if (this.isNewReport) {
      this.setFinished()
      this.getReport()
    } else {
      this.setAllReports()
      this.setFinished()

      if (!this.finished) {
        this.getReport()
      }
    }
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
        moment: this.selectedMoment
      })
      .then(() => {
        this.loading = false
        this.setFinished()
        if (!this.finished) {
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
    setFinished() {
      if (this.allReports[this.selectedReport]) {
        this.finished = this.allReports[this.selectedReport].finished
      }
    },
    setAllReports() {
      this.allReports = {
        ...this.reports,
        ...this.savedReports
      }
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

    h2 {
      font-size: 20px;
    }

    p {
      font-size: 16px;
      line-height: 24px;
      margin-top: 8px;
    }
  }

</style>
