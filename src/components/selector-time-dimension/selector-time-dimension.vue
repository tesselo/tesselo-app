<template>
  <div class="selector-time-dimension">
    <div 
      :class="['header d-flex flex-row align-items-center', {
        'justify-content-between': selectedMoment,
        'justify-content-center': !selectedMoment
    }]">
      <a
        v-if="selectedMoment"
        href="javascript:void(0)"
        @click="selectPreviousMoment"
        class="navigator d-flex flex-column justify-content-center align-items-center">
        <svg
          class="arrow-left"
          width="18"
          height="18"
          x="0px"
          y="0px"
          viewBox="0 0 55.271 125">
          <path
            fill="#000000"
            d="M5.271,100c-1.349,0-2.697-0.515-3.727-1.544c-2.059-2.059-2.059-5.395,0-7.454L42.546,50L1.544,8.998  c-2.059-2.059-2.059-5.395,0-7.454s5.395-2.059,7.454,0l44.729,44.729c2.059,2.059,2.059,5.395,0,7.454L8.998,98.456  C7.969,99.485,6.62,100,5.271,100z"
          />
        </svg>
      </a>
      <div class="header-text">
        <div v-if="selectedMoment">
          <div class="header__current-time">{{ selectedMoment.name }}</div>
          <div class="header__time-type">{{ currentTimeType }} Composite</div>
        </div>
        <div
          v-else
          class="spinner twilight" />
      </div>
      <a
        v-if="selectedMoment"
        @click="selectNextMoment"
        href="javascript:void(0)"
        class="navigator d-flex flex-column justify-content-center align-items-center">
        <svg
          width="18"
          height="18"
          x="0px"
          y="0px"
          viewBox="0 0 55.271 125">
          <path
            fill="#000000"
            d="M5.271,100c-1.349,0-2.697-0.515-3.727-1.544c-2.059-2.059-2.059-5.395,0-7.454L42.546,50L1.544,8.998  c-2.059-2.059-2.059-5.395,0-7.454s5.395-2.059,7.454,0l44.729,44.729c2.059,2.059,2.059,5.395,0,7.454L8.998,98.456  C7.969,99.485,6.62,100,5.271,100z"
          />
        </svg>
      </a>
    </div>
    <div
      v-if="showPicker"
      class="picker">
      <div class="picker__top-row d-flex flex-row justify-content-between">
        <div class="picker__year-select">
          <scrollable-tab-menu
            @selected="setYear"
            :list="years"
            :start-at-index="years.length - 1" />
        </div>
        <div class="picker__type-select d-flex flex-row justify-content-center align-items-center">
          <simple-toggle
            :list="timeTypes"
            :active-index="timeTypes.indexOf(currentTimeType)"
            @change="setTimeType" />
        </div>
      </div>
    </div>

    <div
      v-if="showPicker && !loading && momentsList && momentsList.length"
      class="d-flex flex-row justify-content-center text-center">
      <div
        v-if="momentsList"
        class="selector-time-dimension__items d-flex flex-row flex-wrap justify-content-start">
        <a
          href="javascript:void(0)"
          v-for="item in momentsList"
          @click="selectMoment(item)"
          :key="item.id"
          :title="item.name"
          :class="['selector-time-dimension__item', { 'selector-time-dimension__item--active': item.id === selectedMoment.id }]">
          {{ item.nameToShow }}
        </a>
      </div>
    </div>

    <div
      v-if="showPicker && loading"
      class="spinner-panel">
      <div class="spinner-wrapper">
        <div class="spinner twilight" />
      </div>
    </div>

    <div
      v-if="!loading && momentsList && momentsList.length === 0"
      class="no-results-panel text-center d-flex flex-row justify-content-center align-items-center">
      <h1>No results to display.</h1>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/services/constants'

import ScrollableTabMenu from '@/components/scrollable-tab-menu/scrollable-tab-menu'
import SimpleToggle from '@/components/simple-toggle/simple-toggle'

export default {
  name: 'SelectorTimeDimension',
  components: {
    ScrollableTabMenu,
    SimpleToggle
  },
  props: {
    showPicker: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      timeTypes: ['Monthly', 'Weekly', 'Scenes'],
      currentTimeType: 'Monthly',
      currentItemIndex: 10,
      loading: false,
      year: 2018
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      momentsList: state => state.time.list,
      selectedMoment: state => state.time.selectedMoment
    }),
    years: () => {
      const years = []
      for (let i = 0; i <= 30; i++) {
        years.push({ label: 1988 + i})
      }
      return years
    }
  },
  mounted() {
    this.loading = true
    this.getComposites({ interval: 'Monthly' })
  },
  methods: {
    ...mapActions('time', {
      getCompositesAction: actionTypes.TIME_GET_COMPOSITES,
      getUniquesAction: actionTypes.TIME_GET_UNIQUES,
      selectMomentAction: actionTypes.TIME_SELECT_MOMENT
    }),
    getComposites({ interval }) {
      this.loading = true
      this.getCompositesAction({
        interval,
        aggregationlayer: this.selectedLayer.id,
        year: this.year
      })
      .then(() => {
        this.loading = false
      })
    },
    getUniques() {
      this.loading = true
      this.getUniquesAction({
        aggregationlayer: this.selectedLayer.id,
        year: this.year
      }).then(() => {
        this.loading = false
      })
    },
    setTimeType(newType) {
      if (this.currentTimeType === newType) {
        return
      }

      this.currentTimeType = newType
      this.update()
    },
    setYear(newYear) {
      this.year = newYear.label
      this.update()
    },
    update() {
      if (this.currentTimeType == 'Scenes') {
        this.getUniques()
      } else {
        this.getComposites({ interval: this.currentTimeType })
      }
    },
    selectMoment(moment) {
      this.selectMomentAction(moment)
    },
    selectPreviousMoment() {

    },
    selectNextMoment() {
      
    }
  }
}
</script>
<style lang="scss" scoped>
  .selector-time-dimension {
    width: 700px;
  }

  .header {
    width: 100%;
    min-height: 60px;
    background-color: $palest-grey;
    border-bottom: 1px solid $pale-grey;
  }

  .header svg {
    width: 18px;
    height: 18px;
  }

  .navigator {
    padding: 5px;
    align-self: stretch;

    svg path {
      fill: $navy;
    }

    &:hover svg path {
      fill: $booger;
    }
  }

  .arrow-left {
    transform: translateY(-4px) rotate(180deg);
  }

  .header-text {
    text-align: center;

    .spinner {
      width: 26px;
      height: 26px;
    }
  }
  
  .header__current-time {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
  }

  .header__time-type {
    font-size: 14px;
    line-height: 20px;
  }
  
  .picker__top-row {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid $pale-grey;
  }

  .picker__year-select {
    width: 450px;
  }

  .picker__type-select {
    padding-right: 10px;
  }

  .selector-time-dimension__items {
    max-height: 220px;
    overflow: scroll;
    padding: 15px;
  }

  .selector-time-dimension__item {
    display: block;
    padding: 10px 7px;
    min-width: 40px;
    height: 40px;
    margin: 5px;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    color: $lynch;
    border-radius: 4px;
    border: 1px solid transparent;

    &:hover {
      background-color: $palest-grey;
      border: 1px solid $pale-grey;
    }

    &--active {
      background-color: $booger;
      color: white;

      &:hover {
        background-color: lighten($booger, 4%);
      }
    }
  }

  .no-results-panel {
    height: 220px;
    width: 100%;
  }

  .spinner-panel {
    position: relative;
    height: 220px;
    width: 100%;
  }

  .spinner-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 30px;
    height: 30px;
  }
</style>
