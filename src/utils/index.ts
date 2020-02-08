import { message } from 'antd'
import { AJAXErrorResult } from './ajax'
import moment from 'moment'

export * from './ajax'

export const defaultErrorHandler = (e: AJAXErrorResult) => {
  message.error(e.message)
  throw e
}

export const move = (array: any[], from: number, to: number) => {
  const itemRemovedArray = [
    ...array.slice(0, from),
    ...array.slice(from + 1, array.length)
  ]
  return [
    ...itemRemovedArray.slice(0, to),
    array[from],
    ...itemRemovedArray.slice(to, itemRemovedArray.length)
  ]
}

export const dateFormat = (val: string | undefined, formatter = 'YYYY-MM-DD HH:mm') => {
  if (!val || val === '1970-01-01 00:00' || val === '0000-00-00') return ''
  return moment(val).format(formatter)
}
