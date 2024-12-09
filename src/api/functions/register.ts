import { type Session, sessionToCookie, isActiveSession } from './session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'

export interface RegisterData {
  name: string
  lastname: string
  nickname: string
  email: string
  email2: string
  password: string
  password2: string
}

const Response = createResponse<boolean>

function genBoundary() {
  return '---------------------------' + Math.floor(Math.random() * 1000000000000000)
}

function genFormData(data: RegisterData, boundary: string) {
  let body = ''
  for (const key in data) {
    body += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${data[key as keyof typeof data]}\r\n`
  }
  return body + `--${boundary}--\r\n`
}

export async function register(session: Session, data: RegisterData) {
  if (await isActiveSession(session)) {
    return Response(
      false,
      new Error('El usuariuo ya está logueado, no se puede registrar de nuevo, cierra sesión antes')
    )
  }

  const boundary = genBoundary()
  const formData = genFormData(data, boundary)

  const FETCH_URL = `${BASE_FETCH_URL}/registerpage.php`
  const response = await fetch(FETCH_URL, {
    headers: {
      Cookie: sessionToCookie(session),
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: formData,
    method: 'POST',
  })

  if (!response.ok) {
    return Response(
      false,
      new Error(
        'Error al intentar registrar al usuario, verifique los campos o intentelo en la página oficial'
      )
    )
  }
  return Response(true, null)
}
