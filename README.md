# remote-data-component

A library to allow for better remote data UI managment.

Learn more: https://medium.com/unpacking-trunk-club/using-redux-and-redux-saga-to-handle-api-calls-18964d234660

## Installation

```
npm install remote-data-component
```

## Usage

### RemoteDataComponent

This component allows a component to be rendered differently for different phases of remote data calls

| Prop | Required | Type | Description |
|---|---|---|---|
| data | yes | `{[key: string]: RemoteDataT<*, *>}` | Object containing API data in the `RemoteDataT` type |
| renderNotAsked | | `() => React.Node` | Renders component when not API calls have been started |
| renderPending | | `() => React.Node` | Renders when at least ONE call is pending |
| renderSuccess | | `() => React.Node` | Renders when ALL calls are successful |
| renderError | | `() => React.Node` | Renders when at leaset ONE call has an error |

```js
import React from 'react'
import RemoteDataComponent from 'RemoteDataComponent'

class MyComponent extends React.Component {
  render() {
    const { MyDataOne, MyDataTwo } = this.props

    return (
      <RemoteDataComponent
        data={{ MyDataOne, MyDataTwo }}
        renderNotAsked={() => <Empty />}
        renderPending={() => <Loading />}
        renderError={() => <Error />}
        renderSuccess={data => (
          <Content one={data.MyDataOne.data} two={data.MyDataTwo.data} />
        )}
      />
    )
  }
}
```

### onStateTransition

This utils function is meant to be called when some actions should be taken when a call transitions (eg. `PENDING` -> `SUCCESS` or `PENDING` -> `ERROR`)

| Parameter | Required | Type | Description |
|---|---|---|---|
| prevState | yes | `RemoteDataT<*, *>` | Previous API call object |
| nextState | yes | `RemoteDataT<*, *>` | Next API call object |
| onSuccess | | `() => void` | Called when state transistion from `non-Success` to `Success` |
| onError | | `() => void` | Called when state transistion from `non-Error` to `Error` |
| onPending | | `() => void` | Called when state transistion from `non-Pending` to `Pending` |
| onInit | | `() => void` | Called when state transistion from `non-Init` to `Init` |

```js
import React from 'react'
import {onStateTransition} from 'RemoteDataComponent'

class MyComponent extends React.Component {
  componentDidUpdate(prevProps) {
    onStateTransition({
      prevState: prevProps.MyData,
      nextState: this.props.MyData,
      onSuccess: () => console.log('Success!')
      onError: () => console.warn('Error!')
    })
  }
}
```

### remoteDataReducer

This utils function is meant to create a reducer function that facilitates the `RemoteDataT` API call concept

| Parameter | Required | Type | Description |
|---|---|---|---|
| prefix | yes | `string` | Prefix string to prefix action types (eg. `MyData/PENDING`) |
| enhancer | yes | `(state: StateT, action: ActionT) => StateT` | Custom reducer that can be called to account for other action types |

```js
import { remoteDataReducer } from 'remote-data-component'

export default remoteDataReducer('MyData')
```
