import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'
import { } from '@/data/api/api.models'

export default {
  /**
   * Gets Bookmark Folders
   *
   * @returns
   */
  get(axiosInstance = client) {
    return axiosInstance[endpoints.bookmarkFolder.getBookmarkFolder.method](endpoints.bookmarkFolder.getBookmarkFolder.url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   *
   */
  saveBookmarkFolder(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmarkFolder.saveBookmarkFolder.method](endpoints.bookmarkFolder.saveBookmarkFolder.url,data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   *
   */
  editBookmarkFolder(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmarkFolder.editBookmarkFolder.method](endpoints.bookmarkFolder.editBookmarkFolder.url + '/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   *
   */
  deleteBookmarkFolder(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmarkFolder.deleteBookmarkFolder.method](endpoints.bookmarkFolder.deleteBookmarkFolder.url + '/' + data.id )
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}
