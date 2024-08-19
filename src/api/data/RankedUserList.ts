import { type Session } from '../functions/session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import fallBackData from './RankedUserListFallBack.json'

export interface RankedUser {
  position: number
  user: string
  userFullName: string
  submissionCount: number
  submissionAcceptedCount: number
}

const Response = createResponse<RankedUser[]>

function parseData(data: any) {
  if (data === null || typeof data !== 'object') {
    return Response(
      null,
      new Error(
        'Error en el formato esperado de los datos, la respuesta no es un objeto'
      )
    )
  }
  if (!('data' in data)) {
    return Response(
      null,
      new Error(
        'Error en el formato esperado de los datos, la respuesta no contiene el campo data'
      )
    )
  }

  const { data: problems } = data
  if (!Array.isArray(problems)) {
    return Response(
      null,
      new Error(
        'Error en el formato esperado de los datos, el campo data no es un array'
      )
    )
  }
  try {
    const result = problems.map((item, index) => ({
      position: index + 1,
      user: item.user_id,
      userFullName: item.nick,
      submissionCount: item.submit,
      submissionAcceptedCount: item.solved,
    }))
    return Response(result, null)
  } catch (error) {
    return Response(
      null,
      new Error('Error en el formato esperado de los datos')
    )
  }
}

export async function getRankedUserList(session: Session) {
  const FETCH_URL = `${BASE_FETCH_URL}/ranklist.php?api=true`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(
      fallBackData,
      new Error('Error al obtener la lista de usuarios')
    )
  }
  const responseData = await response.json()
  const { data, error } = parseData(responseData)
  if (error instanceof Error) {
    return Response(fallBackData, error)
  }
  return Response(data, null)
}
