import { type ResultKey, getResultKey } from '../utils/results'
import { type LanguageKey } from '../utils/languages'
import { createResponse } from '../utils/response'
import { type Session } from '../functions/session'
import scrapeIt from 'scrape-it'
import { BASE_FETCH_URL } from '../contants'
import fallBackData from './SubmissionListFallBack.json'

export interface Submission {
  runId: string
  user: string
  problemId: string
  time: number
  memory: number
  result: ResultKey
  language: LanguageKey
  submissionDate: string
}

const Response = createResponse<Submission[]>

function scrapeSubmissionList(html: string) {
  const { data } = scrapeIt.scrapeHTML<{ data: Submission[] }>(html, {
    data: {
      listItem: 'main table tbody tr',
      data: {
        runId: 'td:nth-child(1)',
        user: 'td:nth-child(2)',
        problemId: 'td:nth-child(3)',
        language: 'td:nth-child(4)',
        result: {
          selector: 'td:nth-child(5)',
          convert: (text) => {
            return getResultKey(text)
          },
        },
        memory: 'td:nth-child(7)',
        time: 'td:nth-child(8)',
        submissionDate: 'td:nth-child(9)',
      },
    },
  })
  return data
}

function isValidSubmission(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error en el formato de los datos scrapedos')
  }
  if (data.runId === '' || data.user === '' || data.problemId === '') {
    return new Error('Parece que los datos no son correctos o no están disponibles')
  }
  if (new Date(data.submissionDate).toString() === 'Invalid Date') {
    return new Error('Error en el formato de la fecha de la submission')
  }
  return null
}

function isValidData(data: any) {
  if (!Array.isArray(data)) {
    return new Error('Error en el scraping de la lista de submissions')
  }
  if (data.length > 0) {
    const testElement = data[0]
    const error = isValidSubmission(testElement)
    if (error) {
      return error
    }
  }
  return null
}

export async function getSubmissionList(session: Session, contestId: string) {
  // This function not cache the data because the data is updated in real time

  const FETCH_URL = contestId
    ? `${BASE_FETCH_URL}/status.php?cid=${contestId}`
    : `${BASE_FETCH_URL}/status.php`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(
      fallBackData as Submission[],
      new Error('Error en el fetching de la lista de submissions')
    )
  }
  const html = await response.text()
  const data = scrapeSubmissionList(html)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData as Submission[], error)
  }

  return Response(data, null)
}
