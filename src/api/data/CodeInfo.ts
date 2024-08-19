import { type LanguageKey, getLanguageKey } from '../utils/languages'
import { type ResultKey, getResultKey } from '../utils/results'
import { type Session, sessionToCookie } from '../functions/session'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import fallBackData from './CodeInfoFallBack.json'
import scrapeIt from 'scrape-it'

export interface CodeInfo {
  submissionId: string
  problemId: string
  code: string
  user: string
  language: LanguageKey
  time: number
  memory: number
  result: ResultKey
}

const Response = createResponse<CodeInfo>

function scrapeCodeInfo(html: string) {
  const { data } = scrapeIt.scrapeHTML<{ data: string }>(html, {
    data: {
      selector: 'main pre code',
    },
  })
  return data
}

function separateCode(text: string) {
  const lines = text.split('\n')
  let resultLines = []
  const tolerance = 5
  let linesController = 0
  let sw = false
  for (let i = lines.length - 1; i >= 0; i--) {
    const currentLine = lines[i]
    // si la linea contiene varios '*' en su interior pasa
    const asteriskCount = (currentLine.match(/\*/g) || []).length
    if (linesController > tolerance) {
      break
    }
    if (asteriskCount > 5) {
      resultLines.push(currentLine)
      if (sw) {
        break
      }
      sw = true
      continue
    }
    if (sw) {
      resultLines.push(currentLine)
      continue
    }
    linesController++
  }
  const removeSection = resultLines.reverse().join('\n')
  const replaced = text.replace(removeSection, '').trim()
  return {
    replaced,
    result: resultLines
      .slice(1, resultLines.length - 1)
      .reverse()
      .join('\n'),
  }
}

function parseContent(text: string) {
  const lines = text.split('\n')
  let result: Record<string, any> = {
    problemId: (lines.find((line) => line.includes('Problema: ')) || '').replace('Problema: ', ''),
    user: (lines.find((line) => line.includes('Usuario: ')) || '').replace('Usuario: ', ''),
    language: getLanguageKey(
      (lines.find((line) => line.includes('Lenguaje: ')) || '').replace('Lenguaje: ', '')
    ),
    result: getResultKey(
      (lines.find((line) => line.includes('Result: ')) || '').replace('Result: ', '')
    ),
    time: parseInt(
      (lines.find((line) => line.includes('Time:')) || '').replace('Time:', '').split(' ')[0]
    ),
    memory: parseInt(
      (lines.find((line) => line.includes('Memory:')) || '').replace('Memory:', '').split(' ')[0]
    ),
  }
  return result
}

function isValidData(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('No se pudo parsear los datos al formato correcto')
  }
  if (
    isNaN(data.time || NaN) ||
    isNaN(data.memory || NaN) ||
    data.problemId === '' ||
    data.user === '' ||
    data.language === '' ||
    data.result === ''
  ) {
    return new Error(
      'Parece que los datos no son correctos, es posible que la información no este disponible'
    )
  }
  if (
    !data.problemId ||
    !data.user ||
    !data.language ||
    !data.result ||
    !data.time ||
    !data.memory
  ) {
    return new Error('Los campos de los datos no son correctos')
  }
  return null
}

export async function getCodeInfo(session: Session, submissionId: string) {
  const FETCH_URL = `${BASE_FETCH_URL}/showsource.php?id=${submissionId}`
  const response = await fetch(FETCH_URL, {
    headers: {
      cookie: sessionToCookie(session),
    },
  })
  if (!response.ok) {
    return Response(fallBackData as CodeInfo, new Error('Error en el fetching de datos'))
  }
  const html = await response.text()
  const element = scrapeCodeInfo(html)
  const { replaced, result } = separateCode(element)
  const data = parseContent(result)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData as CodeInfo, error)
  }
  const finalData = {
    code: replaced,
    submissionId,
    ...data,
  }
  return Response(finalData as CodeInfo, null)
}
