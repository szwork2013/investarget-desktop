import React from 'react'

import { Row, Col, Tabs } from 'antd'
import LeftRightLayout from '../components/LeftRightLayout'
import UserInfo from '../components/UserInfo'
import TransactionInfo from '../components/TransactionInfo'

const TabPane = Tabs.TabPane

const rowStyle = {
  borderBottom: '1px dashed #eee',
  padding: '8px 0',
}

const Field = (props) => {
  return (
    <Row style={rowStyle}>
      <Col span={6}>{props.title}</Col>
      <Col span={18}>{props.value}</Col>
    </Row>
  )
}


class UserDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <LeftRightLayout location={location} title="用户详情">
        <Row gutter={48}>
          <Col span={12}>
            <UserInfo />
          </Col>
          <Col span={12}>
            <h3>交易师信息</h3>
            <TransactionInfo />
          </Col>
        </Row>
      </LeftRightLayout>
    )
  }
}

export default UserDetail