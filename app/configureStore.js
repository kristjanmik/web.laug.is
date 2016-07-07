import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger();

export default function configureStore(routerMiddleware) {
  let middleware;

  if(process.env.NODE_ENV === 'development'){
    middleware = applyMiddleware(
      thunkMiddleware,
      routerMiddleware,
      loggerMiddleware
    )
  }else{
    middleware = applyMiddleware(
      thunkMiddleware,
      routerMiddleware,
    )
  }
  const store = createStore(
    rootReducer,
    undefined, //initialState
    middleware
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/index', () => {
      const nextRootReducer = require('./reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
