import React, { Component } from 'react'
import { render } from 'react-dom'

import { browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'

import fetch from 'isomorphic-fetch';

import Router from './Router'

import configureStore from './configureStore'

const routerMW = routerMiddleware(browserHistory)

const store = configureStore(routerMW)

const history = syncHistoryWithStore(browserHistory, store)

import { Root } from 'redux-react-local'

class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          {<Router history={history}/>}
        </Root>
      </Provider>
    )
  }
}

render(
  <Main />,
  document.getElementById('root')
)
