import { ReactNode } from 'react'
import { ColumnProps } from 'antd/lib/table/interface'

export interface TableConfigProps<T = any> {
  columns: Array<ColumnProps<T>>
  toolbarRender?: () => ReactNode
  size?: 'default' | 'small'
  rowIndex?: (record: T) => string

  renderActions?: boolean | (() => ColumnProps<T>)
  onAdd: () => void
  onEdit: (item: T, options?: FormStateOptions) => void
  onRemove: (item: T) => void
}

export interface PaginationResponseData<T={}> {
  items: T[],
  totalCount: number
}

export interface FormFiledProps {
  label: string
  type: string
  dataKey: string
  required?: boolean
  disabled?: boolean
  allowClear?: boolean
  defaultValue?: any
  colSpan?: number
  render?: () => ReactNode
}
export interface FormStateOptions {
  readonly: boolean
}

export interface FormConfigProps {
  fields: FormFiledProps[]
  colSpan?: number
  mapValuesFrom?: () => any
  onValuesChange?: (props: any, changedFields: any, allValues: any) => any
}

export interface EditConfigProps {
  title?: string
  width?: string | number
  maskClosable?: boolean
  zIndex?: number
  footer?: () => ReactNode
}
