import { type Session } from '../functions/session'
import scrapeIt from 'scrape-it'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import fallBackData from './ProblemContentFallBack.json'

export interface ProblemContent {
  id: string
  name: string
  submissionCound: number
  submissionAcceptedCound: number
  limits: {
    memory: number
    time: number
  }
  description: string
  input: {
    description: string
    example: string
  }
  ouput: {
    description: string
    example: string
  }
  helpNote?: string
}

const Response = createResponse<ProblemContent>

function scrapeProblemContent(html: string) {
  const data = scrapeIt.scrapeHTML<ProblemContent>(html, {
    id: {
      selector: 'main > div > div > :nth-child(2) > div > :last-child > :last-child',
      how: ($element) => {
        const href = $element.attr('href') || ''
        const match = href.match(/id=(\d+)/)
        return match ? match[1] : ''
      },
    },
    name: 'main > div > div > :nth-child(2) h2',
    submissionCound: {
      selector:
        'main > div > div > :nth-child(2) > div > :nth-child(2) > :nth-child(3) :last-child',
      convert: (x) => parseInt(x),
    },
    submissionAcceptedCound: {
      selector:
        'main > div > div > :nth-child(2) > div > :nth-child(2) > :nth-child(4) :last-child',
      convert: (x) => parseInt(x),
    },
    limits: {
      selector:
        'main > div > div > :nth-child(2) > div > :nth-child(2) > :nth-child(-n+2) :last-child',
      how: ($element) => {
        let result = {
          time: NaN,
          memory: NaN,
        }
        if ($element.length === 2) {
          // get only number
          const time = $element.eq(0).text().match(/\d+/)
          const memory = $element.eq(1).text().match(/\d+/)
          if (time) result.time = parseInt(time[0])
          if (memory) result.memory = parseInt(memory[0])
        }
        return result
      },
    },
    description: 'main > div > div > :last-child > :nth-child(1) p',
    input: {
      selector: 'main > div > div > :last-child > div',
      how: ($element) => {
        const description = $element.eq(1).find('p').text()
        const $container = $element.eq(3)
        const example = $container.find(':nth-child(1) pre').text()
        return { description, example }
      },
    },
    output: {
      selector: 'main > div > div > :last-child > div',
      how: ($element) => {
        const description = $element.eq(2).find('p').text()
        const $container = $element.eq(3)
        const example = $container.find(':nth-child(2) pre').text()
        return { description, example }
      },
    },
    helpNote: 'main > div > div > :last-child > :last-child p',
  })
  return data
}

function isValidData(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('No se pudo obtener la información de la página')
  }
  if (data.name === '' || data.id === '') {
    return new Error('Parece que el problema no existe o fue eliminado')
  }
  if (isNaN(data.limits.memory) || isNaN(data.submissionAcceptedCound)) {
    return new Error('El formato de los datos no es el esperado')
  }

  if (isNaN(data.limits.time) || isNaN(data.limits.memory)) {
    return new Error('El formato de los límites del problema no tienen el tipo correcto')
  }
  return null
}

export async function getProblemContent(session: Session, problemId: string) {
  const FETCH_URL = `${BASE_FETCH_URL}/problem.php?id=${problemId}`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(
      fallBackData,
      new Error('Sucedio un error al momento de realizar el fetching de datos')
    )
  }
  const html = await response.text()
  const data = scrapeProblemContent(html)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData, error)
  }

  return Response(data, null)
}
