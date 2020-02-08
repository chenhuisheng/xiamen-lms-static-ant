import React, { Component } from 'react'
import { Icon, message, Upload, Button } from 'antd'
import { API_HOST } from '../config'
import { UploadChangeParam } from 'antd/lib/upload'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

const { Dragger } = Upload

export interface FileResponse {
  file: string
}

interface UploadProps {
  value: string | null
  action: string
  accept: string
  validate: (file: File) => boolean
  onChange: (res: FileResponse, stat: UploadChangeParam) => void
  onVideosChange: (stat: UploadChangeParam) => void
  showFileList?: boolean
  multiple?: boolean
  uploadText?: string
  getResponseValue: (res: any, stat: any) => FileResponse
}
interface ChildRenderProps {
  loading: boolean
  percent: number
  file: string | null
}


@observer
export class BaseVideosUpload extends Component<UploadProps> {

  @observable loading = false
  @observable percent = 0
  @observable file: string | null = this.props.value

  render() {
    const crp: ChildRenderProps = {
      loading: this.loading,
      percent: this.percent,
      file: this.file
    }
    return (
      <Dragger
        action={`${API_HOST}/upload/${this.props.action}`}
        accept={this.props.accept}
        beforeUpload={this.validate}
        onChange={this.onVideosChange}
        showUploadList={this.props.showFileList || false}
        openFileDialogOnClick={!this.loading}
        multiple={this.props.multiple}
      >
        {_.isFunction(this.props.children) ?
          this.props.children(crp)
          :
          this.props.children
        }
      </Dragger>
    )
  }

  validate = (file: File) => {
    console.log(file)
    return this.props.validate(file)
  }

  onVideosChange = (stat: UploadChangeParam) => {
    console.log(stat)
    const status = _.every(stat.fileList, item => {
      return item.response && item.response.code === 200 && item.status === 'done'
    })
    if (status) {
      this.loading = false
      if (this.props.onVideosChange && stat.fileList.length) {
          this.props.onVideosChange(stat)
      }
    }
  }
}

export const VideosFileUpload = (props: Partial<UploadProps>) => {
  const validate = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.'))
    if (ext !== '.mp4' && ext !== '.flv' && ext !== '.mkv' && ext !== '.avi' && ext !== '.rmvb') {
      message.warning('文件格式不正确，请删除' )
    }
    return true
  }

  const config = {
    action: 'video',
    accept: ['.mp4', '.flv', '.mkv', '.avi', '.rmvb'].join(','),
    multiple: true,
    validate,
    getResponseValue: (res, stat) => {
      return { stat }
    },
    ...props
  } as UploadProps

  return (
    <BaseVideosUpload {...config}>
      <p className="ant-upload-drag-icon">
        <Icon type="cloud-upload" />
      </p>
      <p className="ant-upload-text">
        把文件拖入指定区域，完成上传，同样支持点击上传。
      </p>
    </BaseVideosUpload>
  )
}


@observer
export class BaseUploadVideos extends Component<UploadProps> {

  @observable loading = false
  @observable percent = 0
  @observable file: string | null = this.props.value

  render() {
    const crp: ChildRenderProps = {
      loading: this.loading,
      percent: this.percent,
      file: this.file
    }
    return (
      <Upload className="upload-list-inline"
        action={`${API_HOST}/upload/${this.props.action}`}
        accept={this.props.accept}
        beforeUpload={this.validate}
        onChange={this.onChange}
        showUploadList={this.props.showFileList || false}
        openFileDialogOnClick={!this.loading}
        multiple={this.props.multiple}
      >
        {_.isFunction(this.props.children) ?
          this.props.children(crp)
          :
          this.props.children
        }
      </Upload>
    )
  }

  validate = (file: File) => {
    console.log(file)
    return this.props.validate(file)
  }

  onChange = (stat: UploadChangeParam) => {
    console.log(stat)
    if (stat.file.status === 'uploading') {
      this.loading = true
      if (stat.event) this.percent = stat.event.percent
    }
    if (stat.file.status === 'done') {
      this.loading = false
      const value = this.props.getResponseValue(_.get(stat.file.response, 'data'), stat)
      this.file = value.file
      if (this.props.onChange && this.file) {
        this.props.onChange({ file: this.file}, stat)
      }
    }
  }
}

export class ImageFileUploadVideos extends Component<Partial<UploadProps>> {
  render() {
    const validate = (file: File) => {
      const type = file.type
      if (type.indexOf('image/') === -1) {
        message.warning('仅支持图片格式')
        return false
      }
      return true
    }

    const config = {
      action: 'image',
      accept: 'image/*',
      validate,
      getResponseValue: (res) => {
        return { file: res.url }
      },
      ...this.props
    } as UploadProps

    return (
      <BaseUploadVideos {...config}>
        {(crp: ChildRenderProps) => {
          return(
            <Button type="ghost">
              <Icon type="upload" /> 上传封面
            </Button>
          )
        }}
      </BaseUploadVideos>
    )
  }
}
