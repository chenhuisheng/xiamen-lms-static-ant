import _ from 'lodash'
import React, { Component } from 'react'
import { FormComponentProps } from 'antd/es/form'
import { EditServiceProps } from '../../core/crud/Edit'
import { Col, Form, Input, Row, Popconfirm, Card } from 'antd'
import { ImageFileUploadVideos } from '../../components/VideosUpload'
import { Edit } from './store'
import './style.less'
import { TopicInput } from '../../components/topic-select/TopicInput'
const FormItem = Form.Item

export class VideosEditForm extends Component<
  FormComponentProps &
  EditServiceProps<Edit>
  > {
    onRemoveClick = (index: any) => {
      const { form } = this.props
      form.setFieldsValue({
      })
      this.props.service.data.video_info.splice(index, 1)
    }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    console.log(this.props.service.data.video_info)
    // const formItemLayout1 = {
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 5 }
    // }
    return (
      <Form className="edit-form" >
      {!this.props.service.isEdit && (
      <>
        {_.map(this.props.service.data.video_info, (item, index) => (
        <>
        <Card>
          <Row gutter={24} key={index}>
            <FormItem >
              <div>
                <h3 className="AlignLeft">视频{index+1}</h3>
                  <Popconfirm title="确认删除"
                    onConfirm={() => {
                      this.onRemoveClick(index)
                    }}><a className="AlignRight">删除</a>
                  </Popconfirm>
              </div>
            </FormItem>
            <Col span={6}>
              <FormItem >
              {item.image && (<img src={item.image} style={{ margin: '0 auto' }} />)}
              </FormItem>
              <FormItem >
                {
                  getFieldDecorator(`video_info[${index}].image`, {
                    getValueFromEvent: (res) => {
                      return res.file
                    },
                  })(
                    <ImageFileUploadVideos uploadText="视频封面" />
                  )
                }
              </FormItem>
              <FormItem {...formItemLayout}  >
                <div className="form-help">{item.file_name}</div>
                <div className="form-help">{item.file_size}MB</div>
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem label={'名称'} {...formItemLayout}>
                {
                  getFieldDecorator(`video_info[${index}].title]`, {
                    rules: [{ required: true, message: '必填' }]
                  })(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem label={'作者'} {...formItemLayout} >
                {
                  getFieldDecorator(`video_info[${index}].author`)(<Input />)
                }
                <div className="form-help">多个作者使用逗号分隔</div>
              </FormItem>
              <FormItem label={'所属专题'} {...formItemLayout} >
                {
                  getFieldDecorator(`video_info[${index}].projects`)(<TopicInput />)
                }
              </FormItem>
            </Col>
          </Row>
        </Card>
        <div><p></p></div>
        </>
        ))}
      </>)}
      {this.props.service.isEdit && (
      <>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem >
            <img src={this.props.service.data.image} style={{ margin: '0 auto' }} />
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('image', {
                  getValueFromEvent: (res) => {
                    return res.file
                  },
                  rules: [{ required: true, message: '请上传图片' }]
                })(
                  <ImageFileUploadVideos uploadText="视频封面" />
                )
              }
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label={'名称'} {...formItemLayout}>
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
            <FormItem label={'所属专题'} {...formItemLayout}>
              {
                getFieldDecorator('projects')(<TopicInput />)
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
            <FormItem label={'大小'} {...formItemLayout}>
              <div className="form-help">{this.props.service.data.file_size}MB</div>
            </FormItem>
          </Col>
        </Row>
      </>)}
      </Form>
    )
  }
}
