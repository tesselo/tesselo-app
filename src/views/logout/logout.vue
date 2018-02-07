<template>
</template>

<script>
import { actionTypes } from '@/services/constants'
import { mapActions } from 'vuex';

export default {
  name: 'Logout',
  mounted() {
    this.resetAggregationLayer()
    this.resetFormula()
    this.resetMap()
    this.resetReport()
    this.resetTime()
    this.logout({ useApi: true })

    this.$router.push({ name: 'Login' })
  },
  methods: {
    ...mapActions('aggregationLayer', {
      resetAggregationLayer: actionTypes.RESET
    }),
    ...mapActions('formula', {
      resetFormula: actionTypes.RESET
    }),
    ...mapActions('map', {
      resetMap: actionTypes.RESET
    }),
    ...mapActions('report', {
      resetReport: actionTypes.RESET
    }),
    ...mapActions('time', {
      resetTime: actionTypes.RESET
    }),
    ...mapActions('auth', {
      logout: actionTypes.AUTH_LOGOUT
    })
  }
}
</script>