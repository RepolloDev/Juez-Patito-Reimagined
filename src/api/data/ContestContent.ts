import { type Session, sessionToCookie } from '../functions/session'
import scrapeIt from 'scrape-it'
import fallBackData from './ContestContentFallBack.json'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import { ContestStatus } from './enums/ContestStatus'

export type ContestProblemInfo = {
  solved: boolean
  contestProblemId: string
  contestProblemName: string
  name: string
  author: string
  submissionAcceptedCount: number
  submissionCount: number
}

export interface ContestContent {
  id: string
  access: boolean
  name: string
  description: string
  status: ContestStatus
  startDate: string
  endDate: string
  problems: ContestProblemInfo[]
}

const Response = createResponse<ContestContent>

//#region Scraping
function scrapeAccessContest(html: string) {
  const data = scrapeIt.scrapeHTML<ContestContent>(html, {
    id: {
      selector: 'main div:first div:first h3',
      convert: (text) => {
        const [id, ...rest] = text.split(' ')
        return id
      },
    },
    access: {
      selector: 'table',
      how: ($element) => {
        return true
      },
    },
    name: {
      selector: 'main div:first div:first h3',
      how: 'html',
      convert: (text) => {
        const [id, ...title] = text.split(' ')
        return title.join(' ')
      },
    },
    description: {
      selector: 'main div:first div:first h5',
      how: 'html',
    },
    status: {
      selector: 'main > div > div > div > div > div :last-child',
      how: ($element) => {
        if ($element.length === 6) {
          return ContestStatus.ACTIVE
        }
        return ContestStatus.FINISHED
      },
    },
    startDate: {
      selector: 'main div:first div:nth-child(2) div:first div:first',
      convert: (text) => {
        const magic = 'Hora de Inicio:'
        const formated = text.slice(magic.length)
        return formated
      },
    },
    endDate: {
      selector: 'main div:first div:nth-child(2) div:first div:nth-child(2)',
      convert: (text) => {
        const magic = 'Hora de Fin:'
        const formated = text.slice(magic.length)
        return formated
      },
    },
    problems: {
      listItem: 'main div:first div:nth-child(3) table tbody tr',
      data: {
        solved: {
          selector: 'td:first-child',
          convert: (text) => text.length > 0,
        },
        contestProblemName: {
          selector: 'td:nth-child(2)',
        },
        contestProblemId: {
          selector: 'td:nth-child(2)',
          convert: (text) => {
            try {
              const [number] = text.split(' ')
              return `${parseInt(number) - 1}`
            } catch (error) {
              return ''
            }
          },
        },
        name: 'td:nth-child(3) a',
        author: 'td:nth-child(4)',
        submissionAcceptedCount: {
          selector: 'td:nth-child(5)',
          convert: (text) => {
            const parsed = parseInt(text)
            return isNaN(parsed) ? 0 : parsed
          },
        },
        submissionCount: {
          selector: 'td:nth-child(6)',
          convert: (text) => {
            const parsed = parseInt(text)
            return isNaN(parsed) ? 0 : parsed
          },
        },
      },
    },
  })
  return data
}

function scrapeNotAccessContest(html: string) {
  const data = scrapeIt.scrapeHTML<ContestContent>(html, {
    id: {
      selector: 'main > div:first > div:first h3',
      convert: (text) => {
        const [id, ...rest] = text.split(' ')
        return id
      },
    },
    access: {
      selector: 'table',
      how: ($element) => {
        return false
      },
    },
    name: {
      selector: 'main > div:first > div:first h3',
      how: 'html',
      convert: (text) => {
        const [id, ...rest] = text.split(' ')
        return rest.join(' ')
      },
    },
    description: {
      selector:
        'main > div:first > div:first > div:first > div:first > div:first > div:nth-child(3)',
      how: 'html',
    },
    status: {
      selector: 'main > div > div > div > div > div :last-child',
      how: ($element) => {
        // TODO: Verify if this is correct in a private contest
        if ($element.length === 6) {
          return ContestStatus.ACTIVE
        }
        return ContestStatus.FINISHED
      },
    },
    startDate: {
      selector:
        'main > div:first > div:first > div:first > div:first > div:first > div:nth-child(1)',
      convert: (text) => {
        const magic = 'Hora de Inicio:'
        const formated = text.slice(magic.length)
        return formated
      },
    },
    endDate: {
      selector:
        'main > div:first > div:first > div:first > div:first > div:first > div:nth-child(2)',
      convert: (text) => {
        const magic = 'Hora de Fin:'
        const formated = text.slice(magic.length)
        return formated
      },
    },
    problems: {
      selector: 'table',
      how: ($element) => {
        return []
      },
    },
  })
  return data
}

//#region Validation

function isValidProblemContest(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error, los problemas no tienen el formato correcto')
  }
  if (data.contestProblemId === '' || data.name === '' || data.contestProblemName === '') {
    return new Error('Error al scrapear los problemas del concurso')
  }
}

function isValidContestContent(data: any) {
  if (data === null || data === undefined || data === null) {
    return new Error('Los datos no tienen el formato correcto')
  }
  if (data.id === '' || data.name === '') {
    return new Error('Error, el concurso no existe o fue eliminado')
  }
  if (
    new Date(data.startDate).toString() === 'Invalid Date' ||
    new Date(data.endDate).toString() === 'Invalid Date'
  ) {
    return new Error('Error, las fechas del concurso no son validas')
  }
  if (!Array.isArray(data.problems)) {
    return new Error('Error, los problemas no tienen el formato correcto')
  }
  if (data.problems.length > 0) {
    const testElement = data.problems[0]
    const error = isValidProblemContest(testElement)
    if (error) {
      return error
    }
  }
  return null
}

//#region API

function isAccessible(html: string) {
  const magic = 'Este contest es privado'
  const { data } = scrapeIt.scrapeHTML<{ data: string }>(html, {
    data: 'main > div > div > div > .p-1',
  })
  return !data.includes(magic)
}

export async function getContestContent(session: Session, contestId: string) {
  const FETCH_URL = `${BASE_FETCH_URL}/contest.php?cid=${contestId}`
  const response = await fetch(FETCH_URL, {
    headers: {
      Cookies: sessionToCookie(session),
    },
  })
  if (!response.ok) {
    return Response(
      fallBackData as ContestContent,
      new Error('Error al realizar el fetching de datos')
    )
  }

  const html = await response.text()
  const accesible = isAccessible(html)
  const data = accesible ? scrapeAccessContest(html) : scrapeNotAccessContest(html)
  const error = isValidContestContent(data)
  if (error instanceof Error) {
    return Response(fallBackData as ContestContent, error)
  }

  return Response(data, null)
}
