import { combineReducers } from 'redux'
import { reducer } from 'redux-react-local';

import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  local: reducer,
  routing: routerReducer
})

export default rootReducer
