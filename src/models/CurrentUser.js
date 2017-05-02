import dva from 'dva'
import * as accountService from '../services/account'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'currentUser',
  state: null, 
  reducers: {
    save(state,  { userInfo } ) {
      return { ...state, ...userInfo }
    },
  },
  effects: {
    *login({ payload: { username, password } }, { call, put }) {
      const { data } = yield call(accountService.login, { username, password })
      const { token, user_info } = data
      const userInfo = { ...user_info, token }
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      yield put({
	type: 'save',
	userInfo
      })
      yield put(routerRedux.push('/'))
    }
  }
}

