<template>
  <div
    id="home"
    class="container">
    <div v-if="!fetchedEmployees">
      <tsl-button
        id="fetch-employees"
        title="Get the Tesselo Squad!!"
        @click="getEmployees"
      />
    </div>
    <div
      v-if="fetchedEmployees"
    >
      <h1>Tesselo squad</h1>
      <div class="d-flex flex-row justify-content-start flex-wrap">
        <div
          v-for="employee in employees"
          :key="employee.profile.image_192"
          class="employee d-flex flex-row">
          <img
            :src="employee.profile.image_192"
            :alt="employee.profile.real_name_normalized">
          <div class="d-flex flex-column justify-content-start">
            <h2>{{ employee.profile.real_name_normalized }}</h2>
            <h3>{{ employee.profile.title }}</h3>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TslButton from '@/components/tsl-button/tsl-button';
import { EMPLOYEES_GET_EMPLOYEES } from '@/services/constants/action-types'

export default {
  name: 'Home',
  components: {
    TslButton
  },
  data () {
    return {
      fetchedEmployees: false
    }
  },
  computed: {
    ...mapState({
      employees: state => state.employees.employees
    })
  },
  methods: {
    ...mapActions('employees', {
      getEmployeesAction: EMPLOYEES_GET_EMPLOYEES
    }),
    getEmployees () {
      return this.getEmployeesAction()
        .then(() => {
          this.fetchedEmployees = true;
        });
    }
  },
}
</script>

<style lang="scss" scoped>

h1 {
  font-size: 22px;
  line-height: 32px;
  color: $tsl-grey;
  font-weight: 500;
  overflow: hidden;
}

.employee {
  width: 25%;
  margin-top: 40px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  h1,
  h2 {
    margin-top: 10px;
    margin-left: 15px;
    font-size: 16px;
  }

  h3 {
    margin-left: 15px;
    font-size: 14px;
  }
}
</style>
