<template>
  <a
    v-if="type === 'link'"
    :class="['tsl-button', {'is-touch-device': isTouch}, theme]"
    :href="link"
    :target="target"
    @click="$emit('click', $event.target)">
    <div>{{ title }}</div>
  </a>
  <button
    v-else-if="type === 'submit'"
    :class="['tsl-button', {'is-touch-device': isTouch}, theme]"
    :href="link"
    :target="target"
    @click="$emit('click', $event.target)">
    <div>{{ title }}</div>
  </button>
</template>

<script type="text/javascript">

import detectIt from 'detect-it'

export default {
  name: 'TslButton',
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
      default: 'link'
    },
    theme: {
      type: String,
      required: false,
      default: 'booger'
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

.tsl-button {
  position: relative;
  display: inline-block;
  width: auto;
  min-width: 130px;
  padding: 9px 20px;
  font-weight: 300;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  letter-spacing: -0.5px;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 150ms ease-in-out;

  &.booger {
    color: white;
    background-color: $booger;

  &:not(.is-touch-device):hover {
      background-color: lighten($booger, 5%);
    }
  }

  &.slight-transparent {
    color: $twilight-blue;
    background-color: rgba(white, 0.8);
    font-weight: 400;

    &:not(.is-touch-device):hover {
      background-color: white;
    }
  }
}

</style>
