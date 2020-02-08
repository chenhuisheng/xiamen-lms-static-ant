import _ from 'lodash'
import React from 'react'
import { Videos } from '../typing'

export const VideosThumbItem = (props: { videos: Videos }) => {
  const { videos } = props
  return (
    <div className="book-thumb-item">
      <div className="thumb">
        <img src={videos.image} alt="" />
      </div>
      <div className="content">
        <div className="title">{videos.title}</div>
        <div className="desc">大小：{videos.file_size}MB</div>
        <div className="desc">格式：{videos.file_type}</div>
      </div>
    </div>
  )
}

export default VideosThumbItem
