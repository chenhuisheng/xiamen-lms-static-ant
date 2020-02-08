import _ from 'lodash'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { navigate } from '@reach/router'
import { message } from 'antd'
import { API_HOST, PUBLIC_PATH } from '../config'

interface AjaxOptions {
  baseURL?: string
  method?: string
  data?: any
  headers?: any
  timeout?: number
  onUploadProgress?: (progressEvent: ProgressEvent) => void
}

export interface ServerResponseData {
  code: number
  data: any
  message: string
}

export interface AJAXErrorResult extends ServerResponseData {
  handled: boolean
}

export const ajax = (url: string, options: AjaxOptions) => {
  const axiosOptions: AxiosRequestConfig = {}
  axiosOptions.baseURL = options.baseURL || API_HOST
  axiosOptions.method = options.method || 'get'
  axiosOptions.timeout = options.timeout || 10 * 1000
  axiosOptions.headers = {
    ...options.headers
  }
  axiosOptions.onUploadProgress = options.onUploadProgress

  if (options.data && _.includes(['get', 'delete'], options.method))
    axiosOptions.params = options.data
  else
    axiosOptions.data = options.data

  return new Promise<ServerResponseData>((resolve, reject) => {
    axios(url, axiosOptions)
      .then(async (res: AxiosResponse<ServerResponseData>) => {
        resolve(res.data)
      })
      .catch(async (err: AxiosError) => {
        console.error(err)
        if (!err.response) {
          errorHandler()
          reject({ ...err, handled: true })
          return
        }

        if (err.response.status === 401) {
          reject({ handled: true })
          navigate(`${PUBLIC_PATH}/login`, { replace: true })
        }
        else if (err.response.status === 400) {
          reject({
            data: err.response.data,
            message: _.get(err.response.data, 'msg'),
            handled: false
          })
        }
        else {
          errorHandler()
          reject({ ...err, handled: true })
        }
      })
  })
}

const errorHandler = () => {
  message.error('服务繁忙，请稍后重试')
}

export const GET = (url: string, options: AjaxOptions) => ajax(url, {
  ...options,
  method: 'get'
})
export const PUT = (url: string, options: AjaxOptions) => ajax(url, {
  ...options,
  method: 'put'
})
export const POST = (url: string, options: AjaxOptions) => ajax(url, {
  ...options,
  method: 'post'
})
export const DELETE = (url: string, options: AjaxOptions) => ajax(url, {
  ...options,
  method: 'delete'
})
