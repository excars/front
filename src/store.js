import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import websocket from '@giantmachines/redux-websocket'
import logger from 'redux-logger'

import rootReducer from './reducers'

export default function configureStore(preloadedState) {
    const middlewares = [logger, thunkMiddleware, websocket]
    const store = createStore(rootReducer, preloadedState, applyMiddleware(...middlewares))
  
    return store
  }