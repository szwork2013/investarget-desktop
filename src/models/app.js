import * as api from '../api'
import { URI_6, URI_3, URI_10 } from '../constants'
import { i18n, checkPerm, isLogin } from '../utils/util'
import { routerRedux } from 'dva/router'

const resourceMap = {
  '/register': ['tag', 'country', 'title'],
  [URI_3]: ['currencyType', 'transactionPhases', 'industry', 'tag', 'orgtype'],
  [URI_6]: ['transactionPhases', 'tag', 'currencyType', 'orgarea'],
  '/app/organization/add': ['currencyType', 'orgtype', 'industry', 'transactionPhases'],
  '/app/user/add': ['title', 'tag', 'country'],
  [URI_10]: ['tag', 'title'],
}

export default {
  namespace: 'app',
  state: {
    collapsed: false,
    selectedKeys: [],
    openKeys: [],
    registerStep: 1,
    tag: [],
    continent: [],
    country: [],
    title: [],
    currencyType: [],
    audit: [{id: 1, name: i18n('common.under_approval')}, {id: 2, name: i18n('common.recevied_approval')}, {id: 3, name: i18n('common.reject_approval')}],
    industry: [],
    transactionPhases:  [],
    transactionType: [],
    transactionStatus: [],
    orgarea: [],
    orgtype: [],
    character: [],
    showChat: false,
    projstatus: [],
    error: null,
    service: [],
    unreadMessageNum: 0,
    libIndustry: [],
  },
  reducers: {
    menuOpen(state, { payload: openKeys }) {
      return { ...state, openKeys }
    },
    menuSelect(state, { payload: selectedKeys }) {
      return { ...state, selectedKeys }
    },
    saveSource(state, { payload: { sourceType, data } }) {
      return { ...state, [sourceType]: data }
    },
    saveLibIndustry(state, { payload: data }) {
      return { ...state, libIndustry: data }
    },
    setRegisterStep(state, { payload: registerStep }) {
      return { ...state, registerStep }
    },
    toggleMenu(state, { payload: collapsed }) {
      return { ...state, collapsed }
    },
    toggleChat(state, { payload: showChat }) {
      return { ...state, showChat }
    },
    findError(state, { payload: error }) {
      return { ...state, error }
    },
    dismissError(state) {
      const error = null
      return { ...state, error }
    },
    setUnreadMessageNum(state, { payload: unreadMessageNum }) {
      return { ...state, unreadMessageNum }
    },
  },
  effects: {
    *registerStepForward({}, { call, put, select }) {
      const { registerStep: step } = yield select(state => state.app)
      if (step == 1) {
        yield put({ type: 'recommendFriends/refreshFriends' })
      } else if (step == 2) {
        yield put({ type: 'recommendProjects/refreshProjects' })
      }
      yield put({ type: 'setRegisterStep', payload: step + 1 })
    },
    *requestSource({ payload: sourceType }, { call, put }) {
      const { data } = yield call(api.getSource, sourceType)
      yield put({ type: 'saveSource', payload: { sourceType, data } })
    },
    *getSource({ payload: sourceType }, { put, select }) {
      const data = yield select(state => state.app[sourceType])
      data.length > 0 || (yield put({ type: 'requestSource', payload: sourceType }))
    },
    *getSourceList({ payload: sourceTypeList }, { put }) {
      for (var i=0,len=sourceTypeList.length; i<len; i++) {
        let sourceType = sourceTypeList[i]
        yield put({ type: 'getSource', payload: sourceType })
      }
    },
    *requestLibIndustry({}, { call, put }) {
      const { data } = yield call(api.getLibIndustry)
      yield put({ type: 'saveLibIndustry', payload: data.data })
    },
    *getLibIndustry({}, { select, put }) {
      const data = yield select(state => state.app.libIndustry)
      data.length > 0 || (yield put({ type: 'requestLibIndustry' }))
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        // TODO 路径不在 menu 中时，selectedKeys 为 []
        const selectedKeys = [pathname]
        dispatch({
          type: 'menuSelect',
          payload: selectedKeys
        })
        // TODO 设置 selectedKeys 的同时设置 openKeys

        let resourceList = resourceMap[pathname]
        if (resourceList && resourceList.length > 0) {
          dispatch({ type: 'getSourceList', payload: resourceList })
        }

        if (pathname === '/app/user/add' && !checkPerm('usersys.admin_adduser') && !checkPerm('usersys.user_adduser')) {
          history.replace('/app')
        }

        if (pathname === '/app' && !isLogin()) {
          history.replace('/')
        }

      })
    }
  },
}
