import { type Session } from '../functions/session'
import { createResponse } from '../utils/response'
import { getContestContent, type ContestProblemInfo } from './ContestContent'
import fallBackData from './ContestProblemContentFallBack.json'
import { BASE_FETCH_URL } from '../contants'
import scrapeIt from 'scrape-it'

export enum ContestProblemStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
}

export interface ContestProblemContent {
  id: string
  name: string
  status: ContestProblemStatus
  contestProblemName: string
  contestProblemId: string
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

const Response = createResponse<ContestProblemContent>

function scrapeContestProblemContent(html: string, problemContest: ContestProblemInfo) {
  const { contestProblemId, contestProblemName, submissionAcceptedCount, submissionCount } =
    problemContest

  const data = scrapeIt.scrapeHTML<ContestProblemContent>(html, {
    id: {
      selector: 'main > div > div > :nth-child(2) > div > :last-child > :last-child',
      how: ($element) => {
        const href = $element.attr('href') || ''
        const match = href.match(/id=(\d+)/)
        return match ? match[1] : ''
      },
    },
    name: 'main > div > div > :nth-child(2) h2',
    status: {
      selector: 'main > div > div > :nth-child(2) > div > :last-child >',
      how: ($element) => {
        return $element.length === 2 ? ContestProblemStatus.ACTIVE : ContestProblemStatus.INACTIVE
      },
    },
    contestProblemName: {
      selector: 'main',
      how: ($element) => {
        return contestProblemName
      },
    },
    contestProblemId: {
      selector: 'main',
      how: ($element) => {
        return contestProblemId
      },
    },
    submissionCound: {
      selector: 'main',
      how: ($element) => {
        return submissionCount
      },
    },
    submissionAcceptedCound: {
      selector: 'main',
      how: ($element) => {
        return submissionAcceptedCount
      },
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
    return new Error('Error al obtener la información del problema del concurso')
  }
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

export async function getContestProblemContent(
  session: Session,
  contestId: string,
  problemId: string
) {
  const { data: contestData, error: contestError } = await getContestContent(session, contestId)
  if (!contestData?.access || contestError) {
    return Response(
      fallBackData as ContestProblemContent,
      new Error('No se pudo obtener la información del concurso')
    )
  }

  const problemContest = contestData.problems.find(
    (problem) => problem.contestProblemId === problemId
  )
  if (!problemContest) {
    return Response(
      fallBackData as ContestProblemContent,
      new Error('No se pudo encontrar el problema en el concurso')
    )
  }

  const FETCH_URL = `${BASE_FETCH_URL}/problem.php?cid=${contestId}&pid=${problemId}`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(
      fallBackData as ContestProblemContent,
      new Error('Error al obtener la información del problema del concurso')
    )
  }

  const html = await response.text()
  const data = scrapeContestProblemContent(html, problemContest)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData as ContestProblemContent, error)
  }
  return Response(data, error)
}
