import { type Session } from '../functions/session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import fallBackData from './ProblemListFallBack.json'

export interface ProblemInfo {
  solved: boolean
  problemId: string
  name: string
  author: string
  submissionAcceptedCount: number
  submissionCount: number
}

const Response = createResponse<ProblemInfo[]>

function parseData(data: unknown) {
  if (data === null || typeof data !== 'object') {
    return Response(
      null,
      new Error('Error en el formato esperado de los datos', {
        cause: 'data is not an object',
      })
    )
  }
  if (!('data' in data)) {
    return Response(
      null,
      new Error('Error en el formato esperado de los datos', {
        cause: 'data field is missing',
      })
    )
  }
  const { data: problems } = data
  if (!Array.isArray(problems)) {
    return Response(
      null,
      new Error('Error en el formato esperado de los datos', {
        cause: 'problems is not an array',
      })
    )
  }
  try {
    const result = problems.map((item) => ({
      solved: item.ac > 0,
      problemId: item.problem_id,
      name: item.title,
      author: item.source,
      submissionCount: item.submit,
      submissionAcceptedCount: item.accepted,
    }))
    return Response(result, null)
  } catch (error) {
    return Response(null, new Error('Error en el formato esperado de los datos'))
  }
}

/**
 * @returns The list of system problems from the API
 */
export async function getProblemList(session: Session) {
  const { user } = session
  const FETCH_URL = `${BASE_FETCH_URL}/problemset.php?api=true&user_id=${user}`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(fallBackData, new Error('Error al obtener los datos del servidor'))
  }
  const responseData = await response.json()
  const { data, error } = parseData(responseData)
  if (error) {
    return Response(fallBackData, error)
  }

  return Response(data, null)
}
