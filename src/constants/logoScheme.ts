import { ThemeNames } from './themes'

export interface DuckScheme {
  // Circle option
  circleColor: string
  waterColor: string
  waterLinesColor: string

  // Hammer
  hammerBodyColor: string
  hammerFaceColor: string
  hammerStickColor: string
  hammerStrokeColor: string

  // Tie
  tieHeadColor: string
  tieBodyColor: string

  // Body
  bodyColor: string
  bodyStrokeColor: string
  chestColor: string
  neckColor: string

  // Angry Symbol
  angrySymbolColor: string
  angrySymbolStrokeColor: string

  // head
  headColor: string
  headStrokeColor: string
  beakColor: string
  beakStrokeColor: string
  pupilColor: string
  eyebrowColor: string
  eyeColor: string
  eyeStrokeColor: string
}

const Schemes: Record<ThemeNames, DuckScheme> = {
  [ThemeNames.LIGHT]: {
    circleColor: '#EF9995',
    waterColor: '#A4CACB',
    waterLinesColor: '#E0FEFF',
    hammerBodyColor: '#985f3a',
    hammerFaceColor: '#af8060',
    hammerStickColor: '#79431f',
    hammerStrokeColor: '#664027',
    tieHeadColor: '#d4d4d4',
    tieBodyColor: '#efefef',
    angrySymbolColor: '#fe5367',
    angrySymbolStrokeColor: '#000000',
    bodyColor: '#F9E897',
    bodyStrokeColor: '#B79E00',
    chestColor: '#F9E897',
    neckColor: '#F9E897',
    headColor: '#F9E897',
    headStrokeColor: '#B79E00',
    beakColor: '#d97706',
    beakStrokeColor: '#a95b00',
    pupilColor: '#ffffff',
    eyebrowColor: '#000000',
    eyeColor: '#000000',
    eyeStrokeColor: '#000000',
  },
  [ThemeNames.DARK]: {
    circleColor: '#ffb86c',
    waterColor: '#7990d8',
    waterLinesColor: '#92c5f7',
    hammerBodyColor: '#985f3a',
    hammerFaceColor: '#af8060',
    hammerStickColor: '#79431f',
    hammerStrokeColor: '#664027',
    tieHeadColor: '#d4d4d4',
    tieBodyColor: '#efefef',
    angrySymbolColor: '#fe5367',
    angrySymbolStrokeColor: '#000000',
    bodyColor: '#e0d5b1',
    bodyStrokeColor: '#797361',
    chestColor: '#a99283',
    neckColor: '#ffffff',
    headColor: '#50fa7b',
    headStrokeColor: '#468456',
    beakColor: '#ffb86c',
    beakStrokeColor: '#9b7245',
    eyebrowColor: '#000000',
    pupilColor: '#ffffff',
    eyeColor: '#000000',
    eyeStrokeColor: '#000000',
  },
  [ThemeNames.WHITE]: {
    circleColor: '#dddddd',
    waterColor: '#d3fcfd',
    waterLinesColor: '#72c5c9',
    hammerBodyColor: '#985f3a',
    hammerFaceColor: '#af8060',
    hammerStickColor: '#79431f',
    hammerStrokeColor: '#664027',
    tieHeadColor: '#000000',
    tieBodyColor: '#000000',
    angrySymbolColor: '#fe5367',
    angrySymbolStrokeColor: '#000000',
    bodyColor: '#ffffff',
    bodyStrokeColor: '#000000',
    chestColor: '#ffffff',
    neckColor: '#ffffff',
    headColor: '#ffffff',
    headStrokeColor: '#000000',
    beakColor: '#d97706',
    beakStrokeColor: '#a95b00',
    eyebrowColor: '#000000',
    pupilColor: '#ffffff',
    eyeColor: '#000000',
    eyeStrokeColor: '#000000',
  },
  [ThemeNames.BLACK]: {
    circleColor: '#222222',
    waterColor: '#b7c5cc',
    waterLinesColor: '#f9f9f9',
    hammerBodyColor: '#985f3a',
    hammerFaceColor: '#af8060',
    hammerStickColor: '#79431f',
    hammerStrokeColor: '#664027',
    tieHeadColor: '#d4d4d4',
    tieBodyColor: '#efefef',
    angrySymbolColor: '#fe5367',
    angrySymbolStrokeColor: '#000000',
    bodyColor: '#000000',
    bodyStrokeColor: '#ffffff',
    chestColor: '#000000',
    neckColor: '#000000',
    headColor: '#000000',
    headStrokeColor: '#ffffff',
    beakColor: '#ffb86c',
    beakStrokeColor: '#9b7245',
    eyebrowColor: '#ffffff',
    pupilColor: '#ffffff',
    eyeColor: '#000000',
    eyeStrokeColor: '#ffffff',
  },
}

export function getDuckScheme(theme: ThemeNames): DuckScheme {
  return Schemes[theme]
}
