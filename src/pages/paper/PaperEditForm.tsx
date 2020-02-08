import React, { Component } from 'react'
import { FormComponentProps } from 'antd/es/form'
import { EditServiceProps } from '../../core/crud/Edit'
import { Col, Divider, Form, Input, Row } from 'antd'
import { Edit } from './store'
import './style.less'
import { TopicInput } from '../../components/topic-select/TopicInput'

const FormItem = Form.Item

export class PaperEditForm extends Component<
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
          <Col span={18}>
            <div className="form-group-header">基本信息</div>
            <FormItem label={'标题'} {...formItemLayout}>
              {
                getFieldDecorator('title', {
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label={'作者'} {...formItemLayout}>
              {
                getFieldDecorator('author')(<Input />)
              }
              <div className="form-help">多个作者使用逗号分隔</div>
            </FormItem>
            <FormItem label={'来源'} {...formItemLayout}>
              {
                getFieldDecorator('source', {
                  rules: [{ required: true, message: '必填' }]
                })(<Input />)
              }
            </FormItem>
              <FormItem label={'所属专题'} {...formItemLayout}>
                {
                  getFieldDecorator('projects')(<TopicInput />)
                }
              </FormItem>

            <Divider />

            <div className="form-group-header">出版信息</div>
            <FormItem label={'出版时间'} {...formItemLayout}>
              {
                getFieldDecorator('pub_date')(<Input />)
              }
            </FormItem>
            <FormItem label={'版次'} {...formItemLayout}>
              {
                getFieldDecorator('edition')(<Input />)
              }
            </FormItem>
              <FormItem label={'文件'} {...formItemLayout}>
                {this.props.service.data.file_path && (
                  <a
                    href={this.props.service.data.file_path}
                    target="_blank"
                  >
                    {this.props.service.data.file_path}
                  </a>
                )}
              </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
