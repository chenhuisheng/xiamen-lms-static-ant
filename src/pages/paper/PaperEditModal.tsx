import React, { Component } from 'react'
import { Edit } from './store'
import { Button, message, Modal, Steps } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { observer } from 'mobx-react'
import { EditFrom, EditServiceProps } from '../../core/crud/Edit'
import { PaperEditForm } from './PaperEditForm'
import { BookFileUpload, FileResponse } from '../../components/Upload'
import { TopicSelect } from '../../components/topic-select/TopicSelect'
const { Step } = Steps

@observer
export class PaperEditModal extends Component<EditServiceProps<Edit>> {

  formUtil: WrappedFormUtils

  render() {
    const state = this.props.service
    const { currentStep } = state

    const getModalFooter = () => {
      const cancelBtn = (
        <Button onClick={() => state.visible = false}>取消</Button>
      )
      const submitBtn = (
        <Button type={'primary'} onClick={this.onSubmit}>确定</Button>
      )
      if (state.isEdit) {
        return (
          <>
            {cancelBtn}
            {submitBtn}
          </>
        )
      }
      else if (currentStep === 0) {
        return null
      }
      else {
        return (
          <>
            {cancelBtn}
            {currentStep === 1 && (
              <Button type={'primary'} onClick={this.onStepNext}>下一步</Button>
            )}
            {currentStep === 2 && (
              submitBtn
            )}
          </>
        )
      }
    }

    const getModalContent = () => {
      const UploadForm = (
        <BookFileUpload
          showFileList={true}
          onChange={(res: FileResponse, stat) => {
            state.data = stat.file.response.data
            state.data.file_path = res.file
            state.currentStep = 1
          }}
        />
      )
      const TopicForm = (
        <TopicSelect
          defaultValue={[]}
          onChange={(selected, item) => {
            this.props.service.data.project_ids = selected
            this.props.service.data.projects = item
          }}
          showHeader={true}
        />
      )
      const MainForm = (
        <EditFrom
          service={this.props.service}
          fields={[]}
          FormComponent={PaperEditForm}
          formUtilRef={this.getFormUtilRef}
        />
      )

      if (!this.props.service.isEdit) {
        if (this.props.service.currentStep === 0) return UploadForm
        if (this.props.service.currentStep === 1) return TopicForm
      }

      return MainForm
    }

    const getSteps = () => {
      if (!this.props.service.isEdit) {
        return (
          <Steps
            size={'small'}
            current={this.props.service.currentStep}
            style={{ marginBottom: 30 }}
          >
            <Step title={'上传报纸'} />
            <Step title={'选择专题'} />
            <Step title={'填写报纸信息'} />
            <Step title={'完成'} />
          </Steps>
        )
      }
      return null
    }

    const width = state.isEdit
      ? 740
      : state.currentStep === 0
        ? 600
        : 740

    return (
      <Modal
        visible={state.visible}
        title={state.isEdit ? '编辑' : '新增'}
        width={width}
        maskClosable={false}
        onCancel={() => state.visible = false}
        footer={getModalFooter()}
      >
        {getSteps()}
        {getModalContent()}
      </Modal>
    )
  }

  onStepNext = () => {
    this.props.service.currentStep += 1
  }

  onSubmit = () => {
    this.formUtil.validateFields((err: any) => {
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
