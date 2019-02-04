// @flow
import type { RemoteDataT } from '../types'

function onStateTransition<D, E>(data: {
  prevStore: RemoteDataT<D, E>,
  nextStore: RemoteDataT<D, E>,
  onSuccess?: (data: D) => mixed,
  onError?: (error: ?E) => mixed,
  onPending?: () => mixed,
  onInit?: () => mixed,
}): void {
  const { prevStore, nextStore, onSuccess, onError, onPending, onInit } = data
  const condPassed: boolean = prevStore.phase !== nextStore.phase
  if (condPassed) {
    if (nextStore.phase === 'SUCCESS') onSuccess && onSuccess(nextStore.data)
    if (nextStore.phase === 'FAILURE') onError && onError(nextStore.error)
    if (nextStore.phase === 'PENDING') onPending && onPending()
    if (nextStore.phase === 'NOT_ASKED') onInit && onInit()
  }
}

export default onStateTransition
