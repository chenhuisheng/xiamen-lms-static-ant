import _ from 'lodash'
import React, { Component } from 'react'
import { Edit } from './store'
import { Button, message, Modal, Steps } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { observer } from 'mobx-react'
import { EditFrom, EditServiceProps } from '../../core/crud/Edit'
import { VideosEditForm } from './VideosEditForm'
import { VideosFileUpload } from '../../components/VideosUpload'
import { VideoUploadFile } from '../../typing'
const { Step } = Steps

@observer
export class VideosEditModal extends Component<EditServiceProps<Edit>> {

  formUtil: WrappedFormUtils
  fileList: VideoUploadFile[]

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
            {/* {currentStep === 1 && (
              <Button type={'primary'} onClick={this.onStepNext}>下一步</Button>
            )} */}
            {currentStep === 1 && (
              submitBtn
            )}
          </>
        )
      }
    }
    const getModalContent = () => {
      const UploadForm = (
        <VideosFileUpload
          showFileList={true}
          onVideosChange={(stat) => {
            const status = _.every(stat.fileList, item => {
              return item.response && item.response.code === 200
            })
            if (status) {
              this.fileList = _.map(stat.fileList, item => {
                return {
                  file_size: item.response.data.file_size,
                  file_path: item.response.data.url,
                  image: item.response.data.thumbnail,
                  file_name: item.response.data.file_name

                }
              })
              state.data.video_info = this.fileList
              state.currentStep = 1
            }
          }}
        />
      )
      const MainFormVideos= (
        <EditFrom
          service={this.props.service}
          fields={[]}
          FormComponent={VideosEditForm}
          formUtilRef={this.getFormUtilRef}
          onValuesChange={(props, changedFields, allValues) => {
            this.props.service.data.video_info = _.chain(allValues.video_info)
              .map((item, index) => {
                item.project_ids = _.map(item.projects, p => {
                  return p.id
                })
                return {
                  ...props.service.data.video_info[index],
                  ..._.omitBy(item, _.isNil),
                }
              })
              .value()
          }}
        />
      )
      const MainForm = (
        <EditFrom
          service={this.props.service}
          fields={[]}
          FormComponent={VideosEditForm}
          formUtilRef={this.getFormUtilRef}
        />
      )

      if (!this.props.service.isEdit) {
        if (this.props.service.currentStep === 0) return UploadForm
        // if (this.props.service.currentStep === 1) return TopicForm
      }
      if (this.props.service.isEdit) {
        return MainForm
      }
      else{
        return MainFormVideos
      }
    }

    const getSteps = () => {
      if (!this.props.service.isEdit) {
        return (
          <Steps
            size={'small'}
            current={this.props.service.currentStep}
            style={{ marginBottom: 30 }}
          >
            <Step title={'上传视频'} />
            {/* <Step title={'选择专题'} /> */}
            <Step title={'填写视频信息'} />
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
