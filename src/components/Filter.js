import React from 'react'
import { connect } from 'dva'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { i18n } from '../utils/util'

import { Row, Col, Button, Checkbox, Select, Radio } from 'antd'
const RadioGroup = Radio.Group

import TabCheckbox from './TabCheckbox'
import {
  RadioTrueOrFalse,
  RadioAudit,
  CheckboxTransactionPhase,
  CheckboxCurrencyType,
  CheckboxTag,
  CheckboxOrganizationType,
  CheckboxProjStatus,
  SelectOrganizatonArea,
  SelectTimelineStatus,
  SliderMoney,
  TabCheckboxIndustry,
  TabCheckboxCountry,
} from './ExtraInput'



function BasicContainer(props) {
  return (
    <Row gutter={16} style={{marginBottom: '16px'}}>
      <Col span={4} >{ props.label }</Col>
      <Col span={20} >{ props.children }</Col>
    </Row>
  )
}

function FilterOperation(props) {
  return (
    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
      <Button type="primary" icon="search" onClick={props.onSearch}><FormattedMessage id="filterr" /></Button>
      <Button style={{ marginLeft: 10 }} onClick={props.onReset}><FormattedMessage id="reset" /></Button>
    </div>
  )
}


function TransactionPhaseFilter(props) {
  return (
    <BasicContainer label={ i18n("filter.investment_rounds") }>
      <CheckboxTransactionPhase value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function TagFilter(props) {
  return (
    <BasicContainer label={i18n('filter.tag')}>
      <CheckboxTag value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function CurrencyFilter(props) {
  return (
    <BasicContainer label={i18n('filter.currency')}>
      <CheckboxCurrencyType value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function UserAuditFilter(props) {
  return (
    <BasicContainer label={ i18n('filter.audit_status') }>
      <RadioAudit value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function OrganizationAreaFilter(props) {
  return (
    <BasicContainer label={i18n('filter.area')}>
      <SelectOrganizatonArea style={{width: '400px'}} mode="multiple" allowClear optionFilterProp="children" tokenSeparators={[',']} value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function OverseaFilter(props) {
  return (
    <BasicContainer label={i18n('filter.invest_oversea')}>
      <RadioTrueOrFalse value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function IndustryFilter(props) {
  return (
    <BasicContainer label={i18n('filter.industry')}>
      <TabCheckboxIndustry value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function OrganizationTypeFilter(props) {
  return (
    <BasicContainer label={i18n('filter.org_type')}>
      <CheckboxOrganizationType value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function CountryFilter(props) {
  return (
    <BasicContainer label="地区">
      <TabCheckboxCountry value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function RevenueFilter(props) {
  const value = props.value.map(item => parseInt(item / 1000000))
  const onChange = (value) => { props.onChange(value.map(item => item * 1000000)) }
  return (
    <BasicContainer label="收入">
      <SliderMoney min={0} max={500} value={value} onChange={onChange} />
    </BasicContainer>
  )
}

function ProfitFilter(props) {
  const value = props.value.map(item => parseInt(item / 1000000))
  const onChange = (value) => { props.onChange(value.map(item => item * 1000000)) }
  return (
    <BasicContainer label="利润">
      <SliderMoney min={-200} max={200} value={value} onChange={onChange} />
    </BasicContainer>
  )
}

function ProjectStatusFilter(props) {
  return (
    <BasicContainer label="状态">
      <CheckboxProjStatus value={props.value} onChange={props.onChange} />
    </BasicContainer>
  )
}

function TimelineStatusFilter(props) {

  var value
  if (props.value == null) {
    value = '0'
  } else if (props.value == false) {
    value = '1'
  } else {
    value = '2'
  }

  const onChange = (value) => {
    if (value == '0') {
      value = null
    } else if (value == '1') {
      value = false
    } else {
      value = true
    }
    props.onChange(value)
  }

  const Option = Select.Option
  return (
    <BasicContainer label="状态">
      <Select value={value} onChange={onChange}>
        <Option value="0">全部</Option>
        <Option value="1">未结束</Option>
        <Option value="2">已结束</Option>
      </Select>
    </BasicContainer>
  )
}

function TimelineFilter(props) {
  function handleChange(key, value) {
    props.onChange({ ...props.value, [key]: value })
  }
  return (
    <div>
      <TimelineStatusFilter value={props.value.isClose} onChange={handleChange.bind(this, 'isClose')} />
      <FilterOperation onSearch={props.onSearch} onReset={props.onReset} />
    </div>
  )
}



function UserListFilter(props) {
  return (
    <div>
      <TransactionPhaseFilter 
        value={props.value ? props.value.orgtransactionphases : null} 
        onChange={props.onChange.bind(this, 'orgtransactionphases')} />
      <TagFilter 
        value={props.value ? props.value.tags : null} 
        onChange={props.onChange.bind(this, 'tags')} />
      <CurrencyFilter 
        value={props.value ? props.value.currency : null} 
        onChange={props.onChange.bind(this, 'currency')} />
      <UserAuditFilter 
        value={props.value ? props.value.userstatus : null} 
        onChange={props.onChange.bind(this, 'userstatus')} />
      <OrganizationAreaFilter 
        value={props.value ? props.value.areas.map(item=>item.toString()) : []} 
        onChange={props.onChange.bind(this, 'areas')} />
      <FilterOperation 
        onSearch={props.onSearch} 
        onReset={props.onReset} />
    </div>
  )
}

function OrganizationListFilter(props) {
  function handleChange(key, value) {
    props.onChange({ ...props.value, [key]: value })
  }
  return (
    <div>
      <OverseaFilter value={props.value.isOversea} onChange={handleChange.bind(this, 'isOversea')} />
      <CurrencyFilter value={props.value.currencys} onChange={handleChange.bind(this, 'currencys')} />
      <TransactionPhaseFilter value={props.value.orgtransactionphases} onChange={handleChange.bind(this, 'orgtransactionphases')} />
      <IndustryFilter value={props.value.industries} onChange={handleChange.bind(this, 'industries')} />
      <TagFilter value={props.value.tags} onChange={handleChange.bind(this, 'tags')} />
      <OrganizationTypeFilter value={props.value.orgtypes} onChange={handleChange.bind(this, 'orgtypes')} />
      <FilterOperation onSearch={props.onSearch} onReset={props.onReset} />
    </div>
  )
}

function ProjectListFilter(props) {
  return (
    <div>
      <TagFilter value={props.value.tags} onChange={props.onChange.bind(this, 'tags')} />
      <CountryFilter value={props.value.country} onChange={props.onChange.bind(this, 'country')} />
      <IndustryFilter value={props.value.industries} onChange={props.onChange.bind(this, 'industries')} />
      <RevenueFilter
        value={[props.value.netIncome_USD_F, props.value.netIncome_USD_T]}
        onChange={props.onChange.bind(this, ['netIncome_USD_F', 'netIncome_USD_T'])} />
      <ProfitFilter
        value={[props.value.grossProfit_F, props.value.grossProfit_T]}
        onChange={props.onChange.bind(this, ['grossProfit_F', 'grossProfit_T'])} />
      <ProjectStatusFilter value={props.value.projstatus} onChange={props.onChange.bind(this, 'projstatus')} />
      <FilterOperation onSearch={props.onSearch} onReset={props.onReset} />
    </div>
  )
}




///// used in AddUser.js TODO:// refractor
function mapStateToPropsForAudit(state) {
  var { audit: auditOptions } = state.app
  auditOptions = auditOptions.map(item => ({ label: item.name, value: item.id }))
  return { auditOptions }
}

module.exports = {
  mapStateToPropsForAudit,

  UserListFilter,
  OrganizationListFilter,
  ProjectListFilter,
  TimelineFilter,
}
