<template>
  <a
    :class="['multi-option-toggle-button d-flex flex-row justify-content-start align-items-center', {'multi-option-toggle-button--active': active}]"
    @click="$emit('click')">
    <img 
      v-if="icon"
      :src="`/static/icons/${icon}.svg`"
      class="multi-option-toggle-icon">
    <span class="multi-option-toggle-title">{{ title }}</span>
  </a>
</template>

<script>
export default {
  name: 'MultiOptionToggleButton',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
  .multi-option-toggle-button {
    position: relative;

    display: block;
    height: 37px;
    width: 155px;
    margin-top: 4px;

    border-radius: 2px;
    background-color: white;
    cursor: pointer;
    user-select: none;


    &:hover{
      background-color: darken(white, 5%);
    }
  }
  .multi-option-toggle-button--active {
    &::after {
      @include pseudoElementSetup;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);

      width: 6px;
      height: 6px;
      background-color: $booger;
      border-radius: 4px;
    }
  }

  .multi-option-toggle-icon {
    position: relative;
    top: 2px;
    margin-left: 10px;
    margin-right: 5px;
  }

  .multi-option-toggle-title {
    font-size: 12px;
    line-height: 17px;
    color: $twilight-blue;
  }
</style>
