import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import websocket from '@giantmachines/redux-websocket'
import logger from 'redux-logger'
import { routerMiddleware } from 'connected-react-router'

import rootReducer from './reducers'

export const history = createBrowserHistory()

export default function configureStore(preloadedState) {
    const middlewares = [routerMiddleware(history), logger, thunkMiddleware, websocket]
    const store = createStore(
      rootReducer(history), 
      preloadedState, 
      compose(applyMiddleware(...middlewares))
    )
  
    return store
  }