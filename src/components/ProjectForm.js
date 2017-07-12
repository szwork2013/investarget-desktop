import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { i18n, exchange } from '../utils/util'
import * as api from '../api'
import styles from './ProjectForm.css'

import { Collapse, Form, Row, Col, Button, Icon, Input, Switch, Radio, Select, Cascader, InputNumber, Checkbox } from 'antd'
const FormItem = Form.Item
const Panel = Collapse.Panel
const RadioGroup = Radio.Group
const InputGroup = Input.Group

import {
  BasicFormItem,
  CurrencyFormItem,
  IndustryDynamicFormItem,
} from '../components/Form'

import {
  SelectTag,
  SelectRole,
  SelectYear,
  SelectTransactionType,
  SelectCurrencyType,
  CascaderCountry,
  CascaderIndustry,
  InputCurrency,
  InputPhoneNumber,
  RadioTrueOrFalse,
} from '../components/ExtraInput'


class ProjectBaseForm extends React.Component {

  static childContextTypes = {
    form: PropTypes.object
  }

  getChildContext() {
    return { form: this.props.form }
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Form>
        <BasicFormItem label="是否隐藏" name="isHidden" valueType="boolean">
          <RadioTrueOrFalse />
        </BasicFormItem>

        <BasicFormItem label="项目中文名" name="projtitleC" required whitespace>
          <Input />
        </BasicFormItem>

        <BasicFormItem label="项目英文名" name="projtitleE" required whitespace>
          <Input />
        </BasicFormItem>

        <BasicFormItem label="热门标签" name="tags" valueType="array" required>
          <SelectTag mode="multiple" />
        </BasicFormItem>

        <IndustryDynamicFormItem />

        <BasicFormItem label="国家" name="country" required valueType="number" initialValue={[1,5]}>
          <CascaderCountry size="large" />
        </BasicFormItem>

        <BasicFormItem label="我的角色" name="character" required valueType="number">
          <SelectRole />
        </BasicFormItem>

        <BasicFormItem label="交易类型" name="transactionType" required valueType="array">
          <SelectTransactionType mode="multiple" />
        </BasicFormItem>
      </Form>
    )
  }
}

class ProjectFinanceForm extends React.Component {

  static childContextTypes = {
    form: PropTypes.object
  }

  getChildContext() {
    return { form: this.props.form }
  }

  constructor(props) {
    super(props)
  }

  // 处理货币相关表单联动
  handleCurrencyTypeChange = (currency) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    const currencyMap = {'1': 'CNY','2': 'USD','3': 'CNY'}
    exchange(currencyMap[Number(currency)]).then((rate) => {
      console.log(rate)
      const fields = ['financeAmount', 'companyValuation']
      getFieldValue('financeKeys').forEach(key => {
        fields.push(`finance-${key}.revenue`)
        fields.push(`finance-${key}.netIncome`)
      })
      const values = {}
      fields.forEach(field => {
        let value = getFieldValue(field)
        values[field + '_USD'] = value == undefined ? value : Math.round(value * rate)
      })
      setFieldsValue(values)
    })
  }

  render() {
    const { getFieldValue } = this.props.form
    return (
      <Form>
        <BasicFormItem label="公司成立年份" name="companyYear" valueType="number">
          <SelectYear />
        </BasicFormItem>

        <BasicFormItem label="货币类型" name="currency" required valueType="number" onChange={this.handleCurrencyTypeChange}>
          <SelectCurrencyType />
        </BasicFormItem>

        <CurrencyFormItem label="拟交易规模" name="financeAmount" required currencyType={getFieldValue('currency')} />

        <CurrencyFormItem label="公司估值" name="companyValuation" currencyType={getFieldValue('currency')} />

        <BasicFormItem label="公开财务信息" name="financeIsPublic" valueType="boolean" valuePropName="checked">
          <Switch checkedChildren={'ON'} unCheckedChildren={'OFF'} />
        </BasicFormItem>


      </Form>
    )
  }
}


class ProjectConnectForm extends React.Component {

  static childContextTypes = {
    form: PropTypes.object
  }

  getChildContext() {
    return { form: this.props.form }
  }

  constructor(props) {
    super(props)
    // currentUserId
    const userInfo = localStorage.getItem('user_info')
    const currentUserId = userInfo ? JSON.parse(userInfo).id : null
    const { getFieldDecorator } = this.props.form
    getFieldDecorator('supportUser', {
      rules: [{required: true, type: 'number'}],
      initialValue: currentUserId,
    })
  }

  phoneNumberValidator = (rule, value, callback) => {
    console.log(rule, value, callback)
    const isPhoneNumber = /([0-9]+)-([0-9]+)/
    if (isPhoneNumber.test(value)) {
      callback()
    } else {
      callback('Please input correct phone number')
    }
  }

  render() {
    return (
      <Form>
        <BasicFormItem label="联系人" name="contactPerson" required whitespace><Input /></BasicFormItem>

        <BasicFormItem label="联系号码" name="phoneNumber" required validator={this.phoneNumberValidator}><InputPhoneNumber /></BasicFormItem>

        <BasicFormItem label="邮箱" name="email" required valueType="email">
          <Input type="email" />
        </BasicFormItem>

        {/*<BasicFormItem label="上传者" name="supportUser" required initialValue={currentUserId}>
          <Select />
        </BasicFormItem>*/}
      </Form>
    )
  }
}


class ProjectDetailForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Form>
        <BasicFormItem label="公司简介" name="p_introducteC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Company Introduction" name="p_introducteE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="目标市场" name="targetMarketC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="TargetMarket" name="targetMarketE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="核心产品" name="productTechnologyC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Core Product" name="productTechnologyE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="商业模式" name="businessModelC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Business Model" name="businessModelE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="品牌渠道" name="brandChannelC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Brand Channel" name="brandChannelE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="管理团队" name="managementTeamC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Management Team" name="managementTeamE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="商业伙伴" name="BusinesspartnersC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Business Partner" name="BusinesspartnersE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="资金用途" name="useOfProceedC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Use of Proceeds" name="useOfProceedE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="融资历史" name="financingHistoryC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Financing History" name="financingHistoryE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="经营数据" name="operationalDataC">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
        <BasicFormItem label="Operational Data" name="operationalDataE">
          <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
        </BasicFormItem>
      </Form>
    )
  }
}


export {
  ProjectBaseForm,
  ProjectFinanceForm,
  ProjectDetailForm,
  ProjectConnectForm,
}