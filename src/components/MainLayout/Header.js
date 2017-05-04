import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'

function Header({ dispatch, location }) {

  function handleMenuClicked(param) {

    switch (param.key) {
      case "/logout":
	dispatch({ type: 'currentUser/logout' })
	break
      case "lang":
	const url = location.basename === "/en" ? location.pathname : `/en${location.pathname}`
	window.location.href = url
	break
    }

  }

  return (
    <Menu
      selectedKeys={[location.pathname]}
      mode="horizontal"
      theme="dark"
      onClick={handleMenuClicked}>

      <Menu.Item key="/">
	<Link to="/"><Icon type="home" /><FormattedMessage id="header.home" /></Link>
      </Menu.Item>

      <Menu.Item key="/users">
	<Link to="/users"><Icon type="bars" />Users</Link>
      </Menu.Item>

      <Menu.Item key="/404">
	<Link to="/page-you-dont-know"><Icon type="frown-circle" />404</Link>
      </Menu.Item>

      <Menu.Item key="/products">
	<Link to="/products">Products</Link>
      </Menu.Item>

      <Menu.Item key="/logout"><FormattedMessage id="header.out" /></Menu.Item>

      <Menu.Item key="lang">{location.basename === "/en" ? "中文" : "EN"}</Menu.Item>

    </Menu>
  );
}

export default connect()(Header)
