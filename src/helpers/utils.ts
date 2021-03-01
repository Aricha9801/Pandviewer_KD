import { SingleObject } from "../reducer";

export function objectToGeojson(
  val: SingleObject
): GeoJSON.Feature<GeoJSON.Geometry, SingleObject > {
  return {
    type: "Feature",
    properties: val,
    geometry: val.shape
  };
}

export function getAllObjectsAsFeature(values: Array<SingleObject >): GeoJSON.Feature[] {
  let geojson: GeoJSON.Feature<GeoJSON.Geometry, SingleObject >[] = [];
  for (const val of values) {
    if (val.shape) {
      geojson.push(objectToGeojson(val));
    }
  }
  return  geojson
}
