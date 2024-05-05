import { defaultTheme, Themes } from '@constants/themes'
import { ThemeNames } from '@constants/themes'
import { useState, useEffect } from 'react'
import { themeStore } from '@stores/themeStore'
import { useStore } from '@nanostores/react'
import { getDuckScheme } from '@constants/logoScheme'

interface LogoProps {
  className?: string
  theme?: ThemeNames
  circle?: boolean
}

export default function Logo({ className, theme, circle = false }: LogoProps) {
  const currentTheme = theme ? Themes[theme] : defaultTheme
  const [themeState, setTheme] = useState<ThemeNames>(currentTheme.themeName)
  const storeTheme = useStore(themeStore)
  useEffect(() => {
    setTheme(storeTheme)
  }, [storeTheme])
  const currentScheme = getDuckScheme(themeState)
  const viewBox = circle ? '0 0 450 450' : '50 25 375 375'

  return (
    <span className={className}>
      <svg
        className="object-contain w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={viewBox}>
        <defs>
          <clipPath id="clip_1">
            <use xlinkHref="#path_1" />
          </clipPath>
          <clipPath id="clip_2">
            <use xlinkHref="#path_2" />
          </clipPath>
          <clipPath id="clip_3">
            <use xlinkHref="#path_3" />
          </clipPath>
          <clipPath id="clip_4">
            <use xlinkHref="#path_4" />
          </clipPath>
          <clipPath id="clip_5">
            <use xlinkHref="#path_5" />
          </clipPath>
          <clipPath id="clip_6">
            <use xlinkHref="#path_6" />
          </clipPath>
          <clipPath id="clip_7">
            <use xlinkHref="#path_7" />
          </clipPath>
          <clipPath id="clip_8">
            <use xlinkHref="#path_8" />
          </clipPath>
          <clipPath id="clip_9">
            <use xlinkHref="#path_9" />
          </clipPath>
          <clipPath id="clip_10">
            <use xlinkHref="#path_10" />
          </clipPath>
          <clipPath id="clip_11">
            <use xlinkHref="#path_11" />
          </clipPath>
          <path
            id="path_1"
            d="M223 166s53 6 39 75c-14 70-140 59-167 48-28-11-45-21-48-55-3-35 0-54 0-54s23 31 43 9 133-23 133-23Z"
          />
          <path
            id="path_2"
            d="M0 119c0-49 40-89 90-89s90 40 90 89-40 89-90 89-90-40-90-89Z"
          />
          <path id="path_3" d="M55 29S25 16 19 17 32 0 38 0c7 0 17 29 17 29Z" />
          <path
            id="path_4"
            d="m33 2 2 1c2 1 2 3 1 5-2 2-4 4-3 5 0 2 3 2 6 2 3 1 4 3 4 5l-1 2c-1 2-3 4-6 4-5-1-12-3-13-9s1-10 3-13c1-2 5-3 7-2Z"
          />
          <path
            id="path_5"
            d="m32 37-1 1c-2 2-4 2-6 0-1-3-3-5-4-5-2 0-3 3-4 5-1 3-3 4-6 2l-1-1c-2-1-3-4-2-6 2-5 7-11 13-10 5 1 9 4 11 6 2 3 1 6 0 8Z"
          />
          <path
            id="path_6"
            d="M0 17v-1c0-3 2-4 5-3 2 1 5 2 6 1V7c-1-3 0-5 3-5h2c2 0 5 2 6 4 1 5 1 12-4 16-5 2-10 2-13 1-3 0-5-3-5-6Z"
          />
          <path
            id="path_7"
            d="M8 24C8 12 18 2 30 2s22 10 22 22-10 22-22 22S8 36 8 24Z"
          />
          <path
            id="path_8"
            d="M6 27c0-9 7-15 15-15s15 6 15 15c0 8-7 14-15 14S6 35 6 27Z"
          />
          <path
            id="path_9"
            d="M128 87s-8 10-8 20c-1 11-3 14-6 17-4 2 2 7 6 8 3 2 20 2 38-6 17-8 23-23 25-33 1-9 2-16-11-17-13-2-9 6-20 11-12 4-24 0-24 0Z"
          />
          <path
            id="path_10"
            d="M0 40V29c0-8 2-15 7-21 4-5 9-8 16-8h78c7 0 12 3 16 8 5 6 7 13 7 21v22c0 8-2 15-7 20-4 6-9 9-16 9H23c-7 0-12-3-16-9-5-5-7-12-7-20V40Z"
          />
          <path
            id="path_11"
            d="M74 40V29c0-8 2-15 5-21 4-5 8-8 12-8h16c4 0 8 3 12 8 3 6 5 13 5 21v22c0 8-2 15-5 20-4 6-8 9-12 9H91c-4 0-8-3-12-9-3-5-5-12-5-20V40Z"
          />
        </defs>
        <g id="duck-logo">
          {circle && (
            <g id="circle-background" fillRule="evenodd" stroke="none">
              <path
                id="circle"
                fill={currentScheme['circleColor']}
                d="M0 224a224 224 0 0 1 450 0c0 123-101 223-225 223A224 224 0 0 1 0 224Z"
              />
              <path
                id="water-circle"
                fill={currentScheme['waterColor']}
                d="M36 343c0-18 85-32 189-32s189 14 189 32c0 17-85 107-189 107S36 360 36 343Z"
              />
            </g>
          )}
          <g id="water" fillRule="evenodd" transform="translate(36 311)">
            <path
              id="water-lake"
              fill={currentScheme['waterColor']}
              stroke="none"
              d="M0 32C0 14 85 0 189 0s189 14 189 32c0 17-94 39-198 39S0 49 0 32Z"
            />
            <g
              id="water-lines"
              fill="none"
              stroke={currentScheme['waterLinesColor']}
              strokeWidth="5"
              transform="translate(42 14)">
              <path
                id="Vector"
                d="m31 0-5 2L7 9c-3 2-8 3-7 8l3 1 10 6 2 1m34 2c0 3 2 3 4 4 4 2 10 5 15 5l71 1m27-4h17c8-4 17-5 26-5m25 9c0-1-2-5-1-7s10-2 13-3c13-2 27-1 40-1h8c9-2 6-10 0-14-1-2-4-1-5-2M261 0c0 3 3 3 5 4 3 1 12 5 10 9-1 2-5 2-7 3h-21"
              />
            </g>
          </g>
          <g id="duck" transform="translate(71 54)">
            <g id="duck-body">
              <use
                xlinkHref="#path_1"
                fill={currentScheme['bodyColor']}
                fillRule="evenodd"
              />
              <g clipPath="url(#clip_1)">
                <use
                  xlinkHref="#path_1"
                  fill="none"
                  stroke={currentScheme['bodyStrokeColor']}
                  strokeWidth="6"
                />
              </g>
            </g>
            <g id="duck-head" transform="translate(58)">
              <g id="head-circle">
                <use
                  xlinkHref="#path_2"
                  fill={currentScheme['headColor']}
                  fillRule="evenodd"
                />
                <g clipPath="url(#clip_2)">
                  <use
                    xlinkHref="#path_2"
                    fill="none"
                    stroke={currentScheme['headStrokeColor']}
                    strokeWidth="6"
                  />
                </g>
              </g>
              <g id="middleBody">
                <path
                  id="neck"
                  fill={currentScheme['neckColor']}
                  fillRule="evenodd"
                  stroke="none"
                  d="M42 167s30 19 65 16c35-4 53-23 53-23l20 18-69 14-69-7v-18Z"
                />
                <path
                  id="chest"
                  fill={currentScheme['chestColor']}
                  fillRule="evenodd"
                  stroke="none"
                  d="M31 195s26 10 42 14c15 4 41 22 49 26 7 3 38 17 54 7 15-11 25-24 21-36-4-13-4-20-6-22-2-3-6-11-19-11-13-1-53 16-76 16-24 0-47-12-54-11s-11 17-11 17Z"
                />
              </g>
              <g id="decorator">
                <use
                  xlinkHref="#path_3"
                  fill={currentScheme['headColor']}
                  fillRule="evenodd"
                />
                <g clipPath="url(#clip_3)">
                  <use
                    xlinkHref="#path_3"
                    fill="none"
                    stroke={currentScheme['headStrokeColor']}
                    strokeWidth="6"
                  />
                </g>
              </g>
              <g id="angry-symbol" transform="translate(18 50)">
                <g>
                  <use
                    xlinkHref="#path_4"
                    fill={currentScheme['angrySymbolColor']}
                    fillRule="evenodd"
                  />
                  <g clipPath="url(#clip_4)">
                    <use
                      xlinkHref="#path_4"
                      fill="none"
                      stroke={currentScheme['angrySymbolStrokeColor']}
                      strokeWidth="4"
                    />
                  </g>
                </g>
                <g>
                  <use
                    xlinkHref="#path_5"
                    fill={currentScheme['angrySymbolColor']}
                    fillRule="evenodd"
                  />
                  <g clipPath="url(#clip_5)">
                    <use
                      xlinkHref="#path_5"
                      fill="none"
                      stroke={currentScheme['angrySymbolStrokeColor']}
                      strokeWidth="4"
                    />
                  </g>
                </g>
                <g>
                  <use
                    xlinkHref="#path_6"
                    fill={currentScheme['angrySymbolColor']}
                    fillRule="evenodd"
                  />
                  <g clipPath="url(#clip_6)">
                    <use
                      xlinkHref="#path_6"
                      fill="none"
                      stroke={currentScheme['angrySymbolStrokeColor']}
                      strokeWidth="4"
                    />
                  </g>
                </g>
              </g>
              <g id="eyes" transform="translate(62 40)">
                <g id="left-eye" transform="translate(0 33)">
                  <g>
                    <use xlinkHref="#path_7" fillRule="evenodd" />
                    <g clipPath="url(#clip_7)">
                      <use
                        xlinkHref="#path_7"
                        fill={currentScheme['eyeColor']}
                        stroke={currentScheme['eyeStrokeColor']}
                        strokeWidth="6"
                      />
                    </g>
                  </g>
                  <path
                    id="pupil"
                    fill={currentScheme['pupilColor']}
                    fillRule="evenodd"
                    stroke="none"
                    d="M12 21c0-5 5-10 10-10a10 10 0 1 1 0 20c-5 0-10-4-10-10Z"
                  />
                  <path
                    id="eyebrow"
                    fill={currentScheme['eyebrowColor']}
                    fillRule="evenodd"
                    stroke="none"
                    d="m4 0 41 1h2v1h1v2h1v2h-1v1l-1 1h-1v1h-1L4 8H2V7H1V6L0 5V2h1V1h1l1-1h1Z"
                  />
                </g>
                <g id="Ojo-derecho" transform="translate(80)">
                  <g id="Oval">
                    <use xlinkHref="#path_8" fillRule="evenodd" />
                    <g clipPath="url(#clip_8)">
                      <use
                        xlinkHref="#path_8"
                        fill={currentScheme['eyeColor']}
                        stroke={currentScheme['eyeStrokeColor']}
                        strokeWidth="6"
                      />
                    </g>
                  </g>
                  <path
                    id="eyebrow"
                    fill={currentScheme['eyebrowColor']}
                    fillRule="evenodd"
                    stroke="none"
                    d="M3 18 23 2h5v1h1v1h1v3h-1v1l-1 1L8 24v1H3v-1H2v-5h1v-1Z"
                  />
                  <path
                    id="pupil"
                    fill={currentScheme['pupilColor']}
                    fillRule="evenodd"
                    stroke="none"
                    d="M9 23c0-3 2-5 5-5s5 2 5 5-2 6-5 6-5-3-5-6Z"
                  />
                </g>
              </g>
              <g id="beak">
                <use
                  xlinkHref="#path_9"
                  fill={currentScheme['beakColor']}
                  fillRule="evenodd"
                />
                <g clipPath="url(#clip_9)">
                  <use
                    xlinkHref="#path_9"
                    fill="none"
                    stroke={currentScheme['beakStrokeColor']}
                    strokeWidth="6"
                  />
                </g>
              </g>
            </g>
            <g id="hammer" transform="rotate(-35 255 80)">
              <g
                id="hammer-stick"
                fill={currentScheme['hammerStickColor']}
                fillRule="evenodd"
                stroke="none"
                transform="rotate(35 -74 111)">
                <path
                  id="path3835"
                  d="M40 33c3 5 1 10-3 14-5 3-11 2-14-2-2-4-1-10 3-13 5-3 11-3 14 1Z"
                />
                <path
                  id="path3839"
                  d="M34 25c3 4 1 10-3 13-5 3-11 2-14-2s-1-10 3-13c5-3 11-2 14 2Z"
                />
                <path
                  id="path3841"
                  d="M28 16c2 4 1 10-3 13-5 3-11 3-14-1-3-5-1-10 3-14 5-3 11-2 14 2Z"
                />
              </g>
              <g id="hammer-body">
                <use
                  xlinkHref="#path_10"
                  fill={currentScheme['hammerBodyColor']}
                  fillRule="evenodd"
                />
                <g clipPath="url(#clip_10)">
                  <use
                    xlinkHref="#path_10"
                    fill="none"
                    stroke={currentScheme['hammerStrokeColor']}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  />
                </g>
              </g>
              <g id="hammer-face">
                <use
                  xlinkHref="#path_11"
                  fill={currentScheme['hammerFaceColor']}
                  fillRule="evenodd"
                />
                <g clipPath="url(#clip_11)">
                  <use
                    xlinkHref="#path_11"
                    fill="none"
                    stroke={currentScheme['hammerStrokeColor']}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  />
                </g>
              </g>
            </g>
            <path
              id="wing"
              fill={currentScheme['bodyColor']}
              fillRule="evenodd"
              stroke={currentScheme['bodyStrokeColor']}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M140 222c-16-18-51-17-58-5-8 11 12 18 12 18s-19-3-17 10 25 10 25 10-24 6-11 14c12 8 58 4 57-25"
            />
            <g
              id="duck-tie"
              fillRule="evenodd"
              stroke="none"
              transform="translate(195 152)">
              <path
                id="Vector"
                fill={currentScheme['tieBodyColor']}
                d="M10 20s-7 55 1 70c8 14 20 17 19 5-1-13 3-20 7-10 4 9 8 18 11 8s4-14 7-13c3 2 3 7 8 5 4-1 2-17 9-10 8 7 6-3 4-8s-4-25-20-38L33 11l-23 9Z"
              />
              <path
                id="Rectangle"
                fill={currentScheme['tieHeadColor']}
                d="m8 8 19-6h5v1h2v1h1v1h1v2h1l2 8 1 1v3h-1v2l-1 1-1 1v1h-2v1h-1l-19 6h-4l-1-1H9l-1-1H7v-1H6v-2H5l-2-8v-1H2v-3l1-1v-1l1-1v-1h1V9h2V8h1Z"
              />
            </g>
          </g>
        </g>
      </svg>
    </span>
  )
}
