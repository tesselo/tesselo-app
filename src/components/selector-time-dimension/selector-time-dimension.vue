<template>
  <div>
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
      <div class="header-title">
        <div class="current-time">Jan 2018</div>
        <div class="time-type">Monthly Composite</div>
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
      v-show="showPicker"
      class="picker">
      <div class="picker__top-row d-flex flex-row justify-content-between">
        <div class="picker__year-select">
          <scrollable-tab-menu :list="this.years" />
        </div>
        <div class="picker__type-select" />
      </div>
    </div>
  </div>
</template>
<script>
import ScrollableTabMenu from '@/components/scrollable-tab-menu/scrollable-tab-menu'

export default {
  name: 'SelectorTimeDimension',
  components: {
    ScrollableTabMenu
  },
  props: {
    showPicker: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    let years = []
    for(let i = 0; i < 50; i++) {
      years.push({ label: 2000 + i })
    }
    return {
      years
    }
  }
}
</script>
<style lang="scss" scoped>
  .header {
    min-width: 400px;
    min-height: 60px;
    background-color: white;
    background-repeat: 2px;
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

  .header-title {
    text-align: center;
  }
  
  .current-time {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
  }

  .time-type {
    font-size: 14px;
    line-height: 20px;
  }
  
  .picker__top-row {
    height: 40px;
  }

  .picker__year-select {
    max-width: 300px;
  }

  .picker__type-select {
    width: 100px;
  }
</style>
