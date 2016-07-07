import React from 'react'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Frontpage from './pages/Frontpage'
import NotFound from './pages/NotFound'

export default function({ history }){
  return (
    <Router history={history}>
      <Route path="/" component={Frontpage} />
      <Route path="*" component={NotFound} />
    </Router>
  )
}
