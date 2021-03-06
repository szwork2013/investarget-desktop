import React from 'react'
import { Calendar, Modal, DatePicker, TimePicker, Select, Input, Checkbox, Form, Row, Col, Button, Popconfirm } from 'antd'
import LeftRightLayout from '../components/LeftRightLayout'

import { handleError, time, i18n, getCurrentUser } from '../utils/util'
import * as api from '../api'
import styles from './Schedule.css'
const Option = Select.Option
import { SelectNumber } from '../components/ExtraInput'
import moment from 'moment'

import ScheduleForm from '../components/ScheduleForm'

function mapPropsToFields(props) {
  return props.data
}
const AddScheduleForm = Form.create()(ScheduleForm)
const EditScheduleForm = Form.create({ mapPropsToFields })(ScheduleForm)

const eventTitleStyle = {
  float: 'right',
  fontSize: '12px',
  fontWeight: 'normal',
  marginLeft: 8,
}


class Schedule extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      list: [],
      event: {},
      visibleAdd: false,
      visibleEvent: false,
      visibleEdit: false,
      selectedDate: null,
      mode: 'month',
    }
  }

  getListData = (value) => {
    const date = value.format('YYYY-MM-DD')
    return this.state.list.filter(item => {
      return item.scheduledtime.slice(0,10) == date
    })
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li className={styles['event']} key={item.id} onClick={this.handleClickEvent.bind(this, item.id)}>
              {item.comments}
            </li>
          ))
        }
      </ul>
    );
  }

  handleClickEvent = (id, e) => {
    e.stopPropagation()
    const event = this.state.list.filter(item => item.id == id)[0] || {}
    this.setState({visibleEvent:true, event })
    this.eventEl = e.target
    this.eventEl.classList.add('event-selected')
  }

  getMonthData = (value) => {
    //
  }

  monthCellRender = (value) => {
    //
  }

  onPanelChange = (date, mode) => {
    this.setState({ mode })
  }

  onSelect = (date, dateString) => {
    if (this.state.mode == 'month') {
      this.setState({ visibleAdd: true, selectedDate: date })
    }
  }

  getEvents = () => {
    api.getSchedule({ createuser: getCurrentUser() }).then(result => {
      var { count: total, data: list } = result.data
      list.sort((a, b) => {
        return new Date(a.scheduledtime) - new Date(b.scheduledtime)
      })
      this.setState({ total, list })
    }).catch(error => {
      handleError(error)
    })
  }

  addEvent = () => {
    this.addForm.validateFields((err, values) => {
      if (!err) {
        let param = toData(values)
        api.addSchedule(param).then(result => {
          this.hideAddModal()
          this.getEvents()
        }).catch(error => {
          this.hideEditModal()
          handleError(error)
        })
      }
    })
  }

  editEvent = () => {
    this.editForm.validateFields((err, values) => {
      if (!err) {
        let param = toData(values)
        let id = this.state.event.id
        api.editSchedule(id, param).then(result => {
          this.hideEditModal()
          this.getEvents()
        }).catch(error => {
          this.hideEditModal()
          handleError(error)
        })
      }
    })
  }

  deleteEvent = () => {
    let id = this.state.event.id
    api.deleteSchedule(id).then(result => {
      this.hideEventModal()
      this.getEvents()
    }).catch(error => {
      this.hideEventModal()
      handleError(error)
    })
  }

  hideAddModal = () => {
    this.setState({ visibleAdd: false })
  }

  hideEventModal = () => {
    this.setState({ visibleEvent: false, event: {} })
    this.eventEl.classList.remove('event-selected')
  }

  showEditModal = () => {
    this.setState({ visibleEvent: false })
    this.eventEl.classList.remove('event-selected')
    this.setState({ visibleEdit: true })
  }

  hideEditModal = () => {
    this.setState({ visibleEdit: false, event: {} })
  }

  handleRef = (inst) => {
    if (inst) {
      this.addForm = inst.props.form
    }
  }

  handleRef2 = (inst) => {
    if (inst) {
      this.editForm = inst.props.form
    }
  }

  componentDidMount() {
    this.getEvents()
  }

  render() {
    const modalStyle = {
    }
    const maskStyle = {
      backgroundColor: 'rgba(0,0,0,.38)',
    }

    const { visibleAdd, visibleEdit, visibleEvent, selectedDate  } = this.state

    const eventTitle = (
      <div style={{marginRight:32}}>
        {i18n('schedule.event')}
        <Popconfirm title={i18n('delete_confirm')} onConfirm={this.deleteEvent}>
          <a href="javascript:void(0)" style={eventTitleStyle}>{i18n('common.delete')}</a>
        </Popconfirm>
        <a href="javascript:void(0)" style={eventTitleStyle} onClick={this.showEditModal}>{i18n('common.edit')}</a>
      </div>
    )

    return (

      <LeftRightLayout location={this.props.location} title={i18n('schedule.my_schedule')}>

        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onPanelChange={this.onPanelChange}
          onSelect={this.onSelect}
        />

        <Modal
          title={i18n('schedule.add_event')}
          visible={visibleAdd}
          onOk={this.addEvent}
          onCancel={this.hideAddModal}
          style={modalStyle}
          maskStyle={maskStyle}
        >
          { visibleAdd ? <AddScheduleForm wrappedComponentRef={this.handleRef} isAdd date={selectedDate} /> : null }
        </Modal>

        <Modal
          title={eventTitle}
          visible={visibleEvent}
          onCancel={this.hideEventModal}
          maskStyle={maskStyle}
          footer={null}
        >
          <Event {...this.state.event} />
        </Modal>

        <Modal
          title={i18n('schedule.edit_event')}
          visible={visibleEdit}
          onOk={this.editEvent}
          onCancel={this.hideEditModal}
          maskStyle={maskStyle}
        >
          <EditScheduleForm wrappedComponentRef={this.handleRef2} data={toFormData(this.state.event)} />
        </Modal>
      </LeftRightLayout>
    )
  }
}



export default Schedule


function toData(formData) {
  var data = {...formData}
  data['scheduledtime'] = data['scheduledtime'].format('YYYY-MM-DDTHH:mm:ss')
  return data
}

function toFormData(data) {
  var formData = {
    comments: data.comments,
    scheduledtime: data.scheduledtime && moment(data.scheduledtime),
    country: data.country && data.country.id,
    address: data.address,
    proj: data.proj,
    user: data.user && data.user.id,
  }
  for (let prop in formData) {
    formData[prop] = { value: formData[prop] }
  }
  return formData
}

function Event(props) {
  return (
    <div>
      <Field title={i18n('schedule.title')} content={props.comments} />
      <Field title={i18n('schedule.schedule_time')} content={props.scheduledtime ? time(props.scheduledtime + props.timezone) : ''} />
      <Field title={i18n('schedule.area')} content={props.country && props.country.country} />
      <Field title={i18n('schedule.address')} content={props.address} />
      <Field title={i18n('schedule.project')} content={props.projtitle} />
      <Field title={i18n('schedule.investor')} content={props.user && props.user.username} />
    </div>
  )
}


const rowStyle = {
  // borderBottom: '1px dashed #eee',
  padding: '8px 0',
  fontSize: '13px',
}
const leftStyle = {

}
const rightStyle = {
  overflow: 'hidden',
}

const Field = (props) => {
  return (
    <Row style={rowStyle} gutter={24}>
      <Col span={6} style={leftStyle}>
        <div style={{textAlign: 'right'}}>{props.title}</div>
      </Col>
      <Col span={18} style={rightStyle}>
        <div>{props.content}</div>
      </Col>
    </Row>
  )
}
