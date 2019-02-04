// @flow
export type RemoteDataT<D, E> =
  | { phase: 'NOT_ASKED' }
  | { phase: 'PENDING' }
  | { phase: 'SUCCESS', data: D }
  | { phase: 'FAILURE', error: ?E }

export type StateT = RemoteDataT<*, *>

export type ActionT = { type: *, payload: * }
