<template>
  <div class="panel-selector">
    <panel-selector-button
      v-for="(item, index) in buttons"
      :key="item.title"
      :title="item.title"
      :icon="item.icon"
      :active="item.active"
      @click="setActive(index)" />
  </div>
</template>

<script>
import PanelSelectorButton from './components/panel-selector-button/panel-selector-button'

export default {
  name: 'PanelSelector',
  components: {
    PanelSelectorButton
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

<style>

</style>
