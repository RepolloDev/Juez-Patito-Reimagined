export enum ErrorType {
  FetchError,
  InvalidResponse,
  ParseError,
}

export type APIError = {
  type: ErrorType
  info: string
}

export type ResponseAPI<T> = {
  data: T | null
  error: Error | null
}

export function createResponse<T>(
  data: T | null,
  error: Error | null
): ResponseAPI<T> {
  return { data, error }
}
