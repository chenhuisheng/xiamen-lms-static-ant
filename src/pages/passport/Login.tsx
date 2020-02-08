import React, { Component, FormEvent } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import { Alert, Button, Checkbox, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { AJAXErrorResult, POST } from '../../utils'
import { PUBLIC_PATH } from '../../config'
import './style.less'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import logo from '../../styles/images/logo2.png'

const FormItem = Form.Item

class Store {
  @observable loading = false
  @observable errorMessage: string = ''
}
const store = new Store()

@observer
export class Login extends Component<RouteComponentProps> {

  render() {
    const WrappedForm = Form.create()(LoginForm)
    return (
      <div className="page-passport login-page">
        <div className="page-container">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="title">
            多媒体展示系统管理后台
          </div>

          <WrappedForm
            onSubmit={this.onSubmit}
          />
        </div>
      </div>
    )
  }

  onSubmit = async (formData: any) => {
    await POST('account/login', {
      data: {
        ...formData
      }
    })
    navigate(`${PUBLIC_PATH}/`, { replace: true })
  }
}

@observer
class LoginForm extends Component<
  FormComponentProps &
  {
    onSubmit: (formData: any) => Promise<void>
  }
> {

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className="login-form"
        onSubmit={this.handleSubmit}
      >

        {store.errorMessage && !store.loading && (
          <Alert
            type={'warning'}
            showIcon={true}
            message={store.errorMessage}
            style={{ marginBottom: 16 }}
          />
        )}

        <FormItem>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input
              prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.5)' }} />}
              placeholder="手机号"
              size="large"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.5)' }} />}
              placeholder="密码"
              size="large"
              type="password"
            />
          )}
        </FormItem>
        <FormItem>
          <Checkbox defaultChecked={true}>保持登录状态</Checkbox>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={store.loading}
          >登录</Button>
        </FormItem>
      </Form>
    )
  }

  handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields(async (err: any, values: object) => {
      if (err) {
        return
      }

      store.loading = true
      try {
        await this.props.onSubmit(values)

      } catch (e) {
        const ex: AJAXErrorResult = e
        if (ex.handled) return
        store.errorMessage = ex.message

      } finally {
        store.loading = false
      }
    })
  }
}
