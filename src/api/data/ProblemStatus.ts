import { BASE_FETCH_URL } from '../contants'
import type { Session } from '../functions/session'
import { type ResultKey, isValidResult } from '../utils/results'
import { createResponse } from '../utils/response'
import scrapeIt from 'scrape-it'
import fallBackData from './ProblemStatusFallBack.json'

export interface RankedSubmission {
  runId: string
  position: number
  userName: string
  memory: number
  time: number
  language: string
  size: number
  submissionDate: string
}
export interface ProblemStatus {
  problemName: string
  ranking: RankedSubmission[]
  submissionsCount: number
  submissionStatusCount: Record<ResultKey, number>
}

const Response = createResponse<ProblemStatus>

//#region Validations function

function isValidRankedSubmission(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error al parsear los datos, la estructura no es correcta')
  }
  if (isNaN(data.position) || isNaN(data.memory) || isNaN(data.time) || isNaN(data.size)) {
    return new Error('Error al parsear los datos, los tipos no son correctos')
  }
  if (new Date(data.submissionDate).toString() === 'Invalid Date') {
    return new Error('Error al parsear los datos, la fecha no es correcta')
  }
  return null
}

function isValidProblemStatus(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error al parsear los datos, la estructura no es correcta')
  }
  if (data.problemName.length === 0) {
    return new Error(
      'Error en la obtención de datos, puede que el problema no exista o haya sido eliminado',
      { cause: 'ProblemName is empty, then the problem does not exist' }
    )
  }

  if (isNaN(data.submissionsCount) || typeof data.submissionStatusCount !== 'object') {
    return new Error('Error al parsear los datos, los tipos no son correctos')
  }

  Object.entries(data.submissionStatusCount).forEach(([key, value]) => {
    if (!isValidResult(key)) {
      return new Error('Error al parsear los datos, los datos obtenidos no son correctos')
    }
    if (typeof value !== 'number' || isNaN(value)) {
      return new Error('Error al parsear los datos, los tipos no son correctos')
    }
  })
  if (data.ranking.length > 0) {
    const testElement = data.ranking[0]
    const error = isValidRankedSubmission(testElement)
    if (error !== null) {
      return error
    }
  }
  return null
}

//#region Scraping function

function scrapeProblemStatus(html: string) {
  const data = scrapeIt.scrapeHTML<ProblemStatus>(html, {
    problemName: {
      selector: 'main h2',
      convert: (text) => {
        const magic = 'Problema: '
        return text.slice(magic.length)
      },
    },
    submissionsCount: {
      selector:
        'main > div > div > div > div > div > div:first-child > table > tbody > tr:first-child > td:nth-child(2)',
      convert: (text) => {
        return parseInt(text)
      },
    },
    submissionStatusCount: {
      selector:
        'main > div > div > div > div > div > div:first-child > table > tbody > tr:nth-child(n+2)',
      how: ($elements) => {
        let result: Record<string, number> = {}
        for (let i = 0; i < $elements.length; i++) {
          const current = $elements.eq(i)
          const key = current.find('td:nth-child(1)').text()
          const value = parseInt(current.find('td:nth-child(2)').text())
          result[key] = value
        }
        return result
      },
    },
    ranking: {
      listItem: 'main > div > div > div > div > div > div:last-child table tbody tr:nth-child(n+1)',
      data: {
        position: {
          selector: 'td:nth-child(1)',
          convert: (text) => {
            return parseInt(text)
          },
        },
        runId: 'td:nth-child(2)',
        userName: 'td:nth-child(3)',
        memory: {
          selector: 'td:nth-child(4)',
          convert: (text) => {
            const splited = text.split(' ')
            const value = splited.length > 1 ? splited[0] : '0'
            return parseInt(value)
          },
        },
        time: {
          selector: 'td:nth-child(5)',
          convert: (text) => {
            const splited = text.split(' ')
            const value = splited.length > 1 ? splited[0] : '0'
            return parseInt(value)
          },
        },
        language: 'td:nth-child(6)',
        size: {
          selector: 'td:nth-child(7)',
          convert: (text) => {
            return parseInt(text)
          },
        },
        submissionDate: {
          selector: 'td:nth-child(8)',
        },
      },
    },
  })
  return data
}

//#region API function

export async function getProblemStatus(session: Session, problemId: string) {
  const FETCH_URL = `${BASE_FETCH_URL}/problemstatus.php?id=${problemId}`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(fallBackData as ProblemStatus, new Error('Error al obtener los datos'))
  }
  const html = await response.text()
  const data = scrapeProblemStatus(html)
  const error = isValidProblemStatus(data)
  if (error instanceof Error) {
    return Response(fallBackData as ProblemStatus, error)
  }

  return Response(data as ProblemStatus, null)
}
