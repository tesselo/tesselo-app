<template>
 
    
    <Form @submit="submitForm" class="tsl-form">
      <div class="tsl-form__control"> 
        <label
          for="username"
          class="tsl-form__label">
          Username
        </label>
        <Field v-model="username" name="username" v-slot="{ field }" :rules="isRequired">
          <input v-bind="field" type="text" placeholder="Your username" class="tsl-form__input">
        </Field>
      </div>
      <ErrorMessage as="div" name="username" class="tsl-form__control-error"/>
      
      <div class="tsl-form__control"> 
        <label
          for="password"
          class="tsl-form__label">
          Password
        </label>
        <Field v-model="password" name="password" v-slot="{ field }" :rules="isRequired">
          <input v-bind="field" type="text" placeholder="Enter your password" class="tsl-form__input">
        </Field>
      </div>
      <ErrorMessage as="div" name="password" class="tsl-form__control-error"/>

      <div class="row">
        <div class="col-12 d-flex flex-row justify-content-end">
          <tsl-button
            :loading="loading"
            type="button"
            title="Login"
            class="login-button"
           />
        </div>
      </div>
    
    
    
    
    </Form>
     
   

  
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'

import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from "yup";

export default {
  name: 'LoginForm',
  components: {
    Field,
    Form,
    ErrorMessage
  },
  props: {

  },
  emit: { 
    submitAuth: null // null means we will not validate event
  },
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      formErrors: {
        nonFieldErrors: null,
      },
      schema: yup.object({
        Username: yup.string().required().email(),
        //password: yup.string().required().min(8),
      })
    }
  },
  methods: {
    ...mapActions('auth', {
      login: actionTypes.AUTH_LOGIN
    }),
    
    isRequired(value, obj) {
      if (value && value.trim()) {
        return true;
      }

      return `The ${obj.field} field is required`;
    },
    submitForm(values) {
      console.log(
        values
      )
      // this.loading = true

      // this.formErrors = {
      //   nonFieldErrors: null
      // }

      // this.login({
      //   username: this.username,
      //   password: this.password
      // })
      // .then(() => {
      //   this.loading = false
      //   this.$router.push({ name: 'Home' }).catch(errorHandler.routerError)
      // })
      // .catch(errors => {
      //   this.loading = false
      //   this.formErrors = errors
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-button {
    margin-top: 40px;
    margin-bottom: 10px;
  }
</style>