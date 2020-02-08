import _ from 'lodash'
import React from 'react'
import { FormFiledProps } from '../typing'
import { DatePicker, Input as AntInput } from 'antd'

const AntTextArea = AntInput.TextArea

export enum FormFieldType {
  TextInput = 'TextInput',
  TextArea = 'TextArea',
  DatePicker = 'DatePicker',
}

export const getFormControlComponent = (
  item: FormFiledProps,
) => {

  // override item props
  const componentProps = {
    ..._.pick(item, ['disabled', 'allowClear']),
  }

  if (item.type === FormFieldType.TextInput)
    return (
      <AntInput
        {...componentProps}
        placeholder="请填写"
        />
    )
  if (item.type === FormFieldType.TextArea)
    return (
      <AntTextArea
        {...componentProps}
        autosize={{ minRows: 4, maxRows: 12 }}
        placeholder="请填写"
      />
    )

  if (item.type === FormFieldType.DatePicker)
    return (
      <DatePicker
        {...componentProps}
        format={'YYYY年MM月DD日'}
        placeholder="请选择"
        style={{ width: '100%' }}
      />
    )

  console.error(`SFComponent ${ item.type } onFound`)
  return null
}
