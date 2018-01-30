<template>
  <ul class="simple-toggle d-flex flex-row">
    <li
      v-for="(item, index) in list"
      :key="item"
      :class="['simple-toggle__option', { 'simple-toggle__option--active': activeIndex == index}]"
      @click="$emit('change', item)">
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SimpleToggle',
  props: {
    list: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .simple-toggle__option {
    display: block;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: $twilight-blue;
    cursor: pointer;

    border-top: 1px solid $lynch;
    border-right: 1px solid $lynch;
    border-bottom: 1px solid $lynch;

    &:first-of-type {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-left: 1px solid $lynch;
    }

    &:last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:hover {
      color: white;
      background-color: $lynch;
    }

    &--active {
      color: white;
      background-color: $lynch;

      &:hover {
        color: white;
        background-color: lighten($lynch, 2%);
      }
    }
  }
</style>
