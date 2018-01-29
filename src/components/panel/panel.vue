<template>
  <div class="panel">
    <div
      v-if="title"
      class="panel-title">
      {{ title }}
    </div>
    <a
      href="javascript:void(0)"
      @click="$emit('close')"
      class="panel-close">
      <img src="/static/icons/close.svg">
    </a>
    <slot
      name="content"
      class="panel-content" />
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    closable: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
  .panel {
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 25px;
    border-radius: 2px;
  }

  .panel-title {
    font-size: 28px;
    color: $stormy-blue;
    font-weight: 300;
    text-transform: uppercase;
    margin-right: 30px;
  }

  .panel-close {
    position: absolute;
    top: 28px;
    right: 20px;
  }

  .panel-content {
    background-color: red;
  }
</style>
