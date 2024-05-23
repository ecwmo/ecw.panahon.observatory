import { z } from 'zod'

export const forecastDataSchema = z.object({
  timestamp: z.string(),
  wndPow: z.number().nullish(),
  wndPowMin: z.number().nullish(),
  wndPowMax: z.number().nullish(),
  solPow: z.number().nullish(),
  solPowMin: z.number().nullish(),
  solPowMax: z.number().nullish(),
  temp: z.number().nullish(),
  tempMin: z.number().nullish(),
  tempMax: z.number().nullish(),
  wspd: z.number().nullish(),
  wspdMin: z.number().nullish(),
  wspdMax: z.number().nullish(),
  rain: z.number().nullish(),
  rainChance: z.number().nullish(),
  rainStr: z.string().nullish(),
  rainChanceStr: z.string().nullish(),
})

const forecastStationRawSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  forecast: z.object({
    hr: z.array(forecastDataSchema),
    day: z.array(forecastDataSchema),
  }),
})

export const forecastStationsRawSchema = z.record(
  z.string(),
  forecastStationRawSchema,
)

export const forecastImgSchema = z.object({
  imgs: z.array(z.string()),
  cmaps: z.array(z.string()),
})
