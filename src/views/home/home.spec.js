import Vue from 'vue'
import Home from '@/views/home/home'

describe('homepage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Home)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#fetch-employees').textContent)
    .toEqual('Get the Tesselo Squad!!')
  })

  it('should match the snapshot', () => {
    const Constructor = Vue.extend(Home)
    const vm = new Constructor().$mount()

    expect(vm.$el).toMatchSnapshot();
  })
})
