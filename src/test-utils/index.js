/**
 * Helper for testing action with expected mutations
 * - in https://vuex.vuejs.org/en/testing.html
 *
 * @param {any} action
 * @param {any} payload
 * @param {any} state
 * @param {any} expectedMutations
 * @param {any} done
 * @param rootState
 */
export const testAction = function (action, payload, state, expectedMutations, done, rootState) {
  let mutationsCount = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[mutationsCount]
    if (mutation) {
      try {
        expect(mutation.type).toBe(type)
      } catch (error) {
        done(error)
      }
    }
    if (mutation && payload) {
      try {
        expect(mutation.payload).toEqual(payload)
      } catch (error) {
        done(error)
      }
    }
    mutationsCount++
    if (mutationsCount >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  try {
    action({ commit, state, rootState }, payload)
  } catch (error) {
    done(error)
  }

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    try {
      expect(mutationsCount).toBe(0)
    } catch (error) {
      done(error)
    }
    done()
  }
}