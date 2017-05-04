import React from 'react';
import { connect } from 'dva';
import styles from './InvestorList.css';
import { Checkbox, Radio, Select, Button, Input, Row, Col } from 'antd'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option

import { injectIntl, intlShape, FormattedMessage } from 'react-intl'


function InvestorList({ intl, dispatch, transactionPhases, transactionPhaseOptions, tags, tagOptions, currencies, audit, areas, areaOptions, name, phone, email, organization, transaction, searchType, loading }) {
  const currencyOptions = [
    { label: intl.formatMessage({ id: 'user.dollar' }), value: 0 },
    { label: intl.formatMessage({ id: 'user.rmb' }), value: 1 },
    { label: intl.formatMessage({ id: 'user.dollar_rmb' }), value: 2 },
  ]
  const auditOptions = [
    { label: intl.formatMessage({ id: 'user.under_approval' }), value: 0 },
    { label: intl.formatMessage({ id: 'user.recevied_approval' }), value: 1 },
    { label: intl.formatMessage({ id: 'user.reject_approval' }), value: 2 },
  ]

  function transactonPhaseHandler(transactionPhases) {
    dispatch({
      type: 'investorList/transactionPhase',
      payload: transactionPhases
    })
  }

  function tagHandler(tags) {
    dispatch({
      type: 'investorList/tag',
      payload: tags
    })
  }

  function currencyHandler(currencies) {
    dispatch({
      type: 'investorList/currency',
      payload: currencies
    })
  }

  function auditHandler(e) {
    const audit = e.target.value
    dispatch({
      type: 'investorList/audit',
      payload: audit
    })
  }

  function areaHandler(areas) {
    areas = areas.map(item => parseInt(item, 10))
    dispatch({
      type: 'investorList/area',
      payload: areas
    })
  }

  function filterHandler() {
    dispatch({
      type: 'investorList/filter'
    })
  }

  function resetHandler() {
    dispatch({
      type: 'investorList/resetFilter'
    })
  }

  function searchTypeHandler(searchType) {
    dispatch({
      type: 'investorList/searchType',
      payload: searchType
    })
    dispatch({
      type: 'investorList/clearSearch'
    })
  }

  function nameHandler(e) {
    const name = e.target.value
    dispatch({
      type: 'investorList/name',
      payload: name
    })
  }

  function emailHandler(e) {
    const email = e.target.value
    dispatch({
      type: 'investorList/email',
      payload: email
    })
  }

  function phoneHandler(e) {
    const phone = e.target.value
    dispatch({
      type: 'investorList/phone',
      payload: phone
    })
  }

  function orgnizationHandler(e) {
    const orgnization = e.target.value
    dispatch({
      type: 'investorList/orgnization',
      payload: orgnization
    })
  }

  function transactionHandler(e) {
    const transaction = e.target.value
    dispatch({
      type: 'investorList/transaction',
      payload: transaction
    })
  }

  function searchHandler(e) {
    dispatch({
      type: 'investorList/search'
    })
  }

  return (
    <div className={styles.normal}>
      <Row gutter={16} style={{marginBottom: '16px'}}>
        <Col span={4} >
          <FormattedMessage id="user.investment_rounds" />
        </Col>
        <Col span={20} >
          <CheckboxGroup options={transactionPhaseOptions} value={transactionPhases} onChange={transactonPhaseHandler} />
        </Col>
      </Row>
      <Row gutter={16} style={{marginBottom: '16px'}}>
        <Col span={4} >
          <FormattedMessage id="user.tag" />
        </Col>
        <Col span={20} >
          <CheckboxGroup options={tagOptions} value={tags} onChange={tagHandler} />
        </Col>
      </Row>
      <Row gutter={16} style={{marginBottom: '16px'}}>
        <Col span={4} >
          <FormattedMessage id="user.currency" />
        </Col>
        <Col span={20} >
          <CheckboxGroup options={currencyOptions} value={currencies} onChange={currencyHandler} />
        </Col>
      </Row>
      <Row gutter={16} style={{marginBottom: '16px'}}>
        <Col span={4} >
          <FormattedMessage id="user.audit_status" />
        </Col>
        <Col span={20} >
          <RadioGroup options={auditOptions} value={audit} onChange={auditHandler} />
        </Col>
      </Row>
      <Row gutter={16} style={{marginBottom: '16px'}}>
        <Col span={4} >
          <FormattedMessage id="user.area" />
        </Col>
        <Col span={20} >
          <Select
            style={{ width: '100%' }}
            mode = "multiple"
            allowClear
            optionFilterProp="children"
            onChange={areaHandler}
            value = {areas.map(item=>item.toString())}
            tokenSeparators={[',']}
          >
            { areaOptions.map(item => (
              <Option key={item.value.toString()} value={item.value.toString()}>{ item.label }</Option>
            )) }
          </Select>
        </Col>
      </Row>

      <div style={{marginBottom: '16px'}}>
        <Button type="primary" icon="search" onClick={filterHandler}><FormattedMessage id="common.filter" /></Button>
        <Button onClick={resetHandler}><FormattedMessage id="common.reset" /></Button>
      </div>

      <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}} >
        <Select style={{width: '160px'}} defaultValue="name" onChange={searchTypeHandler} >
          <Option value="name"><FormattedMessage id="user.name" /></Option>
          <Option value="phone"><FormattedMessage id="user.phone" /></Option>
          <Option value="email"><FormattedMessage id="user.email" /></Option>
          <Option value="organization"><FormattedMessage id="user.organization" /></Option>
          <Option value="transaction"><FormattedMessage id="user.transaction" /></Option>
        </Select>
        { searchType == 'name' ? <Input style={{width: '160px'}} value={name} onChange={nameHandler} /> : null }
        { searchType == 'phone' ? <Input style={{width: '160px'}} value={phone} onChange={phoneHandler} /> : null }
        { searchType == 'email' ? <Input style={{width: '160px'}} value={email} onChange={emailHandler} /> : null }
        { searchType == 'organization' ? <Input style={{width: '160px'}} value={organization} onChange={orgnizationHandler} /> : null }
        { searchType == 'transaction' ? <Input style={{width: '160px'}} value={transaction} onChange={transactionHandler} /> : null }
        <Button type="primary" icon="search" onClick={searchHandler}></Button>
      </div>

    </div>
  );
}

function mapStateToProps(state) {
  const { transactionPhases, tags, currencies, audit, areas, searchType, name, phone, email, organization, transaction } = state.investorList
  var { transactionPhases: transactionPhaseOptions, tags: tagOptions, areas: areaOptions } = state.app
  transactionPhaseOptions = transactionPhaseOptions.map(item => ({ label: item.name, value: item.id }))
  tagOptions = tagOptions.map(item => ({ label: item.tagName, value: item.id }))
  areaOptions = areaOptions.map(item => ({ label: item.areaName, value: item.id }))
  return {
    transactionPhaseOptions,
    transactionPhases,
    tagOptions,
    tags,
    currencies,
    audit,
    areaOptions,
    areas,
    name, phone, email, organization, transaction,
    searchType,
    loading: state.loading.effects['investorList/fetch'],
  }
}

export default connect(mapStateToProps)(injectIntl(InvestorList));