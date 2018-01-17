<template>
  <a
    :class="['panel-selector-button d-flex flex-row justify-content-start align-items-center', {'panel-selector-button--active': active}]"
    @click="$emit('click')">
    <img 
      class="panel-selector-icon"
      :src="`/static/icons/${icon}.svg`">
    <span class="panel-selector-title">{{ title }}</span>
  </a>
</template>

<script>
export default {
  name: 'PanelSelectorButton',
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
  .panel-selector-button {
    position: relative;

    display: block;
    height: 37px;
    width: 155px;
    margin-top: 4px;

    border-radius: 2px;
    background-color: white;
    cursor: pointer;


    &:hover{
      background-color: darken(white, 5%);
    }
  }
  .panel-selector-button--active {
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

  .panel-selector-icon {
    position: relative;
    top: 2px;
    margin-left: 10px;
    margin-right: 5px;
  }

  .panel-selector-title {
    font-size: 12px;
    line-height: 17px;
    color: $twilight-blue;
  }
</style>
