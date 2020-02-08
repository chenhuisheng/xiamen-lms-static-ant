import React, { Component } from 'react'
import { ImageCardItem, ImageCardProps } from '../../components/ImageCardItem'
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from 'react-dnd'
import { Store } from './store'

interface DragImageCardItemProps extends ImageCardProps {
  store: Store
  canDragging: boolean
  //
  isDragging?: boolean
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
}

const appTarget = {
  hover(props: DragImageCardItemProps, monitor: DropTargetMonitor) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.data.index

    if (dragIndex === hoverIndex) {
      return
    }

    console.log(`drag from ${dragIndex} to ${hoverIndex}`)
    props.store.moveImageCard(monitor.getItem(), { id: props.data.id, index: props.data.index })

    monitor.getItem().index = hoverIndex
  }
}

const appSource = {
  beginDrag(props: DragImageCardItemProps) {
    return { id: props.data.id, index: props.data.index }
  }
}

@DropTarget(
  'card',
  appTarget,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)
@DragSource(
  'card',
  appSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
class DragImageCardItem extends Component<DragImageCardItemProps> {
  render() {
    const { canDragging, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? .4 : 1

    const el = (
      <div
        className="drag-image-card-item"
        style={{ opacity, cursor: 'move' }}
      >
        <ImageCardItem {...this.props}  />
      </div>
    )

    if (!canDragging) {
      return el
    }

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(el)
      )
    )
  }
}

export default DragImageCardItem
