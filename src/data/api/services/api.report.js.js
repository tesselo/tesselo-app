import { all } from 'axios'
import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'


export const createRegionReport = function(region, axiosInstance = client) {
  return new Promise((resolve) => {
    axiosInstance[endpoints.report.createRegionReport.method](endpoints.report.createRegionReport.url, {
      ...region,
      acres: true,
      grouping: 'continuous'
    })
    .then(({ data }) => {
      resolve(data.results[0])
    })

  })
}

export const getRegion = function(region, axiosInstance = client) {
  return new Promise((resolve) => {
    axiosInstance[endpoints.report.getRegionReport.method](endpoints.report.getRegionReport.url, {
      params: {
        ...region,
        acres: true,
        grouping: 'continuous'
      }
    })
    .then(({data}) => {
      if (!data.results.length) {
        resolve(createRegionReport(region))
      } else {
        resolve(data.results[0])
      }
    })
  })
}

/**
 * Gets multiple regions reports
 * Returns a promise that is fulfilled when each region promise is returned
 * 
 * @param {Array} regions
 * @param {any} [axiosInstance=client] 
 */
export const getMultipleRegions = function(regions) {
  return all(regions.map(region => getRegion(region)))
}

export default {
  createRegionReport,
  getRegion,
  getMultipleRegions
}
