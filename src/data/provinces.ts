export interface Province {
  key: string
  name: string
  capital: string
  color: string
  capitalCoords: [number, number] // [lon, lat]
}

export const PROVINCES: Province[] = [
  { key: 'groningen',     name: 'Groningen',     capital: 'Groningen',          color: '#E8A0BF', capitalCoords: [6.5665, 53.2194] },
  { key: 'friesland',     name: 'Friesland',     capital: 'Leeuwarden',         color: '#A8D8A8', capitalCoords: [5.7999, 53.2012] },
  { key: 'drenthe',       name: 'Drenthe',       capital: 'Assen',              color: '#F4C87A', capitalCoords: [6.5622, 52.9925] },
  { key: 'overijssel',    name: 'Overijssel',    capital: 'Zwolle',             color: '#90CAF9', capitalCoords: [6.0919, 52.5168] },
  { key: 'flevoland',     name: 'Flevoland',     capital: 'Lelystad',           color: '#CE93D8', capitalCoords: [5.4897, 52.5185] },
  { key: 'gelderland',    name: 'Gelderland',    capital: 'Arnhem',             color: '#80CBC4', capitalCoords: [5.9116, 51.9851] },
  { key: 'utrecht',       name: 'Utrecht',       capital: 'Utrecht',            color: '#FFAB91', capitalCoords: [5.1214, 52.0907] },
  { key: 'noord-holland', name: 'Noord-Holland', capital: 'Haarlem',            color: '#EF9A9A', capitalCoords: [4.6462, 52.3874] },
  { key: 'zuid-holland',  name: 'Zuid-Holland',  capital: 'Den Haag',           color: '#F48FB1', capitalCoords: [4.3007, 52.0705] },
  { key: 'zeeland',       name: 'Zeeland',       capital: 'Middelburg',         color: '#B39DDB', capitalCoords: [3.6136, 51.4988] },
  { key: 'noord-brabant', name: 'Noord-Brabant', capital: "'s-Hertogenbosch",   color: '#A5D6A7', capitalCoords: [5.3083, 51.6978] },
  { key: 'limburg',       name: 'Limburg',       capital: 'Maastricht',         color: '#80DEEA', capitalCoords: [5.6909, 50.8514] },
]
