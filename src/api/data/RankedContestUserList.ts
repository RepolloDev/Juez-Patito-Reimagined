import { type Session } from '../functions/session'
import { createResponse } from '../utils/response'
import scrapeIt from 'scrape-it'
import { BASE_FETCH_URL } from '../contants'
import { getContestContent, type ContestContent } from './ContestContent'
import fallBackData from './RankedContestUserListFallBack.json'

export enum SolvedStatus {
  FIRST_SOLVER = 'Primero en resolver',
  SOLVED = 'Resuelto',
  NOT_SOLVED = 'No resuelto',
}

export interface RankingProblemInfo {
  contestProblemId: string
  solved: SolvedStatus
  failureCount: number
  submissionDate: string
}

export interface RankedContestUser {
  position: number
  user: string
  userFullName: string
  solvedProblemsCount: number
  problems: RankingProblemInfo[]
}

const Response = createResponse<RankedContestUser[]>

function scrapeRankedContestUserList(html: string, contest: ContestContent) {
  const { endDate: contestEndDate, startDate: contestStartDate, problems } = contest
  const { data } = scrapeIt.scrapeHTML<{ data: RankedContestUser[] }>(html, {
    data: {
      listItem: 'main table tbody tr',
      data: {
        position: {
          selector: 'td:nth-child(1)',
          convert: (x) => parseInt(x),
        },
        userFullName: 'td:nth-child(2)',
        userName: 'td:nth-child(3)',
        solvedProblemsCount: {
          selector: 'td:nth-child(4)',
          convert: (x) => parseInt(x),
        },
        problems: {
          how: ($element) => {
            const $values = $element.find('td:nth-child(n+5)')
            let resultForProblems: RankingProblemInfo[] = []
            for (let i = 0; i < $values.length && i < problems.length; i++) {
              const $currentElement = $values.eq(i)
              const currentValue = $currentElement.text()
              const { contestProblemId } = problems[i]

              // element === '123:12:12 (-n)', get (-n), where n === failureCount
              const regex = /\((-\d+)\)/
              let failureCount: number = 0
              // remove failure count from the value and get it
              const replacedValue = currentValue.replace(regex, (matched) => {
                const fails = parseInt(matched.replace(/\(|\)/g, ''))
                failureCount = isNaN(fails) ? 0 : Math.abs(fails)
                return ''
              })

              // get the submission date relative to the contest start date
              let relativeDate: Date = new Date('THIS IS INVALID')
              const timeValues = replacedValue
                .split(':')
                .map((x) => parseInt(x))
                .filter((x) => !isNaN(x))
              if (timeValues.length === 3) {
                const [hours, minutes, seconds] = timeValues
                relativeDate = new Date(contestStartDate)
                relativeDate.setHours(
                  relativeDate.getHours() + hours,
                  relativeDate.getMinutes() + minutes,
                  relativeDate.getSeconds() + seconds
                )
              }
              let submissionDate = relativeDate.toString()
              let solved = SolvedStatus.NOT_SOLVED
              if (submissionDate !== 'Invalid Date') {
                solved = SolvedStatus.SOLVED
                // This style is only present when the user is the first to solve the problem
                const magic = 'padding:1px;background-color:#aaaaff'
                if ($currentElement.attr('style') === magic) {
                  solved = SolvedStatus.FIRST_SOLVER
                }
              }

              resultForProblems.push({
                contestProblemId,
                solved,
                failureCount,
                submissionDate,
              })
            }
            return resultForProblems
          },
        },
      },
    },
  })
  return data
}

function isValidProblemContest(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error(
      'El formato de la información de un problema del ranking del concurso es incorrecto'
    )
  }
  if (
    data.contestProblemId === '' ||
    data.solved === '' ||
    isNaN(data.failureCount) ||
    data.submissionDate === ''
  ) {
    return new Error(
      'Error al scrapear la información de un problema del ranking del concurso, las propiedades de los problemas no tienen el formato correcto'
    )
  }
  return null
}

function isValidRankedContestUser(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('El formato de la información del ranking del concurso es incorrecto')
  }
  if (
    isNaN(data.position) ||
    data.user === '' ||
    data.userFullName === '' ||
    isNaN(data.solvedProblemsCount) ||
    !Array.isArray(data.problems)
  ) {
    return new Error(
      'Error al scrapear la información del ranking del concurso, las propiedades no tienen el formato correcto'
    )
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

function isValidData(data: any) {
  if (!Array.isArray(data)) {
    return new Error('No se pudo obtener la información del ranking del concurso')
  }
  if (data.length > 0) {
    const testElement = data[0]
    const error = isValidRankedContestUser(testElement)
    if (error) {
      return error
    }
  }
  return null
}

export async function getRankedContestUserList(session: Session, contestId: string) {
  const { data: contestData, error: contestError } = await getContestContent(session, contestId)
  if (!contestData?.access || contestError) {
    return Response(
      fallBackData as RankedContestUser[],
      new Error(
        'No se pudo obtener la información del concurso, el concurso puede estar privado o no existir'
      )
    )
  }

  const FETCH_URL = `${BASE_FETCH_URL}/contestrank.php?cid=${contestId}`
  const response = await fetch(FETCH_URL)

  if (!response.ok) {
    return Response(
      fallBackData as RankedContestUser[],
      new Error('Error al obtener la información del ranking del concurso')
    )
  }

  const html = await response.text()
  const data = scrapeRankedContestUserList(html, contestData)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData as RankedContestUser[], error)
  }
  return Response(data, error)
}
