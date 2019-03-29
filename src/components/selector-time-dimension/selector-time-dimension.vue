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
        <div v-if="selectedMoment && !loading">
          <div
            v-if="!isScenes && !isCustom"
            class="header__current-time">{{ selectedMoment.name }}</div>
          <div
            v-if="isScenes && !isCustom"
            class="header__current-time">{{ getSceneDate }}</div>
          <div
            v-if="!isScenes && isCustom"
            class="header__current-time">{{ getSceneDate }}</div>
          <div class="header__time-type">{{ currentTimeType }} Composite</div>
        </div>
        <div v-else-if="!selectedMoment && !loading">
          <div class="scene-details-empty-state">
            No data available
          </div>
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
      v-if="showPicker && isScenes"
      class="picker">
      <div class="picker__top-row picker__month d-flex flex-row jjustify-content-center">
        <div class="picker__month-select">
          <scrollable-tab-menu
            :show-navigation="false"
            :list="months"
            :start-at-index="tabMenuActiveMonthIndex"
            @selected="setMonth($event)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="showPicker && !loading && isScenes && momentsList && momentsList.length"
      class="scenes-view">
      <div class="scenes-view__container">
        <div class="scenes-view__calendar">
          <div class="scenes-view__calendar-labels">
            <span
              v-for="(day, index) in daysOfWeek"
              :key="`label-${index}`"
              class="is-label">
              {{ day }}
            </span>
            <span
              v-for="(data, index) in detailedDaysOfMonth"
              :key="`day-${index}`"
              :class="{
                'has-scene': data.moments && data.moments.length,
                'active': detailedSceneActive ? detailedSceneActive.day === data.day : false
              }"
              @click="setDetailedScene(data)">
              <template v-if="data.day !== -1">
                {{ data.day }}
              </template>
            </span>
          </div>
        </div>
        <div class="scenes-view__details">
          <template v-if="!detailedSceneActive">
            <div class="scene-details-empty-state">
              No data available
            </div>
          </template>
          <template v-else>
            <div class="scene-details-date">
              {{ months[activeMonth].completed }} {{ detailedSceneActive.day }}
            </div>
            <div class="scene-details-weekday">
              {{ getSceneWeekDay }}
            </div>
            <el-select
              v-model="sceneMomentIndexSelected"
              class="scene-details-location"
              placeholder="Select">
              <el-option
                v-for="(sceneMGRS, index) in getScenesMGRS"
                :key="sceneMGRS"
                :label="sceneMGRS"
                :value="index"/>
            </el-select>
            <div v-if="detailedSceneActive.moments.length > 1">
              Dropdown
            </div>
            <div class="scene-details-info">
              <div v-if="detailedSceneActive.moments[sceneMomentIndexSelected].cloudyPixelPercentage">
                <b>Cloud coverage: </b>
                {{ detailedSceneActive.moments[sceneMomentIndexSelected].cloudyPixelPercentage }}%
              </div>
              <div v-if="detailedSceneActive.moments[sceneMomentIndexSelected].dataCoveragePercentage">
                <b>Data coverage: </b>
                {{ detailedSceneActive.moments[sceneMomentIndexSelected].dataCoveragePercentage }}%
              </div>
              <div v-if="detailedSceneActive.moments[sceneMomentIndexSelected].angleAzimuth">
                <b>Azimuth angle: </b>
                {{ Number(detailedSceneActive.moments[sceneMomentIndexSelected].angleAzimuth).toFixed(2) }}º
              </div>
              <div v-if="detailedSceneActive.moments[sceneMomentIndexSelected].level">
                <b>Process level: </b>
                {{ detailedSceneActive.moments[sceneMomentIndexSelected].level.toUpperCase() }}
              </div>
              <div v-if="detailedSceneActive.moments[sceneMomentIndexSelected].status">
                <b>Status: </b>
                {{ detailedSceneActive.moments[sceneMomentIndexSelected].status }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="showPicker && !loading && !isScenes && momentsList && momentsList.length"
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
import { debounce, cloneDeep } from 'lodash'

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
      sceneSelectedValue: new Date(),
      months: [
        {
          label: 'Jan',
          completed: 'January'
        },
        {
          label: 'Feb',
          completed: 'February'
        },
        {
          label: 'Mar',
          completed: 'March'
        },
        {
          label: 'Apr',
          completed: 'April'
        },
        {
          label: 'May',
          completed: 'May'
        },
        {
          label: 'Jun',
          completed: 'June'
        },
        {
          label: 'Jul',
          completed: 'July'
        },
        {
          label: 'Aug',
          completed: 'August'
        },
        {
          label: 'Sep',
          completed: 'September'
        },
        {
          label: 'Oct',
          completed: 'October'
        },
        {
          label: 'Nov',
          completed: 'November'
        },
        {
          label: 'Dec',
          completed: 'December'
        },
      ],
      tabMenuActiveMonthIndex: 0,
      activeMonth: 0,
      daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      detailedDaysOfMonth: [],
      detailedSceneActive: null,
      sceneMomentIndexSelected: 0,
      loadLastMonthScene: false
    }
  },
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      momentsList: state => state.time.list,
      selectedMoment: state => state.time.selectedMoment,
    }),
    getSceneWeekDay () {
      if (!this.detailedSceneActive) return ''

      const date = new Date(this.activeYear, this.activeMonth, this.detailedSceneActive.day)
      const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return weekDays[date.getDay()]
    },

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
    },

    isScenes () {
      return this.currentTimeType === 'Scenes'
    },

    isCustom () {
      return this.currentTimeType === 'Custom'
    },

    isMonthly () {
      return this.currentTimeType === 'Monthly'
    },

    getScenesMGRS () {
      return this.detailedSceneActive.moments.reduce((acc, val) => {
        acc.push(val.mgrs)
        return acc
      }, [])
    },

    getSceneDate(){
      if(this.detailedSceneActive){
        return `${this.detailedSceneActive.day} ${this.months[this.activeMonth].completed} ${this.activeYear}`;
      }
      return `${this.months[this.activeMonth].completed} ${this.activeYear}`;
    }
  },
  watch: {
    activeYear: {
      immediate: true,
      handler(newVal) {
        this.year = newVal
        this.setYearsActiveIndex()
        this.handleScenesData()
        this.$router.replace({query: {...this.$route.query, year: this.year}})
      }
    },
    activeMonth () {
      this.handleScenesData()
    },
    momentsList () {
      this.handleScenesData()
      this.checkClosestMoment()
    },
    currentTimeType (newValue) {
      if (newValue !== 'Scenes') {
        this.detailedSceneActive = null
      }
    },
    sceneMomentIndexSelected () {
      this.selectMoment(this.detailedSceneActive.moments[this.sceneMomentIndexSelected])
    },
    selectedMoment(newVal){
      if(newVal)this.$router.replace({query: {...this.$route.query, selectedMoment: this.selectedMoment.id}})
      if(!newVal && this.$route.query.selectedMoment){
        this.$router.replace({query: {...this.$route.query, selectedMoment: '' }})
      }
    }
  },

  mounted () {
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
    checkClosestMoment () {
      if (this.isMonthly) {

        if (!this.selectedMoment) {
          if (this.momentsList && this.momentsList.length) {
            this.selectMomentAction(this.momentsList[0])
          }
          return
        }

        // Check if in the current moments' list is the same month as the one from @selectedMoment
        const momentIndex = this.momentsList.findIndex(moment => new Date(moment.minDate).getMonth() === new Date(this.selectedMoment.minDate).getMonth())

        // If not exists, we need to check the closest one
        if (momentIndex === -1) {
          const selectedMomentMonth = new Date(this.selectedMoment.minDate).getMonth()

          // Check if there is a month available that is bigger than the @selectedMoment
          const selectedMoment = this.momentsList.some(moment => {
            const auxiliarMonth = new Date(moment.minDate).getMonth()
            if (auxiliarMonth > selectedMomentMonth) {
              this.selectMomentAction(moment)
              return true
            }
          })

          // If there is not an available month bigger than the current @selectedMoment, let's set the last one of the list
          if (!selectedMoment) {
            this.selectMomentAction(this.momentsList[this.momentsList.length - 1])
          }
        } else {
          // if same month exists on the list, just set it
          this.selectMomentAction(this.momentsList[momentIndex])
        }
      }
    },

    handleScenesData () {
      this.detailedSceneActive = null

      if (this.isScenes) {
        this.detailedDaysOfMonth = this.getDetailedDaysOfMonth(this.activeYear, this.activeMonth)
        this.setDetailedScene()
      }
    },

    setDetailedScene (data) {
      if (!data) {
        let data
        if (this.loadLastMonthScene) {
          this.loadLastMonthScene = false
          data = cloneDeep(this.detailedDaysOfMonth)
            .reverse()
            .find(data => data.moments && data.moments.length)
        } else {
          data = this.detailedDaysOfMonth.find(data => data.moments && data.moments.length)
        }
        this.detailedSceneActive = data
      } else if (data.moments && data.moments.length) {
        this.detailedSceneActive = data
      }

      if (this.sceneMomentIndexSelected !== 0) {
        this.sceneMomentIndexSelected = 0
      } else if (this.detailedSceneActive) {
        this.selectMoment(this.detailedSceneActive.moments[this.sceneMomentIndexSelected])
      }
    },

    selectPreviousScene () {
      const sceneActiveDayIndex = this.detailedDaysOfMonth.findIndex(data => data.day === this.detailedSceneActive.day)
      const leftArray = cloneDeep(this.detailedDaysOfMonth).slice(0, sceneActiveDayIndex).reverse()
      const newIndex = leftArray.findIndex(data => data.moments && data.moments.length > 0)

      // Navigate to previous day in current month
      if (newIndex >= 0) {
        this.setDetailedScene(leftArray[newIndex])
      } else {
        if (this.activeMonth === 0) { // Navigate for december of previous year
          this.year--
          this.setYearsActiveIndex()
          this.activeMonth = 11
        } else { // Navigate for previous month
          this.activeMonth--
        }

        this.tabMenuActiveMonthIndex = this.activeMonth
        this.loadLastMonthScene = true
      }
    },

    selectNextScene () {
      let sceneActiveDayIndex = this.detailedDaysOfMonth.findIndex(data => data.day === this.detailedSceneActive.day)
      const rightArray = cloneDeep(this.detailedDaysOfMonth).slice(++sceneActiveDayIndex)
      const newIndex = rightArray.findIndex(data => data.moments && data.moments.length > 0)

      // Navigate to next day in current month
      if (newIndex >= 0) {
        this.setDetailedScene(rightArray[newIndex])
      } else {
        if (this.activeMonth === 11) { // Navigate for january of next year
          this.year++
          this.setYearsActiveIndex()
          this.activeMonth = 0
        } else {
          this.activeMonth++ // Navigate for next month
        }

        this.tabMenuActiveMonthIndex = this.activeMonth
      }
    },

    getDetailedDaysOfMonth (year, month) {
      const firstDay = (new Date(year, month)).getDay();
      const totalDaysInMonth = 32 - new Date(year, month, 32).getDate();
      const daysInMonth = []

      // Add placeholder days if 1st day of month start in other than Monday
      for (let i = 0 ; i < firstDay; i++) {
        daysInMonth.push({
          day: -1
        })
      }

      //
      const filteredMoments = this.momentsList.filter(moment => {
        const date = moment.date.split('-')
        const year = Number(date[0])
        let month = date[1].charAt(0) === '0' ? Number(date[1].charAt(1)) : Number(date[1])

        // Decrement 1 to month, since it start at 0 (January)
        month--

        return year === this.activeYear && month === this.activeMonth
      })

      // Add the days of the respective month
      // filtered scenes by day
      for (let j = 1 ; j <= totalDaysInMonth; j++) {
        const filteredMomentsByDay = filteredMoments.filter(moment => {
          const date = moment.date.split('-')
          const day = date[2].charAt(0) === '0' ? Number(date[2].charAt(1)) : Number(date[2])

          return day === j
        })

        daysInMonth.push({
          day: j,
          moments: filteredMomentsByDay
        })
      }
      return daysInMonth
    },

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
      this.activeMonth=0;
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

    setMonth (data) {
      this.activeMonth = this.months.findIndex(month => month.label === data.label)
      this.$router.replace({query: {...this.$route.query, month: this.activeMonth}})
    },

    update(autoSelect) {
      this.$router.replace({query: {...this.$route.query, currentTimeType: this.currentTimeType}})
      this.getList(this.currentTimeType, autoSelect)
    },

    selectMoment(moment) {
      this.selectMomentAction(moment)
    },
    selectPreviousMoment() {
      if (!this.selectedMoment) return

      if (this.isScenes) {
        this.selectPreviousScene()
        return
      }

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

      if (this.isScenes) {
        this.selectNextScene()
        return
      }

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

  .picker__month {
    padding-left: 30px;
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

  .scenes-view {
    &__container {
      display: flex;
    }

    &__calendar {
      flex: 1;
      display: flex;
      margin: 26px 40px;
      padding-bottom: 6px;
      border-radius: 3px;
      border: 1px solid $pale-grey;
    }

    &__calendar-labels {
      position: relative;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      &::before {
        content: '';
        position: absolute;
        top: 34px;
        left: 0;
        right: 0;
        height: 1px;
        background-color: $pale-grey;
      }

      .column {
        flex-basis: 100%;
      }

      span {
        position: relative;
        margin-top: 4px;
        padding: 6px 0 12px;
        font-size: 14px;
        width: 14%;
        text-align: center;
        color: $bluey-grey;
        font-style: italic;

        &.is-label,
        &.has-scene {
          color: $navy;
          font-style: normal;
        }

        &.active {
          background-color: $lynch;
          color: white;
          cursor: default;
          border-radius: 3px;
        }

        &.has-scene:not(.active) {
          cursor: pointer;
          border-radius: 3px;

          &:hover {
            background-color: $pale-grey;
            color: $navy;
          }
        }

        &.has-scene::before {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: $booger;
          transform: translateX(-50%);
        }
      }
    }

    &__details {
      flex: 1;

      .scene-details-empty-state {
        margin-top: 40px;
        font-size: 20px;
      }

      .scene-details-date {
        margin-top: 25px;
        font-size: 20px;
        font-weight: 600;
        color: $navy;
      }

      .scene-details-weekday {
        position: relative;
        padding-bottom: 16px;
        margin-top: 8px;
        font-size: 15px;
        font-weight: 500;
        color: $slate-grey;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 30px;
          height: 1px;
          background-color: $pale-grey;
        }
      }

      .scene-details-location {
        position: relative;
        margin-top: 12px;

        &::before {
          content: 'Location: ';
          position: absolute;
          z-index: 1;
          top: 11px;
          left: 18px;
          color: $navy;
        }

        /deep/ .el-input {
          max-width: 180px;
        }

        /deep/ input {
          padding-left: 90px;
        }
      }

      .scene-details-info {
        margin-top: 14px;
        font-size: 14px;

        > div {
          margin-top: 8px;
        }

        b {
          font-weight: 600;
          color: $navy;
        }
      }
    }
  }
</style>
