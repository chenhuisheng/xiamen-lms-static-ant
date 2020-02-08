import React, { Component } from 'react'
import { FormComponentProps } from 'antd/es/form'
import { EditServiceProps } from '../../core/crud/Edit'
import { Col, Divider, Form, Input, InputNumber, Row } from 'antd'
import { ImageFileUpload } from '../../components/Upload'
import { Edit } from './store'
import './style.less'
import { TopicInput } from '../../components/topic-select/TopicInput'
const FormItem = Form.Item

export class BookEditForm extends Component<
  FormComponentProps &
  EditServiceProps<Edit>
  > {
  render() {
    const { getFieldDecorator } = this.props.form
    const publisher = this.props.service.data.publisher

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }

    return (
      <Form className="edit-form">
        <Row gutter={24}>
          <Col span={6}>

            <FormItem>
              {
                getFieldDecorator('image', {
                  getValueFromEvent: (res) => {
                    return res.file
                  }
                })(
                  <ImageFileUpload uploadText="图书封面" />
                )
              }
            </FormItem>

          </Col>
          <Col span={18}>
            <div className="form-group-header">基本信息</div>
            <FormItem label={'书名'} {...formItemLayout}>
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
                getFieldDecorator('author', {
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Input />
                )
              }
              <div className="form-help">多个作者使用逗号分隔</div>
            </FormItem>

              <FormItem label={'所属专题'} {...formItemLayout}>
                {
                  getFieldDecorator('projects')(<TopicInput />)
                }
              </FormItem>


            <Divider />

            <div className="form-group-header">出版信息</div>
            <FormItem label={'ISBN'} {...formItemLayout}>
              {
                getFieldDecorator('isbn')(<Input />)
              }
            </FormItem>
            <FormItem label={'出版社'} {...formItemLayout}>
              {
                <Input defaultValue={publisher} />
              }
            </FormItem>
            <FormItem label={'出版时间'} {...formItemLayout}>
              {
                getFieldDecorator('pub_date')(<Input />)
              }
            </FormItem>

            <Divider />

            <div className="form-group-header">内容详情</div>
            <FormItem label={'页数'} {...formItemLayout}>
              {
                getFieldDecorator('pages')(<InputNumber min={1} />)
              }
            </FormItem>
            <FormItem label={'简介'} {...formItemLayout}>
              {
                getFieldDecorator('summary')(<Input.TextArea autosize={{ minRows: 4, maxRows: 10 }} />)
              }
            </FormItem>
            <FormItem label={'目录'} {...formItemLayout}>
              {
                getFieldDecorator('catalog')(<Input.TextArea autosize={{ minRows: 4, maxRows: 10 }} />)
              }
            </FormItem>

              <FormItem label={'电子书文件'} {...formItemLayout}>
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
