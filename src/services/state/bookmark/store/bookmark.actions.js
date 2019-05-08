import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   *
   * POST BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_SAVE] (context, options) {
    return APIAdapter.services.bookmark.saveBookmark(options)
      .then((response) => {
        context.commit(mutationTypes.BOOKMARK_SET, response)
      })
  },


  /**
   *
   * PUT BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_EDIT] (context, options) {
    return APIAdapter.services.bookmark.editBookmark(options)
      .then((response) => {
        context.commit(mutationTypes.BOOKMARK_SET, response)
      })
  },

  /**
   *
   * Delete BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_DELETE] (context, options) {
    return APIAdapter.services.bookmark.deleteBookmark(options)
  }
}
