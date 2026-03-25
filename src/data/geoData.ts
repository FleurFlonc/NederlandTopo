import rawGeo from './provincies.geojson?raw'

// D3 spherical winding: exterior rings must be CW in lon/lat space so D3 fills
// the province itself (not the rest of the world). The source GeoJSON has CCW
// exterior rings, which D3 interprets as "fill the complement". We reverse them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixWinding(geo: { type: string; features: any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rev = (rings: any[][]) => rings.map((ring, i) => i === 0 ? [...ring].reverse() : ring)
  return {
    ...geo,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    features: geo.features.map((f: any) => ({
      ...f,
      geometry:
        f.geometry.type === 'Polygon'
          ? { ...f.geometry, coordinates: rev(f.geometry.coordinates) }
          : f.geometry.type === 'MultiPolygon'
          ? { ...f.geometry, coordinates: f.geometry.coordinates.map(rev) }
          : f.geometry,
    })),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GEO_DATA = fixWinding(JSON.parse(rawGeo)) as { type: string; features: any[] }
