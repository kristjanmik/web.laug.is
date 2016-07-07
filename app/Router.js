import React from 'react'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Frontpage from './pages/Frontpage'

export default function({ history }){
  return (
    <Router history={history}>
      <Route path="/" component={Frontpage} />
      <Route path="*" component={Frontpage} />
    </Router>
  )
}
