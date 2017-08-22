import React from 'react'
import MainLayout from '../components/MainLayout'
import { Radio, Button } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { i18n } from '../utils/util'

const RadioGroup = Radio.Group

const options = [
  { label: <img style={{ height: 24, verticalAlign: 'middle', background: '#10458F' }} src="/images/investarget.png" />, value: 1 },
  { label: <img style={{ height: 24, verticalAlign: 'middle' }} src="/images/autospace.png" />, value: 2 },
]
let source

function Home(props) {

  function onChange(e) {
    source = e.target.value
  }

  function onClick() {
    localStorage.setItem('source', source)
    props.dispatch(routerRedux.push('/login'))
  }

  return <MainLayout location={props.location}>
    <h1>{i18n('common.choose')}</h1>
    <RadioGroup onChange={onChange} options={options} />
    <div style={{ marginTop: 20 }}>
      <Button onClick={onClick} type="primary">{i18n('common.confirm')}</Button>
    </div>
  </MainLayout>
}

export default connect()(Home)
