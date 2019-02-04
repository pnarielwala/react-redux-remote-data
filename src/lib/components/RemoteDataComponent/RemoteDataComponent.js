// @flow
import React, { Component, type Node } from 'react'
import type { RemoteDataT } from '../../types'

type PropsT = {
  data: { [key: string]: RemoteDataT<*, *> },
  fetchData?: () => void,
  renderNotAsked?: (data: *) => Node,
  renderPending?: (data: *) => Node,
  renderSuccess?: (data: *) => Node,
  renderError?: (data: *) => Node,
}

class RemoteDataComponent extends Component<PropsT, void> {
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

export default RemoteDataComponent
