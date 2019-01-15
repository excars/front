import { authUrl } from './utils'

export default async () => {
  if (!window.localStorage.getItem('access_token')) {
    return
  }
  const resp = await fetch(
    authUrl(process.env.REACT_APP_ME_URL), 
  )
  if (resp.status === 401) {  
    window.localStorage.removeItem('access_token')
    return
  }
  return (await resp.json()).me
};
