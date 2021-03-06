import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { i18n, hasPerm, getCurrentUser } from '../utils/util'
import { Input, Icon, Table, Button, Pagination, Popconfirm, Card, Row, Col, Modal } from 'antd'
import LeftRightLayout from '../components/LeftRightLayout'

import {
  RadioTrueOrFalse,
  CheckboxCurrencyType,
} from '../components/ExtraInput'
import { queryDataRoom, getUserBase, getProjLangDetail } from '../api'
import * as api from '../api'
import { Search2 } from '../components/Search'

const rowStyle = {
  marginBottom: '24px',
}
const addCardStyle = {
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
}
const addCardBodyStyle = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
// ...
const cardStyle = {
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
}
const cardBodyStyle = {
  height: '100%',
  padding: 0,
}
const cardImageStyle = {
  height: '200px',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  cursor: 'pointer',
}
const cardTitleStyle = {
  fontSize: '15px',
  marginBottom: '8px',
}
const cardTimeStyle = {
  marginBottom: '8px',
}
const cardUserStyle = {
  fontSize: '13px',
  marginBottom: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
}
const cardActionStyle = {
}


class DataRoomList extends React.Component {

  constructor(props) {
    super(props)

    const setting = this.readSetting()
    const search = setting ? setting.search : null
    const page = setting ? setting.page : 1
    const pageSize = 11

    this.state = {
      search,
      page,
      pageSize,
      total: 0,
      list: [],
      loading: false,
    }
  }

  handleSearch = (search) => {
    this.setState({ search, page: 1 }, this.getDataRoomList)
  }

  handlePageChange = (page) => {
    this.setState({ page }, this.getDataRoomList)
  }

  // handlePageSizeChange = (current, pageSize) => {
  //   this.setState({ pageSize, page: 1 }, this.getDataRoomList)
  // }

  getDataRoomList = () => {
    const { search, page, pageSize } = this.state
    const params = { search, page_index: page, page_size: pageSize }
    this.setState({ loading: true })

    if (hasPerm('usersys.as_admin')) {
      api.queryDataRoom(params).then(result => {
        const { count: total, data: list } = result.data
        this.setState({ loading: false, total, list })
      }).catch(error => {
        this.setState({ loading: false })
        this.props.dispatch({
          type: 'app/findError',
          payload: error
        })
      })
    } else {
      api.queryUserDataRoom(params).then(result => {
        const { count: total, data: list } = result.data
        this.setState({ loading: false, total, list: list.map(item=>item.dataroom) })
      }).catch(error => {
        this.setState({ loading: false })
        this.props.dispatch({
          type: 'app/findError',
          payload: error
        })
      })
    }

    this.writeSetting()
  }


  deleteDataRoom (dataroom) {
    this.setState({ loading: true })
    const id = dataroom.id
    api.deleteDataRoom(id)
      .then(data => this.getDataRoomList())
      .catch(err => {
        this.setState({ loading: false })
        this.props.dispatch({ type: 'app/findError', payload: err })
      })
  }

  handleCloseDateRoom (dataroom) {
    this.setState({ loading: true })
    const id = dataroom.id
    const body = {
      isClose: !dataroom.isClose,
    }
    api.editDataRoom(id, body)
    .then(data => this.getDataRoomList())
    .catch(err => {
      this.setState({ loading: false })
      this.props.dispatch({ type: 'app/findError', payload: err })
    })
  }

  writeSetting = () => {
    const { filters, search, page, pageSize } = this.state
    const data = { filters, search, page, pageSize }
    localStorage.setItem('DataRooomList', JSON.stringify(data))
  }

  readSetting = () => {
    var data = localStorage.getItem('DataRooomList')
    return data ? JSON.parse(data) : null
  }

  componentDidMount() {
    this.getDataRoomList()
  }

  render() {
    const { location } = this.props
    const { total, list, loading, search, page, pageSize } = this.state

    const count = list.length + 1
    const cols = 3
    const rows = Math.ceil(count / cols)

    function getRowCols(rowIndex) {
      if (rowIndex < rows - 1) {
        return cols
      } else {
        return count - cols * (rows - 1)
      }
    }

    const AddCard = function AddCard() {
      return (
        <Card style={addCardStyle} bodyStyle={addCardBodyStyle}>
          <Link to={'/app/projects/list'}>
            <div style={{ textAlign: 'center', cursor: 'pointer', color: 'rgba(0,0,0,.65)' }}>
              <Icon type="plus" style={{ fontSize: '64px', marginBottom: '16px' }} />
              <br />
              <span style={{ fontSize: '14px' }}>{i18n('dataroom.create_dataroom')}</span>
            </div>
          </Link>
        </Card>
      )
    }

    const DataroomCard = ({ record }) => {

      const dataroomId = record.id
      const projId = record.proj.id
      const projTitle = record.proj.projtitle
      const createUserID = record.createuser
      // const dataroomUrl = `/app/dataroom/detail?id=${dataroomId}&projectID=${projId}&investorID=${investorId}&traderID=${traderId}&projectOwnerID=${supportorId}&projectTitle=${encodeURIComponent(projTitle)}&isClose=${record.isClose}&createUserID=${createUserID}`
      const dataroomUrl = `/app/dataroom/detail?id=${dataroomId}&isClose=${record.isClose}&projectID=${projId}&projectTitle=${encodeURIComponent(projTitle)}`
      const imgUrl = (record.proj.industries && record.proj.industries.length) ? record.proj.industries[0].url : ''
      const dataroomTime = record.createdtime.slice(0, 16).replace('T', ' ')

      return (
        <Card style={cardStyle} bodyStyle={cardBodyStyle}>
          <Link to={dataroomUrl}>
            <div style={{ ...cardImageStyle, backgroundImage: `url(${imgUrl})` }}></div>
          </Link>
          <div style={{ padding: '16px' }}>
            <div style={cardTitleStyle}>
              <Link to={`/app/projects/${projId}`} target="_blank">{projTitle}</Link>
            </div>
            <div style={cardTimeStyle}>{i18n('dataroom.created_time')}: {dataroomTime}</div>
            <div style={cardActionStyle}>
              <Popconfirm title={record.isClose ? i18n("open_confirm") : i18n("close_confirm")} onConfirm={this.handleCloseDateRoom.bind(this, record)}>
                <Button size="small" disabled={!hasPerm('dataroom.admin_closedataroom')} style={{ marginRight: '8px' }}>{record.isClose ? i18n('common.open') : i18n('common.close')}</Button>
              </Popconfirm>
              <Popconfirm title={i18n("delete_confirm")} onConfirm={this.deleteDataRoom.bind(this, record)}>
                <Button size="small" type="danger" disabled={!hasPerm('dataroom.admin_deletedataroom')} style={{ marginRight: '8px' }}>{i18n("common.delete")}</Button>
              </Popconfirm>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <LeftRightLayout location={location} title={i18n('dataroom.dataroom_list')}>
        <div>

          <div style={{marginBottom: '16px'}}>
            <Search2 style={{width: 200}} placeholder={!hasPerm('usersys.as_admin') && hasPerm('usersys.as_investor') ? i18n('dataroom.project_name') : [i18n('dataroom.project_name'), i18n('dataroom.investor')].join(' / ')} defaultValue={search} onSearch={this.handleSearch} />
          </div>

          <div className="ant-spin-nested-loading">
            {/* Loading effect copied from antd Table Component */}
            {
              loading ? (
                <div>
                  <div className="ant-spin ant-spin-spinning ant-table-without-pagination ant-table-spin-holder">
                    <span className="ant-spin-dot"><i></i><i></i><i></i><i></i></span>
                  </div>
                </div>
              ) : null
            }

            <div className={loading ? 'ant-spin-blur ant-spin-container' : 'ant-spin-container'}>
              {
                _.range(rows).map(row =>
                  <Row gutter={24} key={row} style={rowStyle} type="flex" align="stretch">
                    {
                      _.range(getRowCols(row)).map(col => {
                        if (row == 0 && col == 0) {
                          return <Col span={24/cols} key={col}><AddCard /></Col>
                        } else {
                          let index = cols * row + col - 1 // -1 减去 AddCard
                          let record = list[index]
                          return record ? <Col span={24/cols} key={col}><DataroomCard record={record} /></Col> : null
                        }
                      })
                    }
                  </Row>
                )
              }
            </div>
          </div>

          <Pagination
            className="ant-table-pagination"
            total={total}
            current={page}
            pageSize={pageSize}
            onChange={this.handlePageChange}
            showQuickJumper
          />
        </div>
      </LeftRightLayout>
    )
  }

}

export default connect()(DataRoomList)
