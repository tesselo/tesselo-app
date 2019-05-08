import defaultState from './bookmark-folder.state'
// import Vue from 'vue'

import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets bookmark folders receivedw
   *
   * @param {any} state
   * @param {any} report
   */
  [mutationTypes.BOOKMARK_FOLDER_SET] (state, response) {
        const bookmarkChild = response.map(item => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        isFolder: true,
        children: item.bookmarks.map( bookmark => {
          return{
              id: bookmark.id,
              name: bookmark.name,
              description: bookmark.description,
              url: bookmark.url,
              bookmarkfolder: item.id,
              created: bookmark.created,
              isFolder: false,
          }
        }),
      }
    })
    const bookmarkTree = [{
      name: 'Bookmarks',
      isFolder: false,
      isTitle: true,
      children: bookmarkChild
    }]
    state.bookmarkFolder = bookmarkTree
  },


  /**
   * Reset state
   *
   * @param {any} state
   */
  [mutationTypes.BOOKMARK_FOLDER_RESET] (state) {  // eslint-disable-line
    state = defaultState
    window.localStorage.removeItem('savedBookmarkFolder')
  }
}
