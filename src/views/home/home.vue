<template>
  <div>
    <tsl-button
      class="logout-button"
      title="Logout"
      @click="logout" />
    <tsl-map />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import TslMap from '@/components/tsl-map/tsl-map'
import TslButton from '@/components/tsl-button/tsl-button'

export default {
  name: 'Home',
  components: {
    TslMap,
    TslButton
  },
  head: {
    title: {
      inner: 'Homepage'
    }
  },
  methods: {
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    })
  }
}
</script>
<style lang="scss" scoped>

  .logout-button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: z('content');
  }
</style>
