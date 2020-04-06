<template>
  <div />
</template>

<script>
import { actionTypes, routeTypes } from '@/services/constants'
import { mapActions } from 'vuex';

export default {
  name: 'Logout',
  mounted() {
    this.logout()
    this.$router.push({ name: routeTypes.LOGIN })
  },
  methods: {
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    })
  }
}
</script>
