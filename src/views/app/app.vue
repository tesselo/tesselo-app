<template>
  <div>
    <router-view/>
    <user-sidebar />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'
import UserSidebar from '@/components/user-sidebar/user-sidebar'

export default {
  name: 'App',
  components: {
    UserSidebar
  },
  mounted() {
    this.authStart()
  },
  methods: {
    ...mapActions('auth', {
      authStart: actionTypes.AUTH_START
    })
  }
}
</script>
