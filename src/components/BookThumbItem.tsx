import _ from 'lodash'
import React from 'react'
import { Book } from '../typing'
import { dateFormat } from '../utils'

export const BookThumbItem = (props: { book: Book }) => {
  const { book } = props
  return (
    <div className="book-thumb-item">
      <div className="thumb">
        <img src={book.image} alt="" />
      </div>
      <div className="content">
        <div className="title">{book.title}</div>
        <div className="desc">{joinAuthor(book.author)}</div>
        <div className="desc">{book.publisher}</div>
        <div className="desc">{dateFormat(book.pub_date)}</div>
      </div>
    </div>
  )
}

function joinAuthor(arr: string) {
  return _.chain(arr).split('/').join(',').value()
}

export default BookThumbItem
