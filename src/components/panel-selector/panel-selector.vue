<template>
  <a
    class="panel-selector d-flex flex-row justify-content-start align-items-center"
    @click="$emit('click')">
    <img 
      class="panel-selector-icon"
      :src="`/static/icons/${icon}.svg`">
    <span class="panel-selector-title">{{ title }}</span>
  </a>
</template>

<script>
export default {
  name: 'PanelSelector',
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
  .panel-selector {
    display: block;
    height: 40px;
    width: 155px;
    margin-top: 2px;

    border-radius: 2px;
    background-color: white;
    cursor: pointer;


    &:hover{
      background-color: darken(white, 5%);
    }
  }

  .panel-selector-icon {
    
  }

  .panel-selector-title {
    font-size: 12px;
    line-height: 17px;
    color: $twilight-blue;
  }
</style>
