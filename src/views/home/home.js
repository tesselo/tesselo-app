import Vue from 'vue'
import home from '@/views/home/home'

describe('home.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(home)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#fetch-employees').textContent)
    .toEqual('Get the Pixelmatters Squad!!')
  })

  it('should match the snapshot', () => {
    const Constructor = Vue.extend(home)
    const vm = new Constructor().$mount()

    expect(vm.$el).toMatchSnapshot();
  })
})
