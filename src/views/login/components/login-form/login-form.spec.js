import Vuex from 'vuex'
import VeeValidate from 'vee-validate'

import LoginForm from './login-form.vue'
import store from '@/services/store'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VeeValidate)

describe('Login Form', () => {
  it('should render login-form', () => {
    const wrapper = mount(LoginForm, {
      localVue,
      store
    })
    expect(wrapper.vm).toMatchSnapshot();
  });

  it('should trigger login', () => {
    const wrapper = mount(LoginForm, {
      localVue,
      store
    })

    wrapper.vm.login = jest.fn(() => {
      return Promise.resolve(true)
    })

    wrapper.setData({
      username: 'test',
      password: 'password'
    })

    wrapper.find('.login-button').trigger('click')
    console.warn(wrapper)

    expect(wrapper.vm.login).toHaveBeenCalledWith({
      username: 'test', 
      password: 'password'
    })
  })
})