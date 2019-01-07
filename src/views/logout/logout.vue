<template>
  <div />
</template>

<script>
import { actionTypes } from '@/services/constants'
import { mapActions } from 'vuex';

export default {
  name: 'Logout',
  mounted() {
    this.logout()
    this.$router.push({ name: 'Login' })
  },
  methods: {
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    })
  }
}
</script>
