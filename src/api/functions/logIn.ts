import { type Session, sessionToCookie, isActiveSession } from './session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'

export interface UserDataLogin {
  username: string
  password: string
}

const Response = createResponse<boolean>

function parseData(data: UserDataLogin) {
  const { username, password } = data
  return `username=${username}&password=${password}`
}

export async function login(session: Session, data: UserDataLogin) {
  if (await isActiveSession(session)) {
    return Response(
      false,
      new Error(
        'El usuario ya está logueado, no se puede iniciar sesión de nuevo, cierra sesión antes'
      )
    )
  }

  const body = parseData(data)
  const FETCH_URL = `${BASE_FETCH_URL}/login.php`
  const response = await fetch(FETCH_URL, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: sessionToCookie(session),
    },
  })

  if (!response.ok) {
    return Response(false, new Error('Error al realizar el fetching de la página de login'))
  }

  // ! If response.redirected is true, then the user logged in successfully
  // This is because the login page redirects to the home page
  const { redirected: success } = response
  return Response(success, !success ? new Error('No se pudo iniciar sesión') : null)
}
