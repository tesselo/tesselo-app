import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import { } from '@/services/api/api.models'

export default {
  /**
   * Gets Bookmark Folders
   *
   * @returns
   */
  get(axiosInstance = client) {
    return axiosInstance[endpoints.bookmark.list.method](endpoints.bookmark.list.url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   * Post bookmark
   * @param {*} data
   * @param {*} axiosInstance
   */
  saveBookmark(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmark.saveBookmark.method](endpoints.bookmark.saveBookmark.url, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   * Post bookmark
   * @param {*} data
   * @param {*} axiosInstance
   */
  editBookmark(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmark.editBookmark.method](endpoints.bookmark.editBookmark.url +'/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  /**
   * Delete bookmark
   * @param {*} data
   * @param {*} axiosInstance
   */
  deleteBookmark(data, axiosInstance = client) {
    return axiosInstance[endpoints.bookmark.deleteBookmark.method](endpoints.bookmark.deleteBookmark.url + '/' + data.id)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}
