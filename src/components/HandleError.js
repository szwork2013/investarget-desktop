import React from 'react'
import { message, Modal } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { i18n } from '../utils/util'

class HandleError extends React.Component {

  static handleSessionExpiration = false

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error) {
      this.determineError(this.props.error)
      this.props.dispatch({ type: 'app/dismissError' })
    }
  }

  determineError(error) {
    switch (error.name) {
      case 'Error':
        this.handleComError(error)
        break
      case 'FormError':
        this.handleFormError(error)
        break;
      case 'ApiError':
        this.handleApiError(error.code, error.message)
        break
      default:
        console.error(error)
        Modal.error({
          title: i18n('unknown_error'),
          content: i18n('contact_admin'),
        })
    }
  }

  handleComError(error) {
    console.error(error)
  }

  handleFormError(error) {
    Modal.error({
      title: error.message,
    })
  }

  handleApiError(code, msg) {
    const react = this
    switch (code) {
      case 3000:
        if (!HandleError.handleSessionExpiration) {
          HandleError.handleSessionExpiration = true
          Modal.error({
            title: i18n('message.session_expire'),
            onOk() {
              HandleError.handleSessionExpiration = false
              react.props.dispatch({
                type: 'currentUser/logout',
                payload: { redirect: react.props.pathname }
              })
            },
          })
        }
        break
      case 2010:
        Modal.error({
          title: i18n('message.operation_fail'),
          content: msg,
        })
        break
      case 2009:
        react.props.dispatch(routerRedux.replace('/403'))
        break
      case 20041:
        Modal.error({ title: i18n('message.mobile_exist') })
        break
      case 20042:
        Modal.error({ title: i18n('message.email_exist') })
        break
      case 2001:
        Modal.error({ title: i18n('message.wrong_password') })
        break
      case 2002:
        Modal.error({ title: i18n('message.mobile_not_exist')})
        break;
      case 1299:
        Modal.error({
          title: i18n('message.choose_company'),
          onOk() {
            react.props.dispatch(
             routerRedux.replace("/")
            )
          },
        })
        break
      case 4007:
        Modal.error({ title: i18n('error'), content: i18n('project.message.project_message_missing') })
        break
      default:
        message.error(`Api Error, code: ${code}, message: ${msg}`, 2)
    }
  }

  render() {
    return null
  }

}

function mapStateToProps(state) {
  const { error } = state.app
  return { error }
}

export default connect(mapStateToProps)(HandleError)
