<template>
  <a
    class="pixel-button"
    :href="link"
    :target="target"
    :class="[{'is-touch-device': isTouch}]"
    @click="$emit('click', $event.target)">
    <div>{{ title }}</div>
  </a>
</template>

<script type="text/javascript">

import detectIt from 'detect-it'

export default {
  name: 'PixelButton',
  props: {
    link: {
      type: String,
      required: false,
      default: '#',
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    target: {
      type: String,
      required: false,
      default: '_self'
    }
  },
  computed: {
    isTouch: () => detectIt.hasTouch
  },
}
</script>

<style lang="scss" scoped>

.pixel-button {
  position: relative;
  display: inline-block;
  width: auto;
  padding: 10px 20px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  letter-spacing: -0.5px;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 150ms ease-in-out;
  color: white;
  background-color: $pixel-orange;

  &:not(.is-touch-device):hover {
    background-color: lighten($pixel-orange, 5%);
  }
}

</style>
