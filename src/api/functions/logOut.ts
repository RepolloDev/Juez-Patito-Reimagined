import { type Session, sessionToCookie } from './session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'

const Response = createResponse<boolean>

export async function logout(session: Session) {
  const FETCH_URL = `${BASE_FETCH_URL}/logout.php`
  const response = await fetch(FETCH_URL, {
    method: 'GET',
    headers: {
      cookie: sessionToCookie(session),
    },
  })

  if (!response.ok) {
    return Response(false, new Error('Error al realizar el fetching de la página de logout'))
  }

  // ! Not possible to check if the user logged out successfully because the page redirects to the login page
  const { redirected: success } = response
  return Response(success, !success ? new Error('No se pudo cerrar sesión') : null)
}
