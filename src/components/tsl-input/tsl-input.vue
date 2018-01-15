<template>
  <div class="tsl-form__control">
    <label
      for="email"
      class="tsl-form__label">
      E-mail Address
    </label>
    <input
      :name="name"
      v-validate="'required|email'"
      :type="type"
      placeholder="Your e-mail"
      :class="{'tsl-form__input': true, 'tsl-form__input--error': errors.has('teixeira') }"
      @input="$emit('input', $event.target.value)"
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
