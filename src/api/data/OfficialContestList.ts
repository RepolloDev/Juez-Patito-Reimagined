import { type Session } from '../functions/session'
import scrapeIt from 'scrape-it'
import { BASE_FETCH_URL } from '../contants'
import { createResponse } from '../utils/response'
import fallBackData from './OfficialCountestListFallBack.json'
import { getCache, setCache } from '../utils/cache'

interface OfficialContest {
  id: string
  name: string
}

const Response = createResponse<OfficialContest[]>

function isValidOfficialContest(data: any) {
  if (data === null || typeof data !== 'object') {
    return new Error('Error en los tipos de datos obtenidos al parsearlos')
  }
  if (!('id' in data) || !('name' in data)) {
    return new Error('Error en las propiedades de los datos')
  }
  if (data.id === '' || data.name === '') {
    return new Error('Error la momento de scrapear los datos')
  }
  return null
}

function isValidData(data: any) {
  if (!Array.isArray(data)) {
    return new Error('Error en el tipo de datos obtenidos')
  }
  if (data.length > 0) {
    const testElement = data[0]
    const error = isValidOfficialContest(testElement)
    if (error) {
      return error
    }
  }
  return null
}

function scrapeOffcialContestList(html: string) {
  const { data } = scrapeIt.scrapeHTML<{ data: OfficialContest[] }>(html, {
    data: {
      listItem: 'main table tbody tr',
      data: {
        id: 'td:nth-child(1)',
        name: 'td:nth-child(2)',
      },
    },
  })
  return data
}

export async function getOfficialContestList(session: Session) {
  const CACHE_KEY = 'OfficialContestList'
  const cachedData = await getCache(CACHE_KEY)
  if (cachedData) {
    return Response(cachedData, null)
  }

  const FETCH_URL = `${BASE_FETCH_URL}/icpc_contest.php`
  const response = await fetch(FETCH_URL)
  if (!response.ok) {
    return Response(fallBackData, new Error('Error al hacer fetching de datos'))
  }
  const html = await response.text()
  const data = scrapeOffcialContestList(html)
  const error = isValidData(data)
  if (error instanceof Error) {
    return Response(fallBackData, error)
  }

  await setCache(CACHE_KEY, data)
  return Response(data, null)
}
