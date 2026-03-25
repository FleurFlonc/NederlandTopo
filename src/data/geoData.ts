import rawGeo from './provincies.geojson?raw'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GEO_DATA = JSON.parse(rawGeo) as { type: string; features: any[] }
