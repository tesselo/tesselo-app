import { testAction } from '@/test-utils'

import { actionTypes, mutationTypes } from '@/services/constants'
import actions from './auth.actions'
import APIAdapter from '@/services/api'

describe('auth actions', () => {
  it('should invoke auth mutation after login api response', done => {
    const actionPayload = {
      username: 'username'
    }

    const apiPayload = {
      token: 'x',
      expires: 'x'
    }

    const expectedMutationPayload = {
      ...apiPayload,
      ...actionPayload
    }

    APIAdapter.services.auth.login = jest.fn(() => Promise.resolve(apiPayload))

    testAction(actions[actionTypes.AUTH_LOGIN], actionPayload, {}, [
      {
        type: mutationTypes.AUTH_SET_AUTHENTICATION,
        payload: expectedMutationPayload
      }
    ], (error) => {
      APIAdapter.services.auth.login.mockClear()
      done(error)
    })
  })
})