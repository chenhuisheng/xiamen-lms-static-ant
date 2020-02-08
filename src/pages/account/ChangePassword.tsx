import _ from 'lodash'
import React, { Component } from 'react'
import { Form, Input, message, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { AJAXErrorResult, POST } from '../../utils'
import { UserService } from '../../core/services/user.service'

const FormItem = Form.Item

class ChangePassword extends Component<{
  visible: boolean
  onClose: () => void
}> {

  form: WrappedFormUtils

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title="修改密码"
        onOk={() => {this.onConfirm()}}
        onCancel={this.props.onClose}
        destroyOnClose={true}
      >
        <ChangePasswordForm
          wrappedComponentRef={(ref: any) => {
            if (ref) this.form = ref.props.form
          }}
        />
      </Modal>
    )
  }

  onConfirm = () => {
    this.form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      console.log(values)
      const uid = UserService.user.id
      try {
        await POST(`account/change_password/${uid}`, {
          data: values
        })
        message.success('密码修改成功')
        this.props.onClose()

      } catch (e) {
        const ex: AJAXErrorResult = e
        if (ex.handled) return
        message.error(ex.message)
      }
    })
  }
}

const ChangePasswordForm = Form.create({})(
  class extends Component<FormComponentProps> {
    render() {
      const { getFieldDecorator } = this.props.form
      return (
        <Form layout="vertical">
          <FormItem label="当前密码">
            {
              getFieldDecorator('old_password', {
                rules: [
                  { required: true, message: '请填写' }
                ]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="新密码">
            {
              getFieldDecorator('new_password', {
                rules: [
                  { required: true, message: '请填写' },
                  { min: 6, message: '请使用6位以上的密码' }
                ]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="确认密码">
            {
              getFieldDecorator('check_new_password', {
                rules: [
                  { required: true, message: '请填写' },
                  { min: 6, message: '请使用6位以上的密码' }
                ]
              })(
                <Input />
              )
            }
          </FormItem>
        </Form>
      )
    }
  }
)

export default ChangePassword
