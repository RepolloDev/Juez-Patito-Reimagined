import { ID_SESSION_KEY } from '@constants/auth'
import type { AstroCookies } from 'astro'

export async function getSessionID(cookies: AstroCookies) {
  const cookie = cookies.get(ID_SESSION_KEY)
  if (cookie) {
    return cookie.value
  }
}

export async function deleteSessionID(cookies: AstroCookies) {
  cookies.delete(ID_SESSION_KEY)
}

export async function generateSessionID() {
  const fetchURL = 'https://jv.umsa.bo/oj/'
  const response = await fetch(fetchURL, { method: 'GET' })
  return getResponseSessionId(response)
}

function parseCookieToJSON(cookie: string) {
  const cookies = cookie.trim().split(';')
  let result: Record<string, string> = {}
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=')
    result[name.trim()] = value
  })
  return result
}

export async function getResponseSessionId(response: Response) {
  const cookiesList = response.headers.getSetCookie()
  const cookiesObj = cookiesList.map((cookie) => {
    return parseCookieToJSON(cookie)
  })
  const sessionCookie = cookiesObj.find((cookie) => cookie[ID_SESSION_KEY])
  if (sessionCookie) {
    return sessionCookie[ID_SESSION_KEY]
  }
}

export async function formatSessionID(sessionID: string) {
  return `${ID_SESSION_KEY}=${sessionID}`
}
