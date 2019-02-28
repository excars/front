import { stringify } from 'query-string';

export const buildUrl = (url, params) => {
  return `${url}?${stringify(params)}`
}

export const authUrl = url => {
  return buildUrl(url, {access_token: window.localStorage.getItem('access_token')})
}

export default authUrl