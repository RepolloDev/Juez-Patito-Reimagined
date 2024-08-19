export enum ResultStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export const resultTypes = [
  { key: 'P', name: 'Pending' },
  { key: 'PR', name: 'Pending Rejudge' },
  { key: 'C', name: 'Compiling' },
  { key: 'AC', name: 'Accepted' },
  { key: 'PE', name: 'Presentation Error' },
  { key: 'WA', name: 'Wrong Answer' },
  { key: 'TLE', name: 'Time Limit Exceeded' },
  { key: 'MLE', name: 'Memory Limit Exceeded' },
  { key: 'OLE', name: 'Output Limit Exceeded' },
  { key: 'RE', name: 'Runtime Error' },
  { key: 'CE', name: 'Compilation Error' },
  { key: 'default', name: 'Unknown' },
] as const

export type ResultKey = (typeof resultTypes)[number]['key']

export type ResultInfo = {
  name: string
  status: ResultStatus
  description: string
}

export const results: Record<ResultKey, ResultInfo> = {
  P: {
    name: 'Pendiente',
    status: ResultStatus.PENDING,
    description:
      'El estado "Pendiente" indica que tu solución ha sido recibida y está en cola para ser procesada. Por favor, sé paciente mientras llega tu turno.',
  },
  PR: {
    name: 'Rejuzgando',
    status: ResultStatus.PENDING,
    description:
      'El estado "Rejuzgando" significa que los datos de prueba para el problema que resolviste se han actualizado, y tu solución será reevaluada con esta nueva información. Este proceso asegura la justicia y la precisión en la evaluación.',
  },
  C: {
    name: 'Compilando',
    status: ResultStatus.PENDING,
    description:
      'El estado "Compilando" indica que el sistema está compilando tu código. Este es un paso previo a la ejecución de tu solución para verificar su correcto funcionamiento.',
  },
  AC: {
    name: 'Aceptado',
    status: ResultStatus.SUCCESS,
    description:
      'El estado "Aceptado" significa que ha pasado todas las pruebas y cumple con los requisitos del problema. Es el mejor resultado posible.',
  },
  PE: {
    name: 'Error de Presentación',
    status: ResultStatus.WARNING,
    description:
      'El estado "Error de Presentación" ocurre cuando tu solución es correcta en términos de lógica y resultado, pero el formato de salida no coincide exactamente con lo esperado. Revisa espacios y saltos de línea.',
  },
  WA: {
    name: 'Respuesta Incorrecta',
    status: ResultStatus.ERROR,
    description:
      'El estado "Respuesta Incorrecta" indica que tu solución no produce el resultado correcto para los casos de prueba proporcionados. Te recomendamos revisar tu lógica y probar con diferentes entradas.',
  },
  TLE: {
    name: 'Tiempo Límite Excedido',
    status: ResultStatus.WARNING,
    description:
      'El estado "Tiempo Límite Excedido" significa que tu solución no se ejecutó dentro del tiempo máximo permitido para el problema. Considera optimizar tu código para que sea más eficiente.',
  },
  MLE: {
    name: 'Memoria Límite Excedida',
    status: ResultStatus.WARNING,
    description:
      'El estado "Memoria Límite Excedida" aparece cuando tu programa intenta usar más memoria de la que está permitida. Necesitas encontrar una manera de reducir el uso de memoria de tu solución.',
  },
  OLE: {
    name: 'Límite de Salida Excedido',
    status: ResultStatus.WARNING,
    description:
      'El estado "Límite de Salida Excedido" significa que tu programa ha intentado generar más salida de la esperada o permitida. Esto puede ocurrir en bucles infinitos o en la generación excesiva de datos.',
  },
  RE: {
    name: 'Error de Ejecución',
    status: ResultStatus.ERROR,
    description:
      'El estado "Error de Ejecución" indica que tu programa ha fallado durante la ejecución debido a errores como divisiones por cero, acceso a memoria no válida, etc. Revisa tu código en busca de posibles errores de ejecución.',
  },
  CE: {
    name: 'Error de Compilación',
    status: ResultStatus.ERROR,
    description:
      'El estado "Error de Compilación" significa que tu código tiene errores que impiden su compilación. Esto puede deberse a sintaxis incorrecta, tipos de datos incompatibles, etc. Revisa tu código fuente para corregir estos errores.',
  },
  default: {
    name: 'Desconocido',
    status: ResultStatus.ERROR,
    description:
      'El estado "Desconocido" indica que ha ocurrido un error en la obtención del resultado de tu solución, verificalo desde la plataforma oficial.',
  },
}

export const defaultResult = results.default

export function getResultInfo(entry: string): ResultInfo {
  if (entry in results) {
    return results[entry as ResultKey]
  }

  const result = resultTypes.find((type) => type.name === entry)
  if (result) {
    return results[result.key as ResultKey]
  }

  return defaultResult
}

export function isValidResult(entry: string) {
  const result = getResultInfo(entry)
  return result !== defaultResult
}

export function getResultKey(entry: string) {
  const result = resultTypes.find((type) => type.key === entry || type.name === entry)
  return result?.key || 'default'
}
