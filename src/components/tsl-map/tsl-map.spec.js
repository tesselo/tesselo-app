import Vuex from 'vuex'

import TslMap from './tsl-map.vue'
import store from '@/services/store'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('TslMap', () => {
  it('should call fitBounds when moveToBounds is called', done => {
    const wrapper = mount(TslMap, {
      localVue,
      store
    })

    wrapper.vm.$refs.map.mapObject.fitBounds = jest.fn()

    const expectedParam = [
      [41.13835067877789, -8.69129406942043],
      [41.18593530426382, -8.552613455058323]
    ];

    wrapper.vm.moveToBounds(expectedParam)

    expect(wrapper.vm.$refs.map.mapObject.fitBounds).toHaveBeenCalledWith(expectedParam)
    done()
  })
})