import _ from 'lodash'
import React, { Component, ComponentClass } from 'react'
import { Col, Form, message, Modal, Row } from 'antd'
import { FormComponentProps, FormCreateOption, ValidationRule, WrappedFormUtils } from 'antd/lib/form/Form'
import { EditConfigProps, FormConfigProps, FormFiledProps } from './typing'
import { observer } from 'mobx-react'
import { AbstractEditService } from './services/edit.service'
import { getFormControlComponent } from './commons/form-utils'
import { toJS } from 'mobx'

const FormItem = Form.Item
const debug = require('debug')('debug:core:edit-component')

export interface EditServiceProps<T extends AbstractEditService = AbstractEditService> {
  service: T
}
type EditModalProps = EditServiceProps & EditConfigProps & FormConfigProps

@observer
export class EditModal extends Component<EditModalProps> {
  state = this.props.service
  formUtil: WrappedFormUtils

  render() {
    return (
      <Modal
        visible={this.props.service.visible}
        title={
          this.props.title ?
            this.props.title :
            this.state.isEdit ? '编辑' : '新增'
        }
        width={this.props.width || 640}
        maskClosable={false}
        onOk={this.onSubmit}
        confirmLoading={this.state.saving}
        onCancel={() => this.state.visible = false}
        footer={
          _.isFunction(this.props.children)
            ? _.isFunction(this.props.footer) && this.props.footer()
            : undefined
        }
      >
        {
          _.isFunction(this.props.children) && this.props.children()
        }
        <EditFrom
          {...this.props}
          FormComponent={PureForm}
          formUtilRef={this.getFormUtilRef}
        />
      </Modal>
    )
  }
  onSubmit = () => {
    this.formUtil.validateFields((err: any) => {
      debug('submit validate error', err)
      if (err) {
        message.warning('请检查表单是否填写完整')
        return
      }
      this.props.service.onEditSubmit()
    })
  }
  protected getFormUtilRef = (ref: WrappedFormUtils) => {
    this.formUtil = ref
  }
}

export class EditFrom extends Component<EditModalProps &
  {
    FormComponent: ComponentClass<FormComponentProps>
    formUtilRef: (ref: WrappedFormUtils) => void
  }
> {
  state = this.props.service
  render() {
    const formCreateOption: FormCreateOption<{}> = {
      mapPropsToFields: (props: EditServiceProps & FormConfigProps) => {
        const data = _.isFunction(props.mapValuesFrom) ?
          props.mapValuesFrom() :
          props.service.data
        debug('mapPropsToFields data', toJS(data))
        return _.mapValues(data, val => {
          return Form.createFormField({
            ...val,
            value: val
          })
        })
      },
      onValuesChange: (props: EditServiceProps & FormConfigProps, changedFields, allValues) => {
        debug('FormDecorator onFieldsChange', changedFields, allValues)
        if (_.isFunction(props.onValuesChange)) {
          props.onValuesChange(props, changedFields, allValues)
        } else {
          this.state.data = {
            ...this.state.data,
            ..._.mapValues(changedFields, (field: any) => field.value)
          }
        }
      },
      onFieldsChange: (props, changedFields) => {
        if(!_.isFunction(this.props.onValuesChange)){
        debug('FormDecorator onFieldsChange', changedFields)
        this.state.data = {
          ...this.state.data,
          ..._.mapValues(changedFields, (field: any) => field.value)
        }
      }
    }
    }
    const WrappedForm = Form.create(formCreateOption)(this.props.FormComponent)
    return (
      <WrappedForm
        wrappedComponentRef={this.setFromRef}
        {...this.props}
      />
    )
  }
  private setFromRef = (ref: any) => {
    if (ref)
      this.props.formUtilRef(ref.props.form)
  }
}


class PureForm extends Component<
  EditServiceProps &
  FormConfigProps &
  FormComponentProps
> {
  render() {
    return (
      <Form className="edit-form">
        {this.props.colSpan ?
          <Row gutter={24}>
            { this.getFormItems() }
          </Row>
          :
          this.getFormItems()
        }
      </Form>
    )
  }
  getFormItems() {
    const { getFieldDecorator } = this.props.form
    debug('getFormItems with fields', this.props.fields)
    return this.props.fields.map(field => {
      const item = {...field}
      const FieldControl: React.ReactNode = item.render
          ? item.render()
          : getFormControlComponent(item)
      const fromItem = (
        <FormItem
          key={item.dataKey}
          label={item.label}
        >
          {
            getFieldDecorator(item.dataKey, {
              rules: this.getFormItemRules(item)
            })(
              FieldControl
            )
          }
        </FormItem>
      )
      if (item.colSpan || this.props.colSpan) {
        return (
          <Col
            key={`col-${item.dataKey}`}
            span={item.colSpan || this.props.colSpan}
          >
            { fromItem }
          </Col>
        )
      }
      return fromItem
    })
  }
  private getFormItemRules(item: FormFiledProps) {
    const rules: ValidationRule[] = []
    if (item.required) {
      rules.push({ required: true, message: '必填' })
    }
    return rules
  }
}
