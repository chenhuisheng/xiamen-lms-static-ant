import React, { Component } from 'react'
import { PageContainer, PageContent } from '../../layouts/PageLayout'
import { RouteComponentProps } from '@reach/router'

class Dashboard extends Component<RouteComponentProps> {
  render() {
    return (
      <PageContainer>
        <PageContent>

          Dashboard

        </PageContent>
      </PageContainer>
    )
  }
}

export default Dashboard
