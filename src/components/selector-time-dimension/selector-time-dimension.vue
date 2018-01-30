<template>
  <div class="selector-time-dimension">
    <div class="header d-flex flex-row justify-content-between align-items-center">
      <a
        href="javascript:void(0)"
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
        <div class="header__current-time">Jan 2018</div>
        <div class="header__time-type">Monthly Composite</div>
      </div>
      <a
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
      v-if="showPicker"
      class="d-flex flex-row justify-content-center text-center">
      <div
        v-if="currentTimeType === 'Monthly'"
        class="selector-time-dimension__items d-flex flex-row justify-content-between">
        <a
          href="javascript:void(0)"
          v-for="month in months"
          :key="month"
          :title="month"
          class="selector-time-dimension__item">
          {{ month }}
        </a>
      </div>
      <div
        v-if="currentTimeType === 'Weekly'"
        class="selector-time-dimension__items d-flex flex-row flex-wrap justify-content-start">
        <a
          href="javascript:void(0)"
          v-for="(week, index) in weeks"
          :key="week"
          :title="week"
          :class="['selector-time-dimension__item', { 'selector-time-dimension__item--active': index === currentItemIndex }]">
          {{ week }}
        </a>
      </div>
      <div
        v-if="currentTimeType === 'Scenes'"
        class="selector-time-dimension__items d-flex flex-row flex-wrap justify-content-start">
        <a
          href="javascript:void(0)"
          v-for="(scene, index) in scenes"
          :key="scene"
          :title="scene"
          :class="['selector-time-dimension__item', { 'selector-time-dimension__item--active': index === currentItemIndex }]">
          {{ scene }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
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
      currentItemIndex: 10
    }
  },
  computed: {
    months: () => {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dez']
    },
    years: () => {
      let years = []
      for(let i = 0; i <= 30; i++) {
        years.push({ label: 1988 + i })
      }
      return years
    },
    weeks: () => {
      let weeks = []

      for (let i = 1; i <= 52; i++) {
        weeks.push(i)
      }

      return weeks
    },
    scenes: () => {
      let scenes = []

      for (let i = 1; i <= 140; i++) {
        scenes.push(i)
      }

      return scenes
    }
  },
  methods: {
    setTimeType(newType) {
      this.currentTimeType = newType
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
    margin: 5px 5px;
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
</style>
