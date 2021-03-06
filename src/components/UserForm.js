import React from 'react'
import PropTypes from 'prop-types'
import { i18n, hasPerm, intersection } from '../utils/util'
import * as api from '../api'
import { Link } from 'dva/router'

import { Form, Input, Row, Col, Button } from 'antd'
const FormItem = Form.Item
import {
  BasicFormItem,
} from '../components/Form'

import {
  SelectTag,
  SelectTitle,
  SelectYear,
  CascaderCountry,
  SelectExistOrganization,
  SelectOrganizatonArea,
  SelectUserGroup,
  RadioAudit,
  SelectUser,
} from '../components/ExtraInput'
import { Role, Mobile } from './Form'
import { UploadImage } from './Upload'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

// 其他字段
// gender, description, remark, school, specialty,



class UserForm extends React.Component {

  constructor(props) {
    super(props)

    const { getFieldDecorator } = this.props.form
    getFieldDecorator('cardBucket', {
      rules: [{required: true}], initialValue: 'image'
    })

    this.state = {
      investorGroup: [], // 投资人所在的用户组
    }
    this.isEditUser = false
    let perm
    switch (props.type) {
      case 'edit':
        perm = 'usersys.admin_changeuser'
        this.isEditUser = true
        break
      case 'add':
        perm = 'usersys.admin_adduser'
        break
    }
    this.hasPerm = hasPerm(perm)
  }

  componentDidMount() {
    api.queryUserGroup({ type: 'investor', page_size: 100 })
    .then(data => this.setState({ investorGroup: data.data.data.map(m => m.id) }))
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const targetUserIsInvestor = getFieldValue('groups') && intersection(getFieldValue('groups'), this.state.investorGroup).length > 0
    const userIsApproved = getFieldValue('userstatus') === 2

    return (
      <Form>

         { this.hasPerm || !this.isEditUser ?
        <BasicFormItem label={i18n('user.group')} name="groups" valueType="array" required>
          <SelectUserGroup type={this.hasPerm ? null : 'investor'} />
        </BasicFormItem>
        : null } 

        <FormItem {...formItemLayout} label={i18n("user.mobile")} required>
          <Row gutter={8}>
            <Col span={6}>
              <FormItem required>
                {
                  getFieldDecorator('mobileAreaCode', {
                    rules: [{ message: i18n('validation.not_empty'), required: true}], initialValue: '86'
                  })(
                    <Input prefix="+" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem required>
                {
                  getFieldDecorator('mobile', {
                    rules: [{ message: i18n('validation.not_empty'), required: true}]
                  })(
                    <Input onBlur={this.props.mobileOnBlur} />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </FormItem>

        <BasicFormItem label={i18n("user.email")} name="email" valueType="email" required><Input onBlur={this.props.emailOnBlur} /></BasicFormItem>

        <BasicFormItem label={i18n('user.cn_name')} name="usernameC" required><Input /></BasicFormItem>

        <BasicFormItem label={i18n('user.en_name')} name="usernameE" required><Input /></BasicFormItem>

        <BasicFormItem label={i18n("user.wechat")} name="wechat"><Input /></BasicFormItem>

        <BasicFormItem label={i18n("user.position")} name="title" valueType="number" required>
          <SelectTitle />
        </BasicFormItem>

        <BasicFormItem label={i18n("user.institution")} name="org" valueType="number">
          {/*<div style={{display: 'flex', alignItems: 'center'}}>*/}
            <SelectExistOrganization size="large" />
            {/*<Link to="/app/organization/add" target="_blank"><Button size="large" style={{marginLeft: '8px'}}>新增</Button></Link>*/}
          {/*</div>*/}
        </BasicFormItem>

        <BasicFormItem label={i18n("user.department")} name="department"><Input /></BasicFormItem>

        <BasicFormItem label={i18n('user.area')} valueType="number" name="orgarea">
          <SelectOrganizatonArea />
        </BasicFormItem>

        <BasicFormItem label={i18n("user.country")} name="country" valueType="number">
          <CascaderCountry />
        </BasicFormItem>

        <BasicFormItem label={i18n("user.tags")} name="tags" valueType="array">
          <SelectTag mode="multiple" />
        </BasicFormItem>

        <BasicFormItem label={i18n('user.target_demand')} name="targetdemand"><Input.TextArea rows={4} /></BasicFormItem>
        <BasicFormItem label={i18n('user.merges')} name="mergedynamic"><Input.TextArea rows={4} /></BasicFormItem>
        <BasicFormItem label={i18n('user.industry_fund')} name="ishasfundorplan"><Input.TextArea rows={4} /></BasicFormItem>

        {
          this.hasPerm ? (
            <BasicFormItem label={i18n("user.status")} name="userstatus" valueType="number" initialValue={2}>
              <RadioAudit />
            </BasicFormItem>
          ) : null
        }

        <div style={{ display: targetUserIsInvestor && userIsApproved && this.isEditUser && this.hasPerm ? 'block' : 'none' }}>
          <BasicFormItem label={i18n('user.major_trader')} name="major_trader">
            <SelectUser
            mode="single"
            allowClear={true}
            onChange={this.props.onMajorTraderChange}
            onSelect={this.props.onSelectMajorTrader}
            disabledOption={getFieldValue('minor_traders')} />
          </BasicFormItem>
        </div>

        <div style={{ display: targetUserIsInvestor && userIsApproved && this.isEditUser && this.hasPerm ? 'block' : 'none' }}>
          <BasicFormItem label={i18n('user.minor_traders')} name="minor_traders" valueType="array">
            <SelectUser mode="multiple"
              onSelect={this.props.onSelectMinorTrader}
              onDeselect={this.props.onDeselectMinorTrader}
              disabled={!getFieldValue('major_trader')}
              disabledOption={getFieldValue('major_trader')} />
          </BasicFormItem>
        </div>

        <BasicFormItem label={i18n('user.card')} name="cardKey">
          <UploadImage />
        </BasicFormItem>

      </Form>
    )
  }
}


export default UserForm
