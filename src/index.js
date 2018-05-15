// @flow
import React from 'react'

export type RemoteDataT<D, E> =
  | { phase: 'NOT_ASKED' }
  | { phase: 'PENDING' }
  | { phase: 'SUCCESS', data: D }
  | { phase: 'FAILURE', error: ?E }

export type StateT = RemoteDataT<{}, {}>

const initialState: StateT = { phase: 'NOT_ASKED' }

export const remoteDataReducer = (prefix: string = '') => {
  return (state: StateT = initialState, action: any) => {
    switch (action.type) {
      case `${prefix}/INIT`:
        return { phase: 'NOT_ASKED' }
      case `${prefix}/PENDING`:
        return { phase: 'PENDING' }
      case `${prefix}/SUCCESS`:
        return { phase: 'SUCCESS', data: action.payload }
      case `${prefix}/FAILURE`:
        return { phase: 'FAILURE', error: action.payload }
      default:
        return state
    }
  }
}

export function onStateTransition<D, E>(data: {
  prevStore: RemoteDataT<D, E>,
  nextStore: RemoteDataT<D, E>,
  onSuccess?: (data: D) => mixed,
  onError?: (error: ?E) => mixed,
  onPending?: () => mixed,
  onInit?: () => mixed,
}): any {
  const { prevStore, nextStore, onSuccess, onError, onPending, onInit } = data
  const condPassed: boolean = prevStore.phase !== nextStore.phase
  if (condPassed) {
    if (nextStore.phase === 'SUCCESS')
      return onSuccess && onSuccess(nextStore.data)
    if (nextStore.phase === 'FAILURE')
      return onError && onError(nextStore.error)
    if (nextStore.phase === 'PENDING') return onPending && onPending()
    if (nextStore.phase === 'NOT_ASKED') return onInit && onInit()
  }
}

export type RemoteDataComponentPropsT = {
  data: { [key: string]: RemoteDataT<*, *> },
  fetchData?: () => void,
  renderNotAsked?: (data: *) => React$Node,
  renderPending?: (data: *) => React$Node,
  renderSuccess?: (data: *) => React$Node,
  renderError?: (data: *) => React$Node,
}
export default class RemoteDataComponent extends React.Component<
  RemoteDataComponentPropsT,
  void,
> {
  componentDidMount() {
    this.props.fetchData && this.props.fetchData()
  }

  render() {
    const {
      data,
      renderSuccess,
      renderPending,
      renderError,
      renderNotAsked,
    } = this.props
    const phases: Array<'NOT_ASKED' | 'PENDING' | 'SUCCESS' | 'FAILURE'> = []
    Object.values(data).forEach(state => phases.push(state.phase))
    if (renderError && phases.some(phase => phase === 'FAILURE')) {
      return renderError(data)
    } else if (renderPending && phases.some(phase => phase === 'PENDING'))
      return renderPending(data)
    else if (renderSuccess && phases.every(phase => phase === 'SUCCESS')) {
      const retStates: { [key: string]: { phase: 'SUCCESS', data: * } } = {}
      Object.entries(data).forEach(([key, state]) => {
        if (state.phase === 'SUCCESS')
          retStates[key] = { phase: 'SUCCESS', data: state.data }
      })
      return renderSuccess(retStates)
    } else return renderNotAsked ? renderNotAsked(data) : <noscript />
  }
}
