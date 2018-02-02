<template>
  <div class="multiple-report">
    <div class="multiple-report__header d-flex flex-row justify-content-between">
      <div class="multiple-report__header-item">
        <div class="multiple-report__header-label">Layer</div>
        <div class="multiple-report__header-title">{{ selectedLayer.name }}</div>
      </div>
      <div class="multiple-report__header-item">
        <div class="multiple-report__header-label">Moment</div>
        <div class="multiple-report__header-title">{{ selectedMoment.nameToShow }}</div>
      </div>
      <div class="multiple-report__header-item">
        <div class="multiple-report__header-label">Formula</div>
        <div class="multiple-report__header-title">{{ selectedFormula.formula }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MultipleReport',
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedFormula: state => state.formula.selectedFormula,
      selectedMoment: state => state.time.selectedMoment
    })
  }
}
</script>
<style lang="scss" scoped>

  .multiple-report {
    min-width: 500px;
  }

  .multiple-report__header {
    width: 100%;
    margin-top: 20px;

    &-item {
      padding: 5px 20px;

      &:not(:first-of-type) {
        border-left: 1px solid rgba($lynch, 0.4);
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
</style>
