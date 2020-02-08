import React from 'react'
import { Card, Popconfirm } from 'antd'
import { ImageCardData } from '../typing'
import { dateFormat } from '../utils'
import classnames from 'classnames'

export interface ImageCardProps {
  data: ImageCardData
  width?: number

  editBtnVisible?: boolean
  removeBtnVisible?: boolean
  onEditClick?: (data: ImageCardData) => void
  onRemoveClick?: (data: ImageCardData) => void

  checked?: boolean
  onCheckChange?: (data: ImageCardData) => void
}

export const ImageCardItem = (props: ImageCardProps) => {
  const { data } = props

  const className = classnames({
    'image-card-item': 1,
    'image-card-item--checkable': !!props.onCheckChange,
    'image-card-item--checked': props.checked
  })

  const onClick = () => {
    if (props.onCheckChange) {
      props.onCheckChange(data)
    }
  }

  return (
    <Card
      className={className}
      style={{ width: props.width || 280 }}
      cover={(
        <img src={data.url || '//placehold.it/300x500'} alt="" />
      )}
      onClick={onClick}
    >
      {(data.title || data.summary) && (
        <Card.Meta
          title={data.title}
          description={data.summary}
        />
      )}

      <div className="card-footer">
        <div className="time">{dateFormat(data.created_at)}</div>
        <div className="actions">
          {props.editBtnVisible && (
            <a onClick={() => {
              if (props.onEditClick) props.onEditClick(data)
            }}>编辑</a>
          )}

          {props.removeBtnVisible && (
            <Popconfirm
              title="确认删除"
              onConfirm={() => {
                if (props.onRemoveClick) props.onRemoveClick(data)
              }}>
              <a>删除</a>
            </Popconfirm>
          )}
        </div>
      </div>

      {props.checked && (
        <div className="checkbox-label" />
      )}
    </Card>
  )
}
