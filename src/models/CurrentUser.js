import dva from 'dva'
import * as api from '../api'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'currentUser',
  state: null, 
  reducers: {
    save(state,  { userInfo } ) {
      return { ...state, ...userInfo }
    },
    delete() {
      return null
    },
  },
  effects: {
    *login({ payload: { username, password } }, { call, put }) {
      const { data } = yield call(api.login, { username, password })
      const { token, user_info } = data
      const userInfo = { ...user_info, token }
      localStorage.setItem('user_info', JSON.stringify(userInfo))
      yield put({
	type: 'save',
	userInfo
      })
      yield put(routerRedux.replace('/app'))
    },
    *logout({}, { call, put }) {
      localStorage.removeItem('user_info')
      yield put({ type: 'delete' })
      yield put(routerRedux.replace('/'))
    },
    *register({ payload: user }, { call, put }) {
      const { data } = yield call(api.register, user)
      yield put({
        type: 'login',
        payload: {
          username: user.email,
          password: user.password
        }
      })
    },
  }
}

