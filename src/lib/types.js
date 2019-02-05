// @flow
export type RemoteDataT<D, E, M = any> =
  | { phase: 'NOT_ASKED', meta?: M }
  | { phase: 'PENDING', meta?: M }
  | { phase: 'SUCCESS', data: D, meta?: M }
  | { phase: 'FAILURE', error: ?E, meta?: M }

export type StateT = RemoteDataT<*, *>

export type ActionT = { type: *, payload: * }
