<template>
  <div
    v-if="!isTouch"
    :class="[
      'multi-option-toggle-button d-flex flex-row justify-content-start align-items-center',
      {
        'multi-option-toggle-button--active': active,
        'multi-option-toggle-button--selected': selected,
        'multi-option-toggle-button--superior': ( title=='Export to PDF' || title=='Save Report')
      }
    ]"
    :title="title"
    @click="$emit('click')">
    <img
      v-if="icon"
      :src="iconUrl"
      class="multi-option-toggle-icon">
    <span class="title"> {{ title }}</span>
  </div>
  <div
    v-else
    :class="[
      'multi-option-toggle-button--touch multi-option-toggle-button d-flex flex-column align-items-center',
      {
        'multi-option-toggle-button--superior': ( title=='Export to PDF' || title=='Save Report')
      }
    ]"
    :title="title"
    @click="$emit('click')">
    <div class="align-items-center">
      <img
        v-if="icon"
        :src="iconUrl"
        class="multi-option-toggle-icon multi-option-toggle-icon--touch">
    </div>
    <div :class="['align-items-center', {'container-title--touch': selected}]">
      <span class="title title--touch"> {{ title }}</span>
    </div>
  </div>
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
    },
    isTouch: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      iconUrl: require(`@/assets/images/icons/${this.icon}.svg`),
    }
  }
}
</script>

<style scoped lang="scss">
  .multi-option-toggle-button {
    position: relative;
    z-index: 101;
    display: block;
    height: 37px;
    width: 155px;
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

  .multi-option-toggle-icon {
    position: relative;
    top: 2px;
    margin-left: 10px;
    margin-right: 5px;
  }

  .multi-option-toggle-icon--touch {
    margin-left: 5px;
  }

  .title {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 20px;

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

  .multi-option-toggle-button--superior {
    z-index: 104;
  }

  .multi-option-toggle-button--selected {
    background-color: $booger;

    .title {
      color: white;
    }

    &.multi-option-toggle-button--active::after{
      background-color: white;
    }

    &:hover {
      background-color: lighten($booger, 5%);
    }
  }

</style>
