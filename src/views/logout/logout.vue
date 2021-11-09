<template>
  <div />
</template>

<script>
import { actionTypes, routeTypes } from '@/services/constants'
import { mapActions } from 'vuex';

import errorHandler from '@/utils/errorHandler'

export default {
  name: 'Logout',
  mounted() {
    this.logout()
    this.$router.push({ name: routeTypes.LOGIN }).catch(errorHandler.routerError)
  },
  methods: {
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    })
  }
}
</script>
