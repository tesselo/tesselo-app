<template>
  <div class="tsl-form__control">
    <label
      :for="name"
      class="tsl-form__label">
      {{ label }}
    </label>
    <input
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :class="{'tsl-form__input': true}"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      @focus="$emit('focus', $event.target)">
    <div class="tsl-form__control-error">
      <slot name="error"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TslInput',
  props: {
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
  }
}
</script>
