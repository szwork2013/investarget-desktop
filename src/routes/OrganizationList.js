import React from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Icon, Table, Button, Pagination, Popconfirm } from 'antd'
import MainLayout from '../components/MainLayout'
import { OrganizationListFilter, Filter, FilterItem } from '../components/Filter'
import { OrganizationListSearch } from '../components/Search'
import { i18n } from '../utils/util'
import {
  RadioTrueOrFalse,
  CheckboxCurrencyType,
} from '../components/ExtraInput'
import PageTitle from '../components/PageTitle'


const columns = [
  { title: '名称', key: 'orgname', dataIndex: 'orgname' },
  { title: '行业', key: 'industry', dataIndex: 'industry.industry' },
  { title: '货币类型', key: 'currency', dataIndex: 'currency.currency' },
  { title: '决策周期（天）', key: 'decisionCycle', dataIndex: 'decisionCycle' },
  { title: '轮次', key: 'orgtransactionphase', dataIndex: 'orgtransactionphase', render: (text, record) => {
    let phases = record.orgtransactionphase || []
    return phases.map(p => p.name).join(' ')
  } },
  { title: '股票代码', key: 'orgcode', dataIndex: 'orgcode' },
  { title: '操作', key: 'action', render: (text, record) => (
      <span>
        <Button disabled={!record.action.get} size="small" >{i18n("view")}</Button>&nbsp;
        <Link to={'/app/organization/edit/' + record.id}>
          <Button disabled={!record.action.change} size="small" >{i18n("edit")}</Button>&nbsp;
        </Link>
        <Popconfirm title="Confirm to delete?">
          <Button type="danger" disabled={!record.action.delete} size="small">{i18n("delete")}</Button>
        </Popconfirm>
      </span>
    )
  },
]

const searchOptions = [
  { value: 'name', label: i18n('organization.name') },
  { value: 'stockCode', label: i18n('organization.stock_code') },
]



function OrganizationList(props) {

  const { location, dispatch, intl, total, list, loading, page_index, page_size, filter, search } = props
  const { formatMessage } = intl


  function handleFilterChange(key, value) {
    dispatch({ type: 'organizationList/setFilter', payload: { [key]: value } })
  }

  function handleFilt() {
    dispatch({ type: 'organizationList/filt' })
  }

  function handleReset() {
    dispatch({ type: 'organizationList/reset' })
  }

  function handleSearchChange(key, value) {
    dispatch({ type: 'organizationList/setSearch', payload: { [key]: value } })
  }

  function handleSearch() {
    dispatch({ type: 'organizationList/search' })
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'organizationList/changePage', payload: page })
  }

  function handleShowSizeChange(current, pageSize) {
    dispatch({ type: 'organizationList/changePageSize', payload: pageSize })
  }

  return (
    <MainLayout location={location}>
      <div>
        <PageTitle title={i18n('organization.org_list')} actionLink="/app/organization/add" actionTitle={i18n('organization.new_org')} />

        <OrganizationListFilter value={filter} onChange={handleFilterChange} onSearch={handleFilt} onReset={handleReset} />

        <div style={{marginBottom: '16px'}}>
          <OrganizationListSearch value={search} onChange={handleSearchChange} onSearch={handleSearch} />
        </div>

        <Table
          columns={columns}
          dataSource={list}
          rowKey={record=>record.id}
          loading={loading}
          pagination={false} />

        <Pagination
          className="ant-table-pagination"
          total={total}
          current={page_index}
          pageSize={page_size}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handleShowSizeChange}
          showQuickJumper
        />
      </div>
    </MainLayout>
  )

}


function mapStateToProps(state) {
  return { ...state.organizationList, loading: state.loading.effects['organizationList/get'] }
}

OrganizationList.propTypes = {
  intl: intlShape.isRequired
}

export default connect(mapStateToProps)(injectIntl(OrganizationList))
