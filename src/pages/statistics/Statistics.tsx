import React, { Component } from 'react'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { RouteComponentProps } from '@reach/router'
import { Store } from './store'
import _ from 'lodash'
import { Chart, Tooltip, Axis, Bar } from 'viser-react'
import { observer } from 'mobx-react'
import './style.less'
import { DatePicker, Form, Tabs } from 'antd'
import moment from 'moment'
import { Statistics } from '../../typing'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const WeekPicker = DatePicker.WeekPicker
const MonthPicker = DatePicker.MonthPicker
const FormItem = Form
const TabPane = Tabs.TabPane
@observer
class Statistic extends Component<RouteComponentProps> {

  statistics : Statistics
  store: Store
  componentWillMount() {
    this.store = new Store()
    this.store.search.onSubmit()
  }

  onChangeWeek = (value: any) => {
    if(value){
      this.store.search.data.date_begin =  moment(value).day(1).format('YYYY-MM-DD'),
      this.store.search.data.date_end = moment(value).day(7).format('YYYY-MM-DD')
    }
    else{
      this.store.search.data.date_begin =  null,
      this.store.search.data.date_end =null
    }
    this.store.search.onSubmit()
  }

  onChangeMonth = (value: any) => {
    if(value){
      this.store.search.data.date_begin = moment(value).startOf('month').format('YYYY-MM-DD'),
      this.store.search.data.date_end = moment(value).endOf('month').format('YYYY-MM-DD')
    }
    else{
      this.store.search.data.date_begin =  null,
      this.store.search.data.date_end = null
    }
    this.store.search.onSubmit()
  }

  render() {
    this.statistics = this.store.list.items as Statistics
    const data1 = this.statistics.book_read_count
    const data2 = this.statistics.video_play_count
    const data3 = this.statistics.all_click_count

    const scale = [{
      dataKey: 'count',
      tickInterval: 10,
    }]
    return (
      <PageContainer>
        <PageHeader breadcrumb={['数据阅读统计']} />
        <PageContent>
          <FormItem>
            <Tabs defaultActiveKey="1">
              <TabPane tab="周统计" key="1">
                <WeekPicker onChange={this.onChangeWeek} placeholder="请选择" locale={locale} />
              </TabPane>
              <TabPane tab="月统计" key="2">
                <MonthPicker onChange={this.onChangeMonth} placeholder="请选择" locale={locale} />
              </TabPane>
            </Tabs>
          </FormItem>
          {data1 && (<div className='div-style'>
            <h3>图书阅读次数</h3>
            <Chart forceFit height={400} data={data1} scale={scale}>
              <Tooltip />
              <Axis />
              <Bar position="title*count" />
            </Chart>
          </div>
          )}
          {data2 && ( <div className='div-style'>
            <h3>视频播放次数</h3>
            <Chart forceFit height={400} data={data2} scale={scale}>
              <Tooltip />
              <Axis />
              <Bar position="title*count" />
            </Chart>
          </div>
          )}
          {data3 && ( <div className='div-style'>
            <h3>总次数</h3>
            <Chart forceFit height={400} data={data3} scale={scale}>
              <Tooltip />
              <Axis />
              <Bar position="title*count" />
            </Chart>
          </div>
          )}
        </PageContent>
      </PageContainer>
    )
  }
}

export default Statistic
