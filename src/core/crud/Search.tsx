import _ from 'lodash'
import React, { Component, FormEvent } from 'react'
import { Button, Form } from 'antd'
import { FormConfigProps, TableConfigProps } from './typing'
import { FormComponentProps, FormCreateOption } from 'antd/lib/form/Form'
import { getFormControlComponent } from './commons/form-utils'
import { AbstractSearchService } from './services/search.service'
import { toJS } from 'mobx'

interface SearchServiceProp {
  service: AbstractSearchService
}

const FormItem = Form.Item

export class Search extends Component<
  SearchServiceProp & FormConfigProps & TableConfigProps
> {
  state = this.props.service

  render() {
    const formCreateOption: FormCreateOption<{}> = {
      mapPropsToFields: (props: SearchServiceProp) => {
        return _.mapValues(props.service.data, val => {
          return Form.createFormField({
            ...val,
            value: val
          })
        })
      },
      onFieldsChange: (props, changedFields) => {
        console.log('onFieldsChange', changedFields)
        this.state.data = {
          ...this.state.data,
          ..._.mapValues(changedFields, (field: any) => field.value)
        }
      }
    }

    const defaultToolbar =  (
      <Button className="button-search"
        type="primary"
        onClick={this.onAddClick}
      >新增</Button>
    )

    const WrappedSearchForm = Form.create(formCreateOption)(SearchForm)
    return (
        <div className="page-search">
          { defaultToolbar }
          <WrappedSearchForm
            {...this.props}
            onSubmit={this.onSubmit}
          />
        </div>
    )
  }


  private onAddClick = () => {
    if (this.props.onAdd) {
      this.props.onAdd()
    }
  }

  onSubmit = () => {
    this.state.data = toJS(this.state.data)
    this.props.service.onSubmit()
  }
}

class SearchForm extends Component<
  FormConfigProps &
  FormComponentProps &
  { onSubmit(): void }
> {

  render() {
    return (
      <Form
        className="search-form"
        layout="inline"
        onSubmit={this.onSubmit}
      >
        { this.getFormItems() }
        <FormItem>
          <Button type="primary" htmlType="submit">查询</Button>
        </FormItem>
      </Form>
    )
  }

  getFormItems() {
    const { getFieldDecorator } = this.props.form

    return this.props.fields.map(item => {
      const FieldControl: React.ReactNode = getFormControlComponent(item)
      return (
        <FormItem
          key={item.dataKey}
          label={item.label}
        >
          {
            getFieldDecorator(item.dataKey, {
              // initialValue: item.defaultValue
            })(
              FieldControl
            )
          }
        </FormItem>
      )
    })
  }

  onSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.props.onSubmit()
  }
}
