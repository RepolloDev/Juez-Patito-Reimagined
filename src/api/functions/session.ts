import { TOKEN_KEY, USER_KEY } from '../contants'
import { BASE_FETCH_URL } from '../contants'

/**
 * Session interface
 * @property {string} token - The token of the session
 * @property {string} user - The user of the session
 */
export interface Session {
  token: string
  user: string
}

export async function defaultSession(): Promise<Session> {
  const FETCH_URL = `${BASE_FETCH_URL}/`
  const response = await fetch(FETCH_URL, { method: 'GET' })
  const cookies = response.headers.getSetCookie()
  const parsedCookies = cookies.map(parseCookieToJSON)

  return {
    user: parsedCookies.find((cookie) => cookie[USER_KEY])?.[USER_KEY] || '',
    token: parsedCookies.find((cookie) => cookie[TOKEN_KEY])?.[TOKEN_KEY] || '',
  }
}

export function sessionToCookie(session: Session): string {
  return `${USER_KEY}=${session.user}; ${TOKEN_KEY}=${session.token}`
}

export function cookieToSession(cookie: string): Session {
  const parts = cookie.split(';')
  const user = parts.find((part) => part.includes(USER_KEY))?.split('=')[1] || ''
  const token = parts.find((part) => part.includes(TOKEN_KEY))?.split('=')[1] || ''
  return { user, token }
}

export async function isActiveSession(session: Session) {
  const FETCH_URL = `${BASE_FETCH_URL}/submitpage.php`
  const response = await fetch(FETCH_URL, {
    method: 'GET',
    headers: {
      Cookie: sessionToCookie(session),
    },
  })
  return !response.redirected && !response.url.includes('login')
}

//#region Utilities
function parseCookieToJSON(cookie: string) {
  const cookies = cookie.trim().split(';')
  let result: Record<string, string> = {}
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=')
    result[name.trim()] = value
  })
  return result
}
