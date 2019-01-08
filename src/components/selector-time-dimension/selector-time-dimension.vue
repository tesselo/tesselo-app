<template>
  <div class="selector-time-dimension">
    <div
      :class="['header d-flex flex-row align-items-center', {
        'justify-content-between': selectedMoment,
        'justify-content-center': !selectedMoment
    }]">
      <div class="navigator-wrapper">
        <a
          v-if="selectedMoment"
          href="javascript:void(0)"
          class="navigator d-flex flex-column justify-content-center align-items-center"
          @click="selectPreviousMoment"
        >
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
      </div>
      <div class="header-text">
        <div v-if="selectedMoment">
          <div class="header__current-time">{{ selectedMoment.name }}</div>
          <div class="header__time-type">{{ currentTimeType }} Composite</div>
        </div>
        <div
          v-else
          class="spinner twilight" />
      </div>
      <div class="navigator-wrapper">
        <a
          v-if="showNextButton"
          href="javascript:void(0)"
          class="navigator d-flex flex-column justify-content-center align-items-center"
          @click="selectNextMoment"
        >
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
    </div>
    <div
      v-if="showPicker"
      class="picker">
      <div class="picker__top-row d-flex flex-row justify-content-center">
        <div class="picker__type-select d-flex flex-row justify-content-center align-items-center">
          <simple-toggle
            :list="timeTypes"
            :active-index="timeTypes.indexOf(currentTimeType)"
            @change="setTimeType" />
        </div>
      </div>
    </div>
    <div
      v-if="showPicker"
      class="picker">
      <div class="picker__top-row d-flex flex-row jjustify-content-center">
        <div class="picker__year-select">
          <scrollable-tab-menu
            :list="years"
            :start-at-index="yearsActiveIndex"
            @selected="setYear($event.label)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="showPicker && !loading && momentsList && momentsList.length"
      class="d-flex flex-row justify-content-center text-center">
      <div
        v-if="momentsList"
        class="selector-time-dimension__items d-flex flex-row flex-wrap justify-content-start">
        <el-popover
          v-for="item in momentsList"
          :key="item.id"
          :open-delay="200"
          :title="popoverTitle(item)"
          trigger="hover"
          class="select-time-dimension__popover"
          placement="top"
          transition="none"
        >
          <a
            slot="reference"
            :title="item.name"
            :class="['selector-time-dimension__item', { 'selector-time-dimension__item--active': item.id === selectedMoment.id }]"
            href="javascript:void(0)"
            @click="selectMoment(item)"
          >
            {{ item.nameToShow }}
          </a>
        </el-popover>
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
      v-if="!loading && momentsList && momentsList.length === 0 && showPicker"
      class="no-results-panel text-center d-flex flex-row justify-content-center align-items-center">
      <h1>No results to display.</h1>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'

import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/services/constants'
import { Popover as ElPopover } from 'element-ui'
import 'element-ui/lib/theme-chalk/popover.css'

import ScrollableTabMenu from '@/components/scrollable-tab-menu/scrollable-tab-menu'
import SimpleToggle from '@/components/simple-toggle/simple-toggle'

export default {
  name: 'SelectorTimeDimension',
  components: {
    ScrollableTabMenu,
    SimpleToggle,
    ElPopover
  },
  props: {
    showPicker: {
      type: Boolean,
      required: true
    },
    activeYear: {
      type: Number,
      default: (new Date()).getFullYear()
    }
  },
  data() {
    return {
      timeTypes: ['Monthly', 'Scenes', 'Custom'],
      currentTimeType: 'Monthly',
      currentItemIndex: 10,
      loading: false,
      yearsActiveIndex: 0,
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      momentsList: state => state.time.list,
      selectedMoment: state => state.time.selectedMoment,
    }),
    years() {
      const years = []
      for (let i = 0; i <= ((new Date().getFullYear()) - 1988); i++) {
        years.push({ label: 1988 + i})
      }
      return years
    },
    showPreviousButton() {
      if (!this.selectedMoment) {
        return false
      }

      const isFirstItemInList = this.selectedMoment.index === 0
      const isFirstYear = this.yearsListActiveIndex === 0
      const isFirstItem = isFirstItemInList && isFirstYear
      return this.selectedMoment && !isFirstItem
    },
    showNextButton() {
      if (!this.selectedMoment || !this.momentsList) {
        return false
      }

      const isLastItemInList = this.selectedMoment.index === this.momentsList.length - 1
      const isLastYear = this.yearsListActiveIndex === this.years.length - 1
      const isLastItem = isLastItemInList && isLastYear
      return this.selectedMoment && !isLastItem
    }
  },
  watch: {
    activeYear: {
      immediate: true,
      handler(newVal) {
        this.year = newVal
        this.setYearsActiveIndex()
      }
    }
  },

  mounted() {
    let interval = 'Monthly'
    let toSelect = 'last'

    if (this.selectedMoment) {
      this.year = this.selectedMoment.year
      interval = this.selectedMoment.interval
      toSelect = null
    }

    this.getList(interval, toSelect)

    document.body.addEventListener('keydown', this.handleKeyboardNavigation)
  },

  beforeDestroy () {
    document.body.removeEventListener('keydown', this.handleKeyboardNavigation)
  },

  methods: {
    ...mapActions('time', {
      getListAction: actionTypes.TIME_GET_LIST,
      selectMomentAction: actionTypes.TIME_SELECT_MOMENT
    }),
    debouncedGetList: debounce(function (interval, autoSelect) {
      this.getListAction({
        params: {
          interval,
          aggregationlayer: this.selectedLayer.id,
          year: this.activeYear
        },
        autoSelect
      })
      .then(() => {
        this.loading = false
      })
    }, 1000),
    getList(interval, autoSelect) {
      this.loading = true
      this.debouncedGetList(interval, autoSelect)
    },
    setTimeType(newType) {
      if (this.currentTimeType === newType) {
        return
      }

      this.currentTimeType = newType
      this.update('last')
    },

    selectNextType () {
      let nextTypeIndex = this.timeTypes.findIndex(type => type === this.currentTimeType)

      if (nextTypeIndex === this.timeTypes.length - 1) {
        nextTypeIndex = 0
      } else {
        nextTypeIndex++
      }

      this.setTimeType(this.timeTypes[nextTypeIndex])
    },

    selectPreviousType () {
      let nextTypeIndex = this.timeTypes.findIndex(type => type === this.currentTimeType)

      if (nextTypeIndex === 0) {
        nextTypeIndex = this.timeTypes.length - 1
      } else {
        nextTypeIndex--
      }

      this.setTimeType(this.timeTypes[nextTypeIndex])
    },

    setYear(newYear, updateType) {
      this.year = newYear
      this.update(updateType)
      this.$emit('year-change', newYear)
    },
    update(autoSelect) {
      this.getList(this.currentTimeType, autoSelect)
    },
    selectMoment(moment) {
      this.selectMomentAction(moment)
    },
    selectPreviousMoment() {
      if (!this.selectedMoment) return

      const currentIndex = this.selectedMoment.index

      if (this.momentsList.length) {
        if (currentIndex === 0) {
          this.setYear(this.year - 1, 'last')
        } else {
          this.selectMoment(this.momentsList[currentIndex - 1])
        }
      } else {
        this.setYear(this.year - 1, 'first')
      }
    },
    selectNextMoment() {
      if (!this.selectedMoment) return

      const currentIndex = this.selectedMoment.index

      if (this.momentsList.length) {
        const isLast = currentIndex === this.momentsList.length - 1

        if (isLast) {
          this.setYear(this.year + 1, 'first')
        } else {
          this.selectMoment(this.momentsList[currentIndex + 1])
        }
      } else {
        this.setYear(this.year + 1, 'first')
      }
    },
    popoverTitle(item) {
      if (item.type === 'Weekly' || item.type === 'Monthly' || item.type == 'Custom') {
        return item.minDate + ' to ' + item.maxDate
      } else {
        return item.date
      }
    },
    setYearsActiveIndex() {
      let currentIndex
      this.years.forEach((year, index) => {
        if (year.label == this.year) {
          this.yearsActiveIndex = index
        }
      })
      return currentIndex
    },

    handleKeyboardNavigation (e) {
      const event = e || window.event
      const keyCode = event.keyCode || event.which
      const ARROW_KEY_CODES = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      }

      if (event.shiftKey) {
        switch (keyCode) {
          case ARROW_KEY_CODES.LEFT: this.selectPreviousMoment(); break;
          case ARROW_KEY_CODES.UP:  this.selectNextType(); break;
          case ARROW_KEY_CODES.RIGHT: this.selectNextMoment(); break;
          case ARROW_KEY_CODES.DOWN: this.selectPreviousType(); break;
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .selector-time-dimension {
    width: 100vw;
    @media (min-width: 768px) {
      width: 700px;
    }
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

  .navigator-wrapper {
    width: 30px;
    height: 100;
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
    width: 100%;
  }

  .picker__type-select {
    padding-right: 10px;
  }

  .selector-time-dimension__items {
    max-height: 220px;
    overflow: auto;
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

    h1 {
      font-size: 24px;
    }
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
