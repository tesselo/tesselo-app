<template>
  <a
    v-if="type === 'link'"
    :class="['tsl-button', {'is-touch-device': isTouch, 'disabled': disabled}, theme]"
    :href="link"
    :target="target"
    @click="click($event)">
    <span v-if="!loading">{{ title }}</span>
    <span
      v-else
      class="spinner" />
  </a>
  <button
    v-else-if="type === 'button'"
    :class="['tsl-button', {'is-touch-device': isTouch, 'disabled': disabled}, theme]"
    :href="link"
    :target="target"
    @click="click($event)">
    <span v-if="!loading">{{ title }}</span>
    <span
      v-else
      class="spinner" />
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
      default: '#'
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'button'
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
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isTouch: () => detectIt.hasTouch
  },
  methods: {
    click: function(event) {
      event.preventDefault()

      if (!this.disabled && !this.loading) {
        this.$emit('click', event.target)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tsl-button {
  position: relative;
  display: inline-block;
  width: auto;
  min-width: 130px;
  height: 37px;
  padding: 9px 20px;
  font-weight: 400;
  font-size: 14px;
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

    &.disabled {
      background-color: lighten($booger, 25%);
    }

    &:not(.is-touch-device):not(.disabled):hover {
      background-color: lighten($booger, 5%);
    }

    .spinner::before {
      border-top-color: white;
    }
  }

  &.slight-transparent {
    color: $twilight-blue;
    background-color: rgba(white, 0.8);
    font-weight: 400;

    &:not(.is-touch-device):not(.disabled):hover {
      background-color: white;
    }
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  display: block;
  height: 12px;
}

.spinner::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  margin-top: -9px;
  margin-left: -9px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: white;
  animation: spinner 1s linear infinite;
}
</style>
