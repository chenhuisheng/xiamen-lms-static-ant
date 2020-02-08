import React, { Component } from 'react'
import { Edit } from './store'
import { Button, message, Modal, Steps } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { observer } from 'mobx-react'
import { EditFrom, EditServiceProps } from '../../core/crud/Edit'
import { FileResponse, ImageFileUpload } from '../../components/Upload'
import { SwipeImageEditForm } from './SwipeImageEditForm'

const { Step } = Steps

@observer
export class SwipeImageEditModal extends Component<EditServiceProps<Edit>> {

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
      if (state.isEdit || currentStep !== 0) {
        return (
          <>
            {cancelBtn}
            {submitBtn}
          </>
        )
      }
      else {
        return null
      }
    }

    const getModalContent = () => {
      const UploadForm = (
        <>
          <ImageFileUpload
            showFileList={true}
            uploadText="将图片拖动到此处, 或点击上传"
            onChange={(res: FileResponse) => {
              state.data.url = res.file
              state.currentStep = 1
            }}
          />

          <div className="form-help">建议尺寸: 1920*1080</div>
        </>
      )
      const MainForm = (
        <EditFrom
          service={this.props.service}
          fields={[]}
          FormComponent={SwipeImageEditForm}
          formUtilRef={this.getFormUtilRef}
        />
      )

      if (!this.props.service.isEdit) {
        if (this.props.service.currentStep === 0) return UploadForm
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
            <Step title={'上传轮播图片'} />
            <Step title={'填写信息'} />
            <Step title={'完成'} />
          </Steps>
        )
      }
      return null
    }

    return (
      <Modal
        visible={state.visible}
        title={state.isEdit ? '编辑' : '新增'}
        width={600}
        maskClosable={false}
        onCancel={() => state.visible = false}
        footer={getModalFooter()}
      >
        {getSteps()}
        {getModalContent()}
      </Modal>
    )
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
