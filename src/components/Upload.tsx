import React, { Component } from 'react'
import { Icon, message, Upload } from 'antd'
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
export class BaseUpload extends Component<UploadProps> {

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
      </Dragger>
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

export const BookFileUpload = (props: Partial<UploadProps>) => {
  const validate = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.'))
    if (ext !== '.pdf' && ext !== '.epub') {
      return false
    }
    return true
  }

  const config = {
    action: 'ebook',
    accept: ['.pdf', '.epub'].join(','),
    validate,
    getResponseValue: (res, stat) => {
      return { file: res.file }
    },
    ...props
  } as UploadProps

  return (
    <BaseUpload {...config}>
      <p className="ant-upload-drag-icon">
        <Icon type="cloud-upload" />
      </p>
      <p className="ant-upload-text">
        把文件拖入指定区域，完成上传，同样支持点击上传。
      </p>
    </BaseUpload>
  )
}

export class ImageFileUpload extends Component<Partial<UploadProps>> {
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
      <BaseUpload {...config}>
        {(crp: ChildRenderProps) => {
          if (crp.file) {
            return (
              <img src={crp.file} style={{ margin: '0 auto' }} />
            )
          }
          return (
            <div>
              <Icon type={crp.loading ? 'loading' : 'plus'} />
              {crp.loading ?
                <div className="ant-upload-text">{crp.percent}%</div>
                :
                <div className="ant-upload-text">{config.uploadText || '上传'}</div>
              }
            </div>
          )
        }}
      </BaseUpload>
    )
  }
}
