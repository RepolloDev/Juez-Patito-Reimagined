import { type Session, sessionToCookie } from './session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'

export interface UserDataLostPassword {
  email: string
}

const Response = createResponse<boolean>

export function isValidEmail(data: UserDataLostPassword) {
  const { email } = data
  const value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  return !value ? new Error('El email ingresado no es válido') : null
}

export function parseData(data: UserDataLostPassword) {
  const { email } = data
  return `email=${email}`
}

export async function lostPassword(session: Session, data: UserDataLostPassword) {
  const error = isValidEmail(data)
  if (error instanceof Error) {
    return Response(false, error)
  }

  const body = parseData(data)
  const FETCH_URL = `${BASE_FETCH_URL}/lostpassword.php`
  const response = await fetch(FETCH_URL, {
    method: 'POST',
    body,
    headers: {
      Cookie: sessionToCookie(session),
    },
  })

  if (!response.ok) {
    return Response(false, new Error('El email ingresado no está registrado en la plataforma'))
  }

  return Response(true, null)
}
