<template>
  <div>
    <div v-if="active">
      <multi-option-toggle
        v-if="active"
        :items="items"
        @change="reportMenuClick"/>
    </div>
    <div
      :class="[
        'report-menu-button d-flex flex-row justify-content-start align-items-center'
      ]"
      @click="active = !active, $emit('click')">
      <img
        :src="iconUrl"
        class="report-menu-button-icon">
      <span class="title">Reports</span>
      <img
        v-if="!active"
        :src="triagleUpUrl"
        class="report-menu-button-triangle">
      <img
        v-if="active"
        :src="triagleDownUrl"
        class="report-menu-button-triangle">
    </div>
  </div>
</template>

<script>
import MultiOptionToggle from '@/components/multi-option-toggle/multi-option-toggle'

export default {
  name: 'ReportMenu',
  components: {
    MultiOptionToggle,
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
  data: function() {
    return {
      iconUrl: process.env.ASSETS_PUBLIC_PATH + 'static/icons/report.svg',
      triagleDownUrl: process.env.ASSETS_PUBLIC_PATH + 'static/icons/triangle-down.svg',
      triagleUpUrl: process.env.ASSETS_PUBLIC_PATH + 'static/icons/triangle-up.svg',
      active: false
    }
  },
  methods:{
    reportMenuClick(itemKey){
      this.$emit('change', itemKey)
    }
  }
}
</script>

<style scoped lang="scss">
  .report-menu-button {
    position: relative;
    margin-left: auto;
    height: 37px;
    width: 108px;
    z-index: 101;
    font-size: 12px;

    display: block;
    margin-top: 4px;

    border-radius: 2px;
    background-color: white;
    cursor: pointer;
    user-select: none;

    &--touch {
      width: 72px;
      height: 47px;
      border-radius: 2px;
    }

    &:hover {
      background-color: darken(white, 5%);
    }
  }

  .report-menu-button-icon {
    position: relative;
    top: 2px;
    margin-left: 10px;
    margin-right: 5px;
  }
  .report-menu-button-triangle {
    position: relative;
    top: 2px;
    margin-bottom: 3px;
    margin-right: 5px;
  }

  .title {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 5px;
    text-overflow: ellipsis;

    font-size: 12px;
    line-height: 17px;
    color: $twilight-blue;
  }

  .container-title--touch {
    width: 100%;
    margin-left: 4px;
  }

  .title--touch {
    margin-right: 0;
    text-overflow: ellipsis;
    width: 100%;
  }

  .report-menu-button-button--active {
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

  .report-menu-button-button--selected {
    background-color: $booger;

    .title {
      color: white;
    }

    &.report-menu-button-button--active::after {
      background-color: white;
    }

    &:hover {
      background-color: lighten($booger, 5%);
    }
  }

</style>

