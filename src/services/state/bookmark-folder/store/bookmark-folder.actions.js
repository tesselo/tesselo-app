import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   *
   * GET BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_FOLDER_GET](context) {
    console.log('get')
    return APIAdapter.services.bookmarkFolder.get()
      .then((response) => {
        context.commit(mutationTypes.BOOKMARK_FOLDER_SET, response.results)
      })
  },

  /**
   *
   * POST BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_FOLDER_SAVE](context, options) {
    return APIAdapter.services.bookmarkFolder.saveBookmarkFolder(options)
  },


  /**
   *
   * DELETE BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_FOLDER_EDIT](context, options) {
    return APIAdapter.services.bookmarkFolder.editBookmarkFolder(options)
  },

  /**
   *
   * DELETE BOOKMARK FOLDER
   * @param {any} context
   */
  [actionTypes.BOOKMARK_FOLDER_DELETE](context, options) {
    return APIAdapter.services.bookmarkFolder.deleteBookmarkFolder(options)
  },
}
