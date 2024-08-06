export interface UserRank {
  user_id: string
  nick: string
  solved: number
  submit: number
}

export async function getRakingList(): Promise<UserRank[]> {
  const fetchURL = 'https://jv.umsa.bo/oj/ranklist.php?api=true'
  const response = await fetch(fetchURL, { method: 'GET' })
  if (response.ok) {
    const { data } = await response.json()
    return data as UserRank[]
  }
  return []
}

// Obtener una lista de 20 usuarios por pagina
export async function getRankingPage(page: number): Promise<UserRank[]> {
  const response = await getRakingList()
  const start = (page - 1) * 100
  const end = start + 100
  return response.slice(start, end)
}