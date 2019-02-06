// @flow
import { takeEvery, all } from 'redux-saga/effects'
import type { RemoteDataT, StateT, ActionT } from '../types'
import remoteDataReducer from './remoteDataReducer'

export type RemoteReduxActionsT = {
  [key: string]: (data?: {}) => mixed,
}

type RemoteReduxDataT = {
  prefix: string,
  actions: Array<string>,
  registerSagas?: RemoteReduxActionsT => Array<{
    action: string,
    takeHelper?: (
      pattern: string | Array<string> | Function,
      saga: Function,
      ...args: Array<any>
    ) => mixed,
    saga: any,
  }>,
  customReducer?: (state: StateT, action: ActionT) => StateT,
}

type RemoteReduxReturnT = {
  constants: { [key: string]: string },
  actions: { [key: string]: (data?: {}) => mixed },
  reducer: (state: StateT, action: ActionT) => StateT,
  sagas: () => Generator<*, *, *>,
}

const remoteReduxState = (data: RemoteReduxDataT): RemoteReduxReturnT => {
  // create constants
  const constants = {
    INIT: `${data.prefix}/INIT`,
    PENDING: `${data.prefix}/PENDING`,
    SUCCESS: `${data.prefix}/SUCCESS`,
    FAILURE: `${data.prefix}/FAILURE`,
  }

  // create deafult actions
  let defaultActions = {
    init: (obj?: {}) => ({ type: constants.INIT }),
    pending: (obj?: {}) => ({ type: constants.PENDING }),
    success: (obj?: {}) => ({ type: constants.SUCCESS, payload: obj }),
    error: (obj?: {}) => ({ type: constants.FAILURE, payload: obj }),
  }
  // create custom actions
  const customActions = data.actions.reduce((actions, actionLabel) => {
    return {
      ...actions,
      [actionLabel]: (remoteData?: {}) => ({
        type: `${data.prefix}/${actionLabel.toUpperCase()}`,
        ...(remoteData ? { payload: remoteData } : {}),
      }),
    }
  }, {})
  // aggregate both default and custom actions
  const actions = {
    ...defaultActions,
    ...customActions,
  }

  // create reducer
  const reducer = remoteDataReducer(data.prefix, data.customReducer)

  // create sagas
  const mySagas = data.registerSagas ? data.registerSagas(actions) : []
  const sagas = function* sagas(): Generator<*, *, *> {
    const _sagas = mySagas.reduce((allSagas, value) => {
      const tempSagas = allSagas || []
      if (data.actions.includes(value.action)) {
        const takeHelper = value.takeHelper || takeEvery
        tempSagas.push(
          takeHelper(
            `${data.prefix}/${value.action.toUpperCase()}`,
            value.saga,
          ),
        )
      }
      return tempSagas
    }, [])

    yield all(_sagas)
  }

  return { actions, reducer, sagas, constants }
}

export default remoteReduxState
