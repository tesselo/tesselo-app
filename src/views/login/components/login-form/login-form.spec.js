import Vuex from 'vuex'

import LoginForm from './login-form.vue'
import store from '@/services/store'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Login Form', () => {
  it('should render login form', () => {
    const wrapper = mount(LoginForm, {
      localVue,
      store
    })

    wrapper.vm.login = jest.fn()

    wrapper.setData({
      username: 'test',
      password: 'password'
    })

    wrapper.find('.login-button').trigger('click')

    expect(wrapper.vm.login).toHaveBeenCalled()

    // expect(vm.$el).toMatchSnapshot();
  })
})