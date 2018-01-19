<template>
  <div>
    <multi-option-toggle-button
      v-for="(item, index) in buttons"
      :key="item.title"
      :title="item.title"
      :icon="item.icon"
      :active="item.active"
      @click="setActive(index)" />
  </div>
</template>

<script>
import MultiOptionToggleButton from './components/multi-option-toggle-button/multi-option-toggle-button'

export default {
  name: 'MultiOptionToggle',
  components: {
    MultiOptionToggleButton
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      buttons: [],
      activeIndex: null
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.buttons = newItems.map(item => ({...item, active: false}))
      }
    }
  },
  methods: {
    setActive(activeIndex) {
      this.activeIndex = activeIndex
      this.$emit('change', this.items[activeIndex].key)
      this.buttons = this.buttons.map((item, itemIndex) => ({
        ...item,
        active: activeIndex == itemIndex,
      }))
    },
    unsetActive() {
      this.activeIndex = null
      this.buttons = this.buttons.map((item) => ({
        ...item,
        active: false
      }))
    }
  }
}
</script>
