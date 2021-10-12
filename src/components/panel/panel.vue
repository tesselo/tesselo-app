<template>
  <div class="panel">
    <div
      v-if="title"
      class="panel-title">
      {{ title }}
    </div>
    <a
      class="panel-close"
      href="javascript:void(0)"
      @click="$emit('close')"
    >
      <img :src="iconCloseUrl">
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
  },
  data: function() {
    return {
      iconCloseUrl: require('@/assets/images/icons/close.svg')
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
</style>
