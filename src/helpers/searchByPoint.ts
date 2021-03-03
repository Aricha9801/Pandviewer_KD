import {queryResourcesDescriptions, runQuery } from "./sparql";


export async function getFromCoordinates(lat : string, lng: string) {

  const results = await runQuery(lat,lng,'100.0');

  return await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.registratie.value));
}
