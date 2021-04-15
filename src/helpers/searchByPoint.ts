import {queryResourcesDescriptions, searchResourcesDescriptions,runQuery,searchQuery } from "./sparql";

/**
 * 
 * @param lat 
 * @param lng 
 * @returns 
 */
export async function getFromCoordinates(lat : string, lng: string) {

  const results = await runQuery(lat,lng);
  //console.log(await results.results.bindings.map(b => b.bag.value));
  console.log(await results);
  //It stops here
  console.log (await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.bag.value)));
  return await queryResourcesDescriptions(lat, lng, results.results.bindings.map(b => b.bag.value));
}

/**
 * 
 * @param postcode 
 * @param housenumber 
 * @returns 
 */
export async function getFromTextSearch(postcode : string, housenumber: string) {

  const results = await searchQuery(postcode,housenumber);
  //console.log(await results.results.bindings.map(b => b.bag.value));
  //console.log(await results);
  //It stops here
  //console.log (await searchResourcesDescriptions(postcode, housenumber, results.results.bindings.map(b => b.bag.value)));
  return await searchResourcesDescriptions(postcode, housenumber, results.results.bindings.map(b => b.bag.value));
}
