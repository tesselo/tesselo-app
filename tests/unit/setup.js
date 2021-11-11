import Vue from 'vue'
import { mount, shallow, createLocalVue } from '@vue/test-utils'


global.mount = mount
global.shallow = shallow
global.createLocalVue = createLocalVue

Vue.config.productionTip = false

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: jest.fn()
})
