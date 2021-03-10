import {queryResourcesDescriptions, runQuery } from "./sparql";


export async function getFromCoordinates(lat : string, lng: string) {

  const results = await runQuery(lat,lng);
  //console.log(await results.results.bindings.map(b => b.bag.value));
  console.log(await results);
  //It stops here
  console.log (await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.bag.value)));
  return await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.bag.value));
}
