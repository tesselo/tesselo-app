<template>
  <div>
    <multi-option-toggle-button
      v-for="item in buttonsFilterHidden"
      :key="item.title"
      :title="item.title"
      :icon="item.icon"
      :active="item.active"
      :selected="item.selected"
      :is-touch="isTouch"
      @click="setActive(item.key)" />
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
    },
    isTouch:{
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      buttons: []
    }
  },
  computed: {
    buttonsFilterHidden(){
      return this.buttons.filter(button => !button.hide);
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
    setActive(itemKey) {
      this.$emit('change', itemKey)

      this.buttons = this.buttons.map(item => ({
        ...item,
        active: item.key == itemKey,
      }))
    },
    unsetActive() {
      this.buttons = this.buttons.map((item) => ({
        ...item,
        active: false
      }))
    }
  }
}
</script>
