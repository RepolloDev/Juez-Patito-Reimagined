import { type Session, sessionToCookie } from './session'
import { type LanguageKey, getLanguageInfo } from '../utils/languages'
import { createResponse } from '../utils/response'
import { BASE_FETCH_URL } from '../contants'

const Response = createResponse<boolean>

export interface SubmitCodeData {
  problemId?: string
  contestId?: string
  codeSource: string
  language: LanguageKey
}

function parseData(data: SubmitCodeData) {
  const { codeSource, language, problemId, contestId } = data
  const { id } = getLanguageInfo(language)

  return `source=${codeSource}&cid=${contestId || ''}&pid=${problemId || ''}&lang=${id}`
}

/**
 * - For only SystemProblem, requires problemId (1000 >=)
 * - For ContestProblem, requires contestId and problemId, where problemId is the problem number
 */
export async function submitCode(session: Session, data: SubmitCodeData) {
  const body = parseData(data)
  const FETCH_URL = `${BASE_FETCH_URL}/submitpage.php`
  const response = await fetch(FETCH_URL, {
    method: 'POST',
    body,
    headers: {
      cookie: sessionToCookie(session),
    },
  })

  if (!response.redirected) {
    return Response(false, new Error('Error al realizar la subida del código'))
  }

  const { redirected } = response
  return Response(
    redirected,
    !redirected
      ? new Error(
          'Los datos enviados no son válidos, el identificador del concurso o problema no son válidos, vuelva al principio porfavor'
        )
      : null
  )
}
