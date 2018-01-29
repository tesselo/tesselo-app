<template>
  <div
    class="scrollable-tab-menu-wrapper"
    v-if="list">
    <div class="scrollable-tab-menu">
      <a
        v-if="showLeftArrow"
        title="left"
        class="scrollable-tab-menu__nav scrollable-tab-menu__nav--left"
        left-icon="cjicon cjicon-arrow-left"
        @click="previous"/>
      <div
        ref="list"
        class="scrollable-tab-menu__list">
        <a
          v-for="(element, index) in list"
          :key="index"
          class="scrollable-tab-menu__element"
          :class="{'scrollable-tab-menu__element--active' : activeElementIndex === index, 'scrollable-tab-menu__element--highlight': hightlightElementAtIndex === index}"
          @click="onClickElement(index)">
          {{ element.label }}
        </a>
      </div>
      <a
        v-if="showRightArrow"
        title="right"
        class="scrollable-tab-menu__nav scrollable-tab-menu__nav--right"
        left-icon="cjicon cjicon-arrow-right"
        @click="next"/>
    </div>
  </div>
</template>

<script>
  // import schema from './cj-scrollable-tab-menu.schema'
  import TslButton from '@/components/tsl-button/tsl-button'
  import TWEEN from '@tweenjs/tween.js'

  /**
   * @event selectionChanged
   * @type {Number} When an element is selected, an event called <code>selected</code> is emmited with the index of selected element as argument.
   */
  export default {
    name: 'CjScrollableTabMenu',

    // == Components
    components: {
      TslButton
    },

    // == Props
    props: {
      /**
       * Array of strings or objects with the text to show on tabs.
       */
      list: {
        type: Array,
        required: true,
        default: () => []
      },
      /**
       * Number. Index of which element from list should start active.
       */
      startAtIndex: {
        type: Number,
        default: 0,
        validator: value => {
          return value >= 0
        }
      },
      /**
       * Number. Index of which element should be highlighted at menu (will have a green circle on the right).
       */
      hightlightElementAtIndex: {
        type: Number,
        default: -1
      }
    },

    // == Data
    data () {
      return {
        TWEEN: TWEEN,
        lastScrollAux: 0,
        referenceElementId: this.startAtIndex + 1,
        activeElementIndex: 0,
        showLeftArrow: false,
        showRightArrow: true,
        leftGap: 45, // 50px of arrow width minus 5px of gap
        rightGap: 55, // 50px of arrow width plus 5px of gap,
        scrollTime: 500,
        listIsArray: false
      }
    },

    // == Lifecycle
    mounted () {
      /* istanbul ignore next */
      window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (f) { return setTimeout(f, 1000 / 60) } // callback to simulate requestAnimationFrame

      if (this.list) {
        this.$refs.list.addEventListener('scroll', this.onScroll)
      }

      // move scroll to starting position if is defined
      this.goTo()
    },
    beforeDestroy () {
      if (this.list) {
        this.$refs.list.removeEventListener('scroll', this.onScroll)
      }
    },

    // == Methods
    methods: {
      /**
       * Update TWEEN animation with request animation frame
       */
      updateScrollPosition () {
        const performUpdate = this.TWEEN.update()
        if (performUpdate) {
          window.requestAnimationFrame(this.updateScrollPosition)
        }
        return performUpdate
      },

      /**
       * Create a TWEEN animation given the old and the new value of list's "scrollLeft"
       * @param oldValue - old scrollLeft value
       * @param newValue - the new value that scrollLeft should assume
       *
       * TWEEN lib is fully tested so we'll ignore this function since it only use TWEEN
       */
      createTweenAnimation (oldValue, newValue) {
        /* istanbul ignore next */
        const list = this.$refs.list

        /* istanbul ignore next */
        new this.TWEEN.Tween({ offsetLeftValue: oldValue })
          .easing(this.TWEEN.Easing.Quadratic.Out)
          .to({ offsetLeftValue: newValue }, this.scrollTime)
          .onUpdate(function () {
            /* istanbul ignore next */
            list.scrollLeft = this.offsetLeftValue.toFixed(0)
          })
          .start()
      },

      /**
       * Move list one element behind
       */
      previous () {
        const animate = this.referenceElementId > 1
        if (animate) {
          this.animateList(false)
          this.updateScrollPosition()
        }
        return animate
      },

      /**
       * Move list one element to front
       */
      next () {
        const animate = this.referenceElementId <= this.list.length
        if (animate) {
          this.animateList(true)
          this.updateScrollPosition()
        }
        return animate
      },

      getNextElementId (rightArrowPressed) {
        const list = this.$refs.list
        const oldValue = list.scrollLeft
        const currentElement = list.querySelector(`.scrollable-tab-menu__element:nth-child(${this.referenceElementId})`)
        let nextElementId

        // Check which DOM element should we select to get the new value for scrollLeft
        if (rightArrowPressed) {
          nextElementId = this.referenceElementId + 1
        } else {
          if (currentElement.offsetLeft < oldValue + this.leftGap || this.referenceElementId === 1) {
            nextElementId = this.referenceElementId
          } else {
            nextElementId = this.referenceElementId - 1
          }
        }

        return nextElementId
      },

      /**
       * Method that do the calculations to animate this component when use press the left or right arrow.
       * @param rightArrowPressed - true if user pressed the right arrow. If false, user pressed the left arrow.
       */
      animateList (rightArrowPressed) {
        const list = this.$refs.list
        const oldValue = list.scrollLeft
        let newValue
        const nextElementId = this.getNextElementId(rightArrowPressed)
        newValue = nextElementId === 0 ? 0 : list.querySelector(`.scrollable-tab-menu__element:nth-child(${nextElementId})`).offsetLeft

        // If newValue is gt 0, it means that left arrow is visible, so we should apply the leftGap
        if (newValue > 0) {
          newValue -= this.leftGap
        }

        this.createTweenAnimation(oldValue, newValue)

        return {
          oldValue,
          newValue
        }
      },
      onScroll (e) {
        const currentElement = this.$refs.list.querySelector(`.scrollable-tab-menu__element:nth-child(${this.referenceElementId})`)
        const elemOffsetLeft = currentElement.offsetLeft
        const elemOffsetRight = elemOffsetLeft + currentElement.offsetWidth
        const listScrollLeft = e.target.scrollLeft
        const scrollingRight = listScrollLeft > this.lastScrollAux

        // If scroll is to the right direction and the 1st visible element on the list changed, lets increment the reference by 1
        if (scrollingRight && listScrollLeft > elemOffsetRight - this.rightGap) {
          this.referenceElementId++

        // If scroll is to the left direction and the 1st visible element on the list changed, lets decrement the reference by 1
        } else if (!scrollingRight && listScrollLeft + this.leftGap < elemOffsetLeft && this.referenceElementId > 1) {
          this.referenceElementId--
        }

        // Validate arrows visibility
        this.showLeftArrow = listScrollLeft > 0
        this.showRightArrow = e.target.scrollWidth - listScrollLeft !== e.target.offsetWidth

        // Update lastScroll Auxiliar that will be used on the next call of onScroll function
        this.lastScrollAux = listScrollLeft
      },
      onClickElement (index) {
        const list = this.$refs.list
        const listScrollLeft = list.scrollLeft
        const clickedElement = list.querySelector(`.scrollable-tab-menu__element:nth-child(${index + 1})`)

        // Update scroll position if clicked element has some pixels hidden
        if (listScrollLeft > 0 && clickedElement.offsetLeft - this.leftGap < listScrollLeft) {
          this.createTweenAnimation(listScrollLeft, clickedElement.offsetLeft - this.leftGap)
          this.updateScrollPosition()
        } else if (clickedElement.offsetLeft + clickedElement.offsetWidth > listScrollLeft + list.clientWidth - this.leftGap) {
          const hiddenPixelsOfElement = listScrollLeft + clickedElement.offsetLeft + clickedElement.offsetWidth - (listScrollLeft + list.clientWidth - this.leftGap)
          this.createTweenAnimation(listScrollLeft, hiddenPixelsOfElement)
          this.updateScrollPosition()
        }

        this.activeElementIndex = index
        console.log('active', this.activeElementIndex)
        return this.$emit('selected', this.list[index], index)
      },

      /**
       * Move scroll to starting position if startedAtInfex prop is greather than 0
       */
      goTo () {
        if (this.startAtIndex > 0) {
          this.activeElementIndex = this.startAtIndex >= this.list.length ? this.list.length - 1 : this.startAtIndex
          this.referenceElementId = this.activeElementIndex + 1
          const startElement = this.$refs.list.querySelector(`.scrollable-tab-menu__element:nth-child(${this.referenceElementId})`)
          this.scrollTime = 50
          this.createTweenAnimation(0, startElement.offsetLeft - this.leftGap)
          this.updateScrollPosition()
          this.scrollTime = 500
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $z1: 1;
  $z2: 2;
  $z3: 3;

  /* This wrapper was created to hide scrollbar on iOS Devices (together with bottom padding of .scrollable-tab-menu__list) */
  .scrollable-tab-menu-wrapper {
    width: 100%;
    height: 52px;
    overflow: hidden;
    border-bottom: 1px solid $navy;
    box-shadow: inset -1px 0 0 0 $lynch;
  }

  .scrollable-tab-menu {
    position: relative;
    width: 100%;
    height: 52px;
    background-color: white;

    .magic-line {
      position: absolute;
      bottom: 1px;
      z-index: $z1;
      height: 4px;
      background-color: blue;
    }

    .scrollable-tab-menu__nav {
      position: absolute;
      top: -1px;
      z-index: $z2;
      width: 50px;
      height: 50px;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: 0;

      &:active {
        box-shadow: none;
      }

      .btn__icon {
        position: relative;
        top: 2px;
        font-size: 12px;
        color: $slate-grey;
      }

      &.scrollable-tab-menu__nav--left {
        left: 0;
        background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);

        .btn__icon {
          left: -4px;
        }
      }

      &.scrollable-tab-menu__nav--right {
        right: 0;
        background: linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);

        .btn__icon {
          right: -4px;
        }
      }
    }
  }

  .scrollable-tab-menu__list {
    position: relative;
    left: 0;
    display: flex;
    flex-wrap: nowrap;
    height: 65px;
    padding-bottom: 15px;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      background-color: transparent;
      opacity: 0;
    }

    .scrollable-tab-menu__element {
      position: relative;
      flex: 0 0 auto;
      padding: 14px 15px;
      margin: 0 15px;
      font-size: 16px;
      line-height: 20px;
      color: $twilight-blue;
      text-align: center;
      cursor: pointer;

      &.scrollable-tab-menu__element--active {
        color: red;
        border-bottom: 4px solid purple;
      }

      &.scrollable-tab-menu__element--highlight::before {
        position: absolute;
        top: 22px;
        right: 1px;
        width: 7px;
        height: 7px;
        content: '';
        background-color: $booger;
        border-radius: 50%;
      }

      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
