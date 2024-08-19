import type { AstroCookies } from 'astro'
import { ID_SESSION_KEY } from '@constants/auth'
import {
  getSessionID,
  deleteSessionID,
  generateSessionID,
  formatSessionID,
} from '@utils/auth/sessionID'

function validateForm(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')
  if (!username || !password) {
    return Error('Por favor, complete todos los campos')
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return Error('Los datos ingresados no son válidos')
  }
  return `username=${username}&password=${password}`
}

export async function logIn(cookies: AstroCookies, formData: FormData) {
  const data = validateForm(formData)
  if (data instanceof Error) {
    return data
  }
  const sessionID = (await getSessionID(cookies)) || (await generateSessionID())
  if (!sessionID) {
    return Error('No se pudo obtener la cookie de sesión')
  }
  const fetchURL = 'https://jv.umsa.bo/oj/login.php'
  const formattedSessionID = await formatSessionID(sessionID)
  await fetch(fetchURL, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: formattedSessionID,
    },
  })
  cookies.set(ID_SESSION_KEY, sessionID, {
    path: '/',
    expires: genExpirationDate(),
  })
  const isUserLogged = await isLoggedIn(cookies)
  if (!isUserLogged) {
    deleteSessionID(cookies)
    return Error('No se pudo iniciar sesión')
  }
  return true
}

export async function isLoggedIn(cookies: AstroCookies) {
  const sessionID = await getSessionID(cookies)
  if (sessionID) {
    const fetchURL = 'https://jv.umsa.bo/oj/submitpage.php'
    const formattedSessionID = await formatSessionID(sessionID)
    const response = await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Cookie: formattedSessionID,
      },
    })
    return !response.redirected && !response.url.includes('login')
  }
  return false
}



export async function logOut(cookies: AstroCookies) {
  // Para ambos casos se elimina la cookie de sesión
  const sessionID = await getSessionID(cookies)
  if (sessionID) {
    const fetchURL = 'https://jv.umsa.bo/oj/logout.php'
    const formattedSessionID = await formatSessionID(sessionID)
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Cookie: formattedSessionID,
      },
    })
  }
  deleteSessionID(cookies)
  return true
}

function genExpirationDate() {
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 1)
  return expiration
}
