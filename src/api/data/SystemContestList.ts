import { type Session } from '../functions/session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import scrapeIt from 'scrape-it'
import fallBackData from './SystemContestListFallBack.json'
import { ContestStatus } from './enums/ContestStatus'

export interface SystemContest {
  id: string
  name: string
  status: ContestStatus
  endDate: string
  isPrivate: boolean
}

const Response = createResponse<SystemContest[]>

function isValidContest(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error al parsear los datos, la estructura no es correcta')
  }
  if (data.id === '' || data.name === '' || data.status === '' || data.endDate === '') {
    return new Error('Error al parsear los datos, los valores no son correctos')
  }
  if (new Date(data.endDate).toString() === 'Invalid Date') {
    return new Error('Error al parsear los datos, la fecha no es correcta')
  }

  return null
}

function isValidContestList(data: any) {
  if (!Array.isArray(data)) {
    return new Error('Error en el formato esperado de los datos')
  }
  if (data.length > 0) {
    const testElement = data[0]
    const error = isValidContest(testElement)
    if (error) {
      return error
    }
  }
}

function scrapeContestList(html: string) {
  const { data } = scrapeIt.scrapeHTML<{ data: SystemContest[] }>(html, {
    data: {
      listItem: 'main table tbody tr',
      data: {
        id: 'td:nth-child(1)',
        name: 'td:nth-child(2) a',
        status: {
          selector: 'td:nth-child(3) span:first-child',
          convert: (text) => {
            return text === 'Corriendo' ? ContestStatus.ACTIVE : ContestStatus.FINISHED
          },
        },
        endDate: {
          selector: 'td:nth-child(3)',
          how: ($element) => {
            const $container = $element.contents()
            if ($container.length === 2) {
              // FOR FINISHED CONTESTS
              const date = $container.text()
              const magic = 'Termino el '
              const formated = date.slice(magic.length)
              return formated
            } else {
              // FOR ACTIVE CONTESTS
              const date = $container.last().contents().first().text()
              const magic = 'Termina el: '
              const formated = date.slice(magic.length)
              return formated
            }
          },
        },
        isPrivate: {
          selector: 'td:nth-child(4)',
          convert: (text) => {
            return text === 'Privado' ? true : false
          },
        },
      },
    },
  })
  return data
}

export async function getSystemContestList(session: Session) {
  const FETCH_URL = `${BASE_FETCH_URL}/contest.php`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(fallBackData as SystemContest[], new Error('Error fetching contests'))
  }
  const html = await response.text()
  const data = scrapeContestList(html)
  const error = isValidContestList(data)
  if (error instanceof Error) {
    return Response(fallBackData as SystemContest[], error)
  }

  return Response(data as SystemContest[], null)
}
