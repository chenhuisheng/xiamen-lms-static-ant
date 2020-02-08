import React, { Component } from 'react'
import { Router } from '@reach/router'
import { PUBLIC_PATH } from './config'
import { Login } from './pages/passport/Login'
import { AuthGuard } from './core/AuthGuard'
import { DefaultLayout } from './layouts/DefaultLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Topic from './pages/topic/Topic'
import TopicBook from './pages/topic-book/TopicBook'
import TopicSwipeList from './pages/topic-swipe-list/TopicSwipeList'
import Book from './pages/book/Book'
import Magazine from './pages/magazine/Magazine'
import Paper from './pages/paper/Paper'
import Videos from './pages/videos/Videos'
import Image from './pages/image/Image'
import SwipeImage from './pages/swipe-image/SwipeImage'
import Account from './pages/account/Account'
import Statistics from './pages/statistics/Statistics'

export class AppRouter extends Component {
  render() {
    return (
      <Router
        basepath={PUBLIC_PATH}
      >
        <Login path="login" />

        <AuthGuard path="/">
          <DefaultLayout path="/">

            <Dashboard path="dashboard" default />
            <Statistics path="statistics" />

            <Topic path="topic" />
            <TopicBook path="topic-book" />
            <TopicSwipeList path="topic-swipe-list" />

            <Book path="book" />
            <Magazine path="magazine" />
            <Paper path="paper" />
            <Videos path="videos" />
            <SwipeImage path="swipe-image" />
            <Image path="image" />

            <Account path="account" />

          </DefaultLayout>
        </AuthGuard>
      </Router>
    )
  }
}
