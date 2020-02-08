import React, { Component } from 'react'
import { FormComponentProps } from 'antd/es/form'
import { EditServiceProps } from '../../core/crud/Edit'
import { Form, Input, Row } from 'antd'
import { ImageFileUpload } from '../../components/Upload'
import { Edit } from './store'
import { TopicInput } from '../../components/topic-select/TopicInput'

const FormItem = Form.Item

export class ImageEditForm extends Component<
  FormComponentProps &
  EditServiceProps<Edit>
  > {
  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    return (
      <Form className="edit-form">
        <Row gutter={24}>

            <FormItem>
              {
                getFieldDecorator('url', {
                  getValueFromEvent: (res) => {
                    return res.file
                  },
                  rules: [{ required: true, message: '请上传图片' }]
                })(
                  <ImageFileUpload uploadText="图片" />
                )
              }
            </FormItem>

            <FormItem label={'标题'} {...formItemLayout}>
              {
                getFieldDecorator('title')(<Input />
                )
              }
            </FormItem>
            <FormItem label={'简介'} {...formItemLayout}>
              {
                getFieldDecorator('summary')(<Input.TextArea autosize={{ minRows: 2, maxRows: 4 }} />)
              }
            </FormItem>

            <FormItem label={'所属专题'} {...formItemLayout}>
              {
                getFieldDecorator('projects')(<TopicInput />)
              }
            </FormItem>
        </Row>
      </Form>
    )
  }
}
