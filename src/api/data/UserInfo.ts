import { type Session, sessionToCookie } from '../functions/session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import scrapeIt from 'scrape-it'
import fallBackData from './UserInfoFallBack.json'

export interface UserSolvedProblem {
  name: string
  problemId: string
  submissionId: string
  submissionDate: string
  submissionCount: number
}

export interface UserInfo {
  name: string
  lastname: string
  email: string
  resolvedProblems: UserSolvedProblem[]
}

const Response = createResponse<UserInfo>

function scrapeUserInfo(html: string) {
  const data = scrapeIt.scrapeHTML<UserInfo>(html, {
    name: {
      selector: 'main form #nick',
      how: ($element) => {
        return $element.attr('value')
      },
    },
    lastname: {
      selector: 'main form #lastname',
      how: ($element) => {
        return $element.attr('value')
      },
    },
    email: {
      selector: 'main form #email',
      how: ($element) => {
        return $element.attr('value')
      },
    },
    resolvedProblems: {
      listItem: 'main table tbody tr',
      data: {
        submissionDate: {
          selector: 'td:nth-child(1)',
          convert: (text) => {
            return new Date(text)
          },
        },
        name: 'td:nth-child(2)',
        problemId: {
          selector: 'td:nth-child(2) a',
          how: ($element) => {
            const href = $element.attr('href') || ''
            return href.split('=')[1]
          },
        },
        submissionId: 'td:nth-child(3)',
        submissionCount: {
          selector: 'td:nth-child(5)',
          convert: (text) => {
            return parseInt(text)
          },
        },
      },
    },
  })
  return data
}

function isValidUserInfo(data: any) {
  if (typeof data !== 'object' || data === null) {
    return new Error('Error en el formato de la información del usuario')
  }
  if (data.name === '' || data.lastname === '' || data.email === '') {
    return new Error('El usuario no existe o no tiene acceso a la información')
  }
  return null
}

export async function getUserInfo(session: Session) {
  // This is not cacheable
  const FETCH_URL = `${BASE_FETCH_URL}/userInfo.php`
  const response = await fetch(FETCH_URL, {
    headers: {
      Cookie: sessionToCookie(session),
    },
  })
  if (!response.ok) {
    return Response(
      fallBackData,
      new Error('Error al obtener la información del usuario')
    )
  }
  const html = await response.text()
  const data = scrapeUserInfo(html)
  const error = isValidUserInfo(data)
  if (error instanceof Error) {
    return Response(fallBackData, error)
  }
  return Response(data, null)
}
