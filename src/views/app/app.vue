<template>
  <div>
    <router-view/>
    <user-sidebar />
  </div>
</template>

<script>
import UserSidebar from '@/components/user-sidebar/user-sidebar'

export default {
  name: 'App',
  components: {
    UserSidebar
  }
}
</script>
<style lang="scss">
</style>
