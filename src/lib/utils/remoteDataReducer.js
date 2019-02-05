// @flow
import type { RemoteDataT } from '../types'

type StateT = RemoteDataT<*, *>

type ActionT = { type: *, payload: * }

const initialState: StateT = { phase: 'NOT_ASKED' }

const remoteDataReducer = (
  prefix: string,
  enhancer?: (state: StateT, action: ActionT) => StateT,
) => {
  return (state: StateT = initialState, action: ActionT) => {
    switch (action.type) {
      case `${prefix}/INIT`:
        return { phase: 'NOT_ASKED' }
      case `${prefix}/PENDING`:
        return { phase: 'PENDING' }
      case `${prefix}/SUCCESS`:
        return { phase: 'SUCCESS', data: action.payload }
      case `${prefix}/ERROR`:
        return { phase: 'ERROR', error: action.payload }
      default:
        return enhancer ? enhancer(state, action) : state
    }
  }
}

export default remoteDataReducer
