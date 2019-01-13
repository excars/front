import { push } from 'connected-react-router'
import { authUrl } from '../utils'
import { reject } from 'q';

const GET_ME_STARTED = 'GET_ME_STARTED'
const GET_ME_SUCCESS = 'GET_ME_SUCCESS'
const GET_ME_FAILURE = 'GET_ME_FAILURE'

export const getMe = () => (dispatch) => {
  if (!window.localStorage.getItem('access_token')) {
    return
  }
  dispatch(_getMeStarted())
  fetch(
    authUrl(process.env.REACT_APP_ME_URL), 
  ).then((resp) => {
    if (resp.ok) {
      return resp.json()
    }
    if (resp.status === 401) {  
      window.localStorage.removeItem('access_token')
    }
  }).then((json) => {
    dispatch(_getMeSuccess(json.me))
  }).catch(() => {
    dispatch(_getMeFailture())
  })
};

// ACTIONS 
const _getMeStarted = () => ({
  type: GET_ME_STARTED
});

const _getMeSuccess = me => ({
  type: GET_ME_SUCCESS,
  payload: {
    ...me
  }
});

const _getMeFailture = () => ({
  type: GET_ME_FAILURE,
});

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ME_STARTED:
      return {};
    case GET_ME_SUCCESS:
      return {
        ...action.payload
      };
    case GET_ME_FAILURE:
      return {
        ...state
      };
    default:
      return state;
  }
}