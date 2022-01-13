<template>
  <div class="collapsible-panel">
    <a
      :class="['close d-flex flex-row justify-content-center align-items-center', { 'close--rotate': open }]"
      id="stdButton"
      href="javascript:void(0)"
      @click="$emit('toggle')"
    >
      <svg
        width="24"
        height="24"
        x="0px"
        y="0px"
        viewBox="0 0 100 69.08875">
        <path
          fill="#000000"
          d="M50,55.271c-1.349,0-2.697-0.515-3.727-1.544L1.544,8.998c-2.059-2.059-2.059-5.395,0-7.454  s5.395-2.059,7.454,0L50,42.546L91.002,1.544c2.059-2.059,5.395-2.059,7.454,0c2.059,2.059,2.059,5.395,0,7.454L53.727,53.727  C52.697,54.757,51.349,55.271,50,55.271z" />
      </svg>
    </a>
    <div class="collapsible-panel__content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsiblePanel',
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .collapsible-panel {
    position: relative;
  }

  .collapsible-panel__content {
    background-color: white;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
    overflow: hidden;
  }

  .close {
    position: absolute;
    top: -28px;
    left: 0;
    width: 28px;
    height: 28px;

    border-top-left-radius: 2px;
    border-top-right-radius: 2px;

    background-color: $palest-grey;

    svg {
      width: 12px;
      height: 12px;
      transform: translateY(-2px) rotate(180deg);
    }

    &--rotate {
      svg {
        transform: rotate(0deg);
      }
    }

    &:hover svg path {
      fill: $booger;
    }
  }
</style>
